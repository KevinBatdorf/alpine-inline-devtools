const Loader = function (Viewer, theme) {
    return {
        alpines: [],
        open: false,
        observer: null,
        windowRef: null,
        viewerScript: Viewer,
        theme: theme,
        start() {
            this.alpines = document.querySelectorAll('[x-data]:not([x-ignore])')
            if (!this.alpines) return
            this.registerAlpines(this.alpines)

            // If the window is already open, refresh it
            if (sessionStorage.getItem('alpine-devtools')) {
                this.openWindow()
                this.updateAlpines()
            }
        },
        focusDevTools() {
            if (!this.windowRef) {
                this.openWindow()
            }
            this.windowRef.focus()
        },
        registerAlpines(alpines) {
            this.observer = new MutationObserver(mutations => {
                this.updateAlpines()
            })
            alpines.forEach(alpine => {
                // This will trigger a mutation when internal data changes but no visual mutation is observed
                alpine.setAttribute('x-bind:data-last-refresh', 'Date.now()')
                this.observer.observe(alpine, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true,
                })
            })
        },
        updateAlpines() {
            this.checkIfNewAlpinesWereAddedAndRegisterThem()
            if (this.windowRef) {
                this.windowRef.alpines = this.alpines
                const viewer = this.windowRef.document.querySelector('#alpine-devtools-viewer')
                if (!viewer) return
                if (viewer.__x.$data.editing.length) return
                typeof viewer.__x !== 'undefined' && viewer.__x.updateElements(viewer)
            }
        },
        checkIfNewAlpinesWereAddedAndRegisterThem() {
            const fresh = [...document.querySelectorAll('[x-data]:not([x-devtools-ignore])')]
            const newAlpines = fresh.filter(alpine => {
                return ![...this.alpines].includes(alpine)
            })
            if (newAlpines) {
                this.alpines = document.querySelectorAll('[x-data]:not([x-devtools-ignore])')
                this.registerAlpines(newAlpines)
            }
        },
        openWindow() {
            this.windowRef = window.open('', 'alpine-devtools', 'width=450, height=650, left=100, top=100')
            if (!this.windowRef) return sessionStorage.removeItem('alpine-devtools')
            // Starting color. Consider some loading animation
            this.windowRef.document.body.style.backgroundColor = '#1a202c'
            this.windowRef.document.body.innerHTML = ''
            this.windowRef.document.title = 'Alpine DevTools'
            this.windowRef.alpines = this.alpines

            // TODO: take in AlpineJS version option
            if (!this.windowRef.document.getElementById('alpine-devtools-script')) {
                const alpineScript = this.windowRef.document.createElement('script')
                alpineScript.id = 'alpine-devtools-script'
                const version = window.Alpine.version || '2.x.x'
                alpineScript.src = `https://cdn.jsdelivr.net/gh/alpinejs/alpine@v${version}/dist/alpine.min.js`
                this.windowRef.document.head.appendChild(alpineScript)
            }

            // TODO: This should eventually be settable somehow
            if (!this.windowRef.document.getElementById('alpine-devtools-font')) {
                const font = this.windowRef.document.createElement('link')
                font.id = 'alpine-devtools-font'
                font.rel = 'stylesheet'
                font.href = "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap"
                this.windowRef.document.head.appendChild(font)
            }

            this.setTheme(this.theme)

            // Add the dev tools component function and remove any previous
            const oldScript = this.windowRef.document.getElementById('devtools-script')
            oldScript && oldScript.remove()
            const devtoolsScript = this.windowRef.document.createElement('script')
            devtoolsScript.id = 'devtools-script'
            devtoolsScript.textContent = `window.devtools = ${this.viewerScript}`
            this.windowRef.document.head.appendChild(devtoolsScript)

            this.setUpPopupData()
        },
        setTheme(theme) {
            if (!this.windowRef) {
                this.openWindow()
            }
            this.theme = theme ? theme : this.theme
            // Add the theme and remove any previous (Can possibly support theme swapping)
            const oldTheme = this.windowRef.document.getElementById('alpine-devtools-theme')
            oldTheme && oldTheme.remove()
            const devtoolsTheme = this.windowRef.document.createElement('style')
            devtoolsTheme.id = 'alpine-devtools-theme'
            devtoolsTheme.textContent = this.theme
            this.windowRef.document.head.appendChild(devtoolsTheme)
        },
        setUpPopupData() {
            const viewer = this.windowRef.document.createElement('div')
            viewer.id = 'alpine-devtools-viewer'
            viewer.setAttribute('x-data', 'window.devtools(window.alpines)')
            viewer.innerHTML = this.viewerShell()

            // Add the reference to the session so we don't need to reopen the popup everytime
            sessionStorage.setItem('alpine-devtools', this.windowRef.name)

            this.open = true
            window.alpineDevTools.open = true
            setTimeout(() => {
                this.windowRef.document.body.appendChild(viewer)
            }, 500)

            this.windowRef.addEventListener('beforeunload', () => {
                sessionStorage.removeItem('alpine-devtools')
                this.windowRef = null
                this.open = false
                window.alpineDevTools.open = false
            })
        },
        viewerShell() {
            return `
            <div
                class="flex font-mono flex-col justify-between fixed inset-0 bg-background py-2 max-w-screen overflow-hidden"
                x-cloak
                x-show="open">
                <div
                    class="divide-y-2 divide-component-divider space-y-3 -mt-5 pb-5 p-2 overflow-scroll">
                    <template x-for="(alpine, i) in [...alpines]" :key="i">
                        <div class="pt-2">
                            <div class="pl-4 overflow-hidden">
                                <div x-text="computeTitle(alpine)" class="mb-1 -ml-3 font-extrabold text-component-title"></div>
                                <template x-if="!getAlpineData(alpine).length">
                                    <p class="text-sm text-value-color">No data found</p>
                                </template>
                                <template x-for="[key, value] of getAlpineData(alpine)" :key="key">
                                    <div
                                        class="leading-none"
                                        x-html="getItem(key, value, i)"
                                        x-show="getType(value) !== 'function'">
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
                <div
                    x-html="getStatusMessage()"
                    class="flex items-center justify-between border-t border-component-divider text-status-text leading-none mx-2 pt-1.5" style="font-size:11px;">
                </div>
            </div>`
        },
    }
}

export default Loader
