window.alpineDevToolsHandler = function (position) {
    return {
        alpines: [],
        open: false,
        observer: null,
        windowRef: null,
        start() {
            this.alpines = document.querySelectorAll('[x-data]:not(#alpine-devtools)')
            if (!this.alpines) return
            this.registerAlpines(this.alpines)

            // If the window is already open, refresh it
            if (sessionStorage.getItem('alpine-devtools')) {
                this.openWindow()
                this.updateAlpines()
            }
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
            const fresh = [...document.querySelectorAll('[x-data]:not(#alpine-devtools)')]
            const newAlpines = fresh.filter(alpine => {
                return ![...this.alpines].includes(alpine)
            })
            if (newAlpines) {
                this.alpines = document.querySelectorAll('[x-data]:not(#alpine-devtools)')
                this.registerAlpines(newAlpines)
            }
        },
        openWindow() {
            this.windowRef = window.open('', 'alpine-devtools', 'width=450, height=650, left=100, top=100')
            if (!this.windowRef) return sessionStorage.removeItem('alpine-devtools')
            this.windowRef.document.body.style.backgroundColor = '#1a202c'
            this.windowRef.document.body.innerHTML = ''
            this.windowRef.document.title = 'Alpine DevTools'
            this.windowRef.alpines = this.alpines

            if (!this.windowRef.document.getElementById('alpine-devtools-script')) {
                const alpineScript = this.windowRef.document.createElement('script')
                alpineScript.id = 'alpine-devtools-script'
                const version = window.Alpine.version || '2.x.x'
                alpineScript.src = `https://cdn.jsdelivr.net/gh/alpinejs/alpine@v${version}/dist/alpine.min.js`
                this.windowRef.document.head.appendChild(alpineScript)
            }

            if (!this.windowRef.document.getElementById('tailwindcss-devtools-style')) {
                const tailwindCSS = this.windowRef.document.createElement('link')
                tailwindCSS.id = 'tailwindcss-devtools-style'
                tailwindCSS.href = 'https://unpkg.com/tailwindcss@^1.x/dist/tailwind.min.css'
                tailwindCSS.rel = 'stylesheet'
                this.windowRef.document.head.appendChild(tailwindCSS)
            }

            if (!this.windowRef.document.getElementById('devtools-script')) {
                const devtoolsScript = this.windowRef.document.createElement('script')
                devtoolsScript.id = 'devtools-script'
                devtoolsScript.setAttribute('type', 'text/javascript')
                // TODO: possibly throw an error if this fails
                devtoolsScript.src = window.alpineDevToolsScriptURL
                this.windowRef.document.head.appendChild(devtoolsScript)
            }

            this.setUpPopupData()
        },
        setUpPopupData() {
            const viewer = this.windowRef.document.createElement('div')
            viewer.id = 'alpine-devtools-viewer'
            viewer.setAttribute('x-data', 'window.alpineDevToolsViewer(window.alpines)')
            viewer.innerHTML = this.viewerHTML()

            // Add the reference to the session so we don't need to reopen the popup everytime
            sessionStorage.setItem('alpine-devtools', this.windowRef.name)

            this.open = true
            setTimeout(() => {
                this.windowRef.document.body.appendChild(viewer)
            }, 500)

            this.windowRef.addEventListener('beforeunload', () => {
                sessionStorage.removeItem('alpine-devtools')
                this.windowRef = null
                this.open = false
            })
        },
        viewerHTML() {
            return `
            <div
                class="flex flex-col justify-between fixed inset-0 bg-gray-900 text-gray-400 py-2 max-w-screen overflow-hidden"
                x-cloak
                x-show="open">
                <div
                    class="divide-y-2 divide-gray-800 space-y-5 -mt-5 pb-5 p-2 overflow-scroll">
                    <template x-for="(alpine, i) in [...alpines]" :key="i">
                        <div class="pt-5">
                            <div class="pl-4 overflow-hidden">
                                <div x-text="computeTitle(alpine)" class="mb-1 -ml-3 font-extrabold" style="color:#d8dee9"></div>
                                <template x-if="!getAlpineData(alpine).length"><p class="text-sm">No data found</p></template>
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
                    class="border-t border-gray-700 text-gray-500 leading-none mx-2" style="font-size:11px; padding-top:5px;">
                </div>
            </div>`
        },
    }
}

