const Loader = function (Viewer, theme) {
    return {
        alpines: [],
        open: false,
        observer: null,
        windowRef: null,
        viewerScript: Viewer,
        theme: theme,
        iframe: null,
        type: 'Iframe',
        sessionId : Date.now() + Math.floor(Math.random() * 1000000),
        start() {
            this.alpines = document.querySelectorAll('[x-data]:not([x-devtools-ignore])')
            if (!this.alpines) return
            this.registerAlpines(this.alpines)

            // If the window is already open, refresh it
            if (sessionStorage.getItem('alpine-devtools')) {
                this.type = sessionStorage.getItem('alpine-devtools')
                this[`open${this.type}`]()
                this.updateAlpines()
            }
        },
        focusDevTools() {
            if (!this.windowRef) {
                this[`open${this.type}`]()
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
        openIframe() {
            this.iframe = document.getElementById('alpine-devtools-iframe')
            if (!this.iframe) {
                const state = sessionStorage.getItem('alpine-devtools-iframe-state')
                this.iframe = document.createElement('iframe')
                this.iframe.id = 'alpine-devtools-iframe'
                this.iframe.width = 450
                this.iframe.height = 650
                this.iframe.setAttribute('x-data', state ? state : '{height: 650, margin: "0.75rem"}')
                this.iframe.setAttribute('x-devtools-ignore', '')
                this.iframe.setAttribute('x-on:collapse-devtools.window', 'height = height === 650 ? 27 : 650;margin = margin === "0.75rem" ? "0" : "0.75rem";sessionStorage.setItem("alpine-devtools-iframe-state", `{height: ${height}, margin: "${margin}"}`)')
                this.iframe.setAttribute('x-bind:style', '`position:fixed;box-shadow:0 25px 50px -12px rgba(0,0,0,.25)!important;bottom:0!important;right:0!important;margin:${margin}!important;background-color:#252f3f!important;height: ${height}px!important`')
                document.body.appendChild(this.iframe)
            }
            this.windowRef = this.iframe.contentWindow
            this.type = 'Iframe'
            this.load()
        },
        openPopup() {
            if (this.iframe) {
                this.iframe.parentNode.removeChild(this.iframe)
                this.iframe = null
            }
            this.windowRef = window.open('', 'alpine-devtools', 'width=450, height=650, left=100, top=100')
            this.type = 'Popup'
            this.load()
        },
        load() {
            if (!this.windowRef) {
                sessionStorage.removeItem('alpine-devtools')
                this[`open${this.type}`]()
            }
            // Starting color. Consider some loading animation
            this.windowRef.document.body.style.backgroundColor = '#1a202c'
            this.windowRef.document.body.style.height = '100%'
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
            devtoolsScript.textContent = `window.Viewer = ${this.viewerScript}`
            this.windowRef.document.head.appendChild(devtoolsScript)

            this.loadView()
        },
        setTheme(theme) {
            if (!this.windowRef) {
                this[`open${this.type}`]()
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
        loadView() {
            const viewer = this.windowRef.document.createElement('div')
            viewer.id = 'alpine-devtools-viewer'
            viewer.setAttribute('x-data', `window.Viewer('${this.type}')`)
            viewer.setAttribute('x-init', 'setup()')
            viewer.setAttribute('x-on:open-alpine-devtools-popup.window', `
                window.parent.dispatchEvent(new CustomEvent('open-alpine-devtools-popup', {
                    bubbles: true,
                    event: 'Popup'
                }))`)
            viewer.setAttribute('x-init', 'setup()')

            // Add the reference to the session so we don't need to reopen the popup everytime
            sessionStorage.setItem('alpine-devtools', this.type)

            this.open = true
            window.alpineDevTools.open = true
            setTimeout(() => {
                this.windowRef.document.body.appendChild(viewer)
            }, 500)

            this.windowRef.addEventListener('beforeunload', () => {
                sessionStorage.removeItem('alpine-devtools')
                this.type === 'popup' && this.windowRef.close()
                this.windowRef = null
                this.open = false
                window.alpineDevTools.open = false
            })
        },
    }
}

export default Loader