window.alpineDevToolsViewer = function () {
    return {
        editing: '',
        computeTitle(alpine) {
            return alpine.getAttribute('x-title')
                || alpine.getAttribute('aria-label')
                || alpine.getAttribute('x-id')
                || alpine.id
                || this.convertFunctionName(alpine.getAttribute('x-data'))
                || `<${alpine.tagName.toLowerCase()}>`
        },
        getAlpineData(alpine) {
            if (!alpine.__x) return []
            return Object.entries(alpine.__x.getUnobservedData())
        },
        getType(value) {
            // Leave as object for now until we need it
            // if (value === null) {
            //     return 'null'
            // }
            if (Array.isArray(value)) {
                return 'array'
            }
            if (typeof value === 'function') {
                return 'function'
            }
            return typeof value
        },
        updateAlpine(type, alpineIndex, key, value) {
            switch (type) {
                case 'boolean':
                    window.alpines[alpineIndex].__x.$data[key] = (value !== 'true')
                    break
                case 'string':
                    window.alpines[alpineIndex].__x.$data[key] = value
                    break
            }

        },
        getItem(key, value, alpineIndex = null) {
            const id = Date.now() + Math.floor(Math.random() * 1000000)
            const type = this.getType(value)
            return `
            <span class="relative py-1 pl-2 ${type === 'string' ? 'flex' : 'inline-block'}">
                <span class="absolute left-0 -ml-3">
                    ${this.getGutterAction(id, type, alpineIndex, key, value)}
                </span>
                <span style="color:#4aea8b" class="text-serif whitespace-no-wrap mr-2">
                    <label for="${id}" class="inline-block" style="min-width:1rem">${key}</label>
                    <span class="text-white">:</span>
                    <span style="color:#8ac0cf" class="bg-gray-800 px-1 text-xs">${type}</span>
                </span>
                <span
                    class="relative w-full ${type === 'boolean' ? 'cursor-pointer' : '' }"
                    style="color:#d8dee9">
                        <span
                            x-show="editing !== '${alpineIndex}-${key}'"
                            :class="{'absolute': editing === '${alpineIndex}-${key}'}"
                            class="relative z-10">
                            ${this.getValue(id, type, alpineIndex, key, value)}
                        </span>
                        ${this.getEditField(id, type, alpineIndex, key, value)}
                </span>
            </span>`
        },
        getEditField(id, type, alpineIndex, key, value) {
            switch (type) {
                case 'string':
                    return `<span
                        x-ref="editor-${alpineIndex}-${key}"
                        x-show="editing === '${alpineIndex}-${key}'"
                        style="display:none"
                        contenteditable="true"
                        class="block relative z-30 p-2 bg-gray-200 text-black text-sm focus:outline-none"
                        :class="{'z-50': editing === '${alpineIndex}-${key}'}"
                        @click.away="editing = ''"
                        @keydown.enter.prevent.stop="
                            editing = ''
                            updateAlpine('${type}', '${alpineIndex}', '${key}', $event.target.textContent.trim());
                        "
                        @keydown.escape.stop="
                            updateAlpine('${type}', '${alpineIndex}', '${key}', $event.target.parentNode.querySelector('.editable-content').textContent.trim());
                            editing = ''
                        "
                        @input.stop="updateAlpine('${type}', '${alpineIndex}', '${key}', $event.target.textContent.trim())">
                        ${value}
                    </span>`
            }
            return ''
        },
        getGutterAction(id, type, alpineIndex, key, value) {
            switch (type) {
                case 'boolean':
                    return `
                        <input
                            id="${id}"
                            style="margin-top:3px;"
                            type="checkbox"
                            :checked="${value}"
                            @change.stop="updateAlpine('boolean', '${alpineIndex}', '${key}', '${value}')">`
                case 'string':
                    if (alpineIndex === null) return '' // Probably in an array or object
                    return `
                        <button
                            id="${id}"
                            @click="openEditorAndSelectText('${alpineIndex}', '${key}')"
                            class="transition duration-200 w-4 mt-px text-white focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>`
                default:
                    return ''
            }
        },
        openEditorAndSelectText(alpineIndex, key) {
            // If the editor is already open and they press the edit icon again, commit the edit
            if (this.editing === `${alpineIndex}-${key}`) {
                this.updateAlpine('string', alpineIndex, key, this.$refs[`editor-${alpineIndex}-${key}`].textContent.trim())
                this.editing = ''
                return
            }
            this.editing = `${alpineIndex}-${key}`
            this.$nextTick(() => {
                this.$refs[`editor-${alpineIndex}-${key}`].focus()
                document.execCommand('selectAll', false, null)
            })
        },
        getValue(id, type, alpineIndex, key, value) {
            switch (type) {
                case 'boolean':
                    return value
                case 'number':
                    return value
                case 'string':
                    return `<span
                        class="editable-content"
                        @click="openEditorAndSelectText('${alpineIndex}', '${key}')">
                            ${this.escapeHTML(value)}
                        </span>`
                case 'array':
                    if (!value) return value
                    return Object.entries(value).map(([...item]) => {
                        return `<ul class="pl-4">${this.getItem(item[0], item[1])}</ul>`
                    }).join('')
                case 'object':
                    if (!value) return value
                    return Object.entries(value).map(([...item]) => {
                        return `<ul class="pl-4">${this.getItem(item[0], item[1])}</ul>`
                    }).join('')
            }
            return value
        },
        getStatusMessage() {
            if (this.editing.length) {
                return 'Press Enter or click away to finish. Press Esc to cancel.'
            }
            return `
                <a class="hover:text-blue-500 mr-px" target="_blank" href="https://twitter.com/kevinbatdorf">@kevinbatdorf</a>
                ·
                <a class="hover:text-blue-500 mx-px" target="_blank" href="https://github.com/kevinbatdorf/alpine-inline-devtools">github</a>
            `
        },
        convertFunctionName(functionName) {
            if (functionName.indexOf('{') === 0) return
            let name = functionName.replace(/\(([^\)]+)\)/, '').replace('()', '').replace(/([A-Z])/g, " $1")
            return name ? name.charAt(0).toUpperCase() + name.slice(1) : ''
        },
        escapeHTML(html) {
            let div = document.createElement('div')
            div.innerText = html
            return div.innerHTML
        },
    }
}

function setAlpineDevToolsScriptSource () {
    // Discover the file name to inject into to popup
    let alpineDevToolsScript
    if (alpineDevToolsScript = document.getElementById('alpine-devtools-script')) {
        window.alpineDevToolsScriptURL = alpineDevToolsScript.src
    } else {
        // Create an error to fine the source
        let possibleFileName = (new Error).stack.split("\n")
        // Grab the first URL
        possibleFileName = possibleFileName.find(string => {
            return new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(string)
        })
        // Extract the URL
        possibleFileName = (possibleFileName.match(/(https?:\/\/[^ ]*)/)[1])
        // Split at the end to remove anything after .js
        const lastIndex = possibleFileName.lastIndexOf('.js')
        possibleFileName = possibleFileName.slice(0, lastIndex)
        if (Array.isArray(possibleFileName)) {
            possibleFileName = possibleFileName[0]
        }
        window.alpineDevToolsScriptURL = possibleFileName + '.js'
    }
}
try {
    setAlpineDevToolsScriptSource()
} catch (error) {
    console.error('Alpine DevTools: We couldn\'t identify the source script')
}

function alpineDevTools() {
    const alpineDevToolsComponent = document.createElement('button')
    alpineDevToolsComponent.id = 'alpine-devtools'
    alpineDevToolsComponent.setAttribute('x-data', 'alpineDevToolsHandler()')
    alpineDevToolsComponent.setAttribute('x-show.transition.out.opacity.duration.1000', 'alpines.length && !open')
    alpineDevToolsComponent.setAttribute('x-bind:class', '{"alpine-button-devtools-closed" : !open}')
    alpineDevToolsComponent.setAttribute('x-on:click', 'openWindow')
    alpineDevToolsComponent.setAttribute('x-on:open-alpine-devtools.window', 'openWindow')
    alpineDevToolsComponent.setAttribute('x-init', '$nextTick(() => { start() })')
    alpineDevToolsComponent.textContent = 'Alpine Devtools'
    alpineDevToolsComponent.style.cssText = "position:fixed!important;bottom:0!important;right:0!important;margin:4px!important;padding:5px 8px!important;border-radius:10px!important;background-color:#1a202c!important;color:#d8dee9!important;font-size:14px!important;outline:0!important;z-index:2147483647!important;min-width:0!important;max-width:130px!important;"

    // Set some hard styles on the button based on need
    const styleSheet = document.createElement('style')
    // Force the opacity when the button is open. I noticed TailwindUI is messing with this otherwise, for example
    styleSheet.appendChild(document.createTextNode('.alpine-button-devtools-closed{opacity:1!important}'))

    document.head.appendChild(styleSheet)
    document.body.appendChild(alpineDevToolsComponent)
}

const alpine = window.deferLoadingAlpine || ((alpine) => alpine())
window.deferLoadingAlpine = function (callback) {
    alpine(callback)
    alpineDevTools()
}

// Used for when injecting the script into a random page
window.forceLoadAlpineDevTools = function() {
    setAlpineDevToolsScriptSource()
    alpineDevTools()
}
