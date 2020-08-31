window.alpineDevToolsHandler = function (position) {
	return {
        alpines: [],
        open: false,
        observer: null,
        windowRef: null,
		start() {
			this.alpines = null
			this.alpines = document.querySelectorAll('[x-data]:not(#alpine-devtools)')
			this.observer = new MutationObserver(mutations => {
				this.updateAlpines()
			})
			this.registerEventsFromComponentsOnWindow()
            this.alpines && this.wrapAlpines()

            // If the window is already open, refresh it
            if (sessionStorage.getItem('alpine-devtools')) {
                this.openWindow()
                this.updateAlpines()
            }
		},
		registerEventsFromComponentsOnWindow() {
			let events = []
			this.alpines.forEach(alpine => {
				events.push([...alpine.outerHTML.matchAll(/(x-on:|@)(.*?)(=|\.)/g)]
					.map(matches => matches[2]))
			})
			events.flat().forEach(eventName => {
				window.addEventListener(eventName, () => {
					this.alpines = document.querySelectorAll('[x-data]:not(#alpine-devtools)')
				})
			})
		},
		wrapAlpines() {
			this.alpines.forEach(alpine => {
				this.observer.observe(alpine, {
					attributes: true,
					childList: true,
					subtree: true,
				})
			})
		},
		updateAlpines() {
            this.alpines = document.querySelectorAll('[x-data]:not(#alpine-devtools)')
            if (this.windowRef) {
                this.windowRef.alpines = this.alpines
                const viewer = this.windowRef.document.querySelector('#alpine-devtools-viewer')
                if (!viewer) return
                typeof viewer.__x !== 'undefined' && viewer.__x.updateElements(viewer)
            }
		},
		openWindow() {
            this.windowRef = window.open('', 'alpine-devtools', 'width=400, height=650, left=100, top=100')
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
                tailwindCSS.href = 'https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css'
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
                            <div class="pl-6">
                                <div x-text="computeTitle(alpine)" class="mb-1 -ml-5 font-extrabold" style="color:#d8dee9"></div>
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
				<div class="border-t border-gray-700 text-gray-500 leading-none mx-2" style="font-size:11px; padding-top:5px;">
					<a class="hover:text-blue-500 mr-px" target="_blank" href="https://twitter.com/kevinbatdorf">@kevinbatdorf</a>
					·
					<a class="hover:text-blue-500 mx-px" target="_blank" href="https://github.com/kevinbatdorf/alpine-inline-devtools">github</a>
				</div>
			</div>`
		}
	}
}

window.alpineDevToolsViewer = function () {
    return {
        computeTitle(alpine) {
			return alpine.getAttribute('x-title')
				|| alpine.getAttribute('aria-label')
				|| alpine.id
				|| this.convertFunctionName(alpine.getAttribute('x-data'))
				|| `<${alpine.tagName.toLowerCase()}>`
        },
        getAlpineData(alpine) {
			if (!alpine.__x) return []
			return Object.entries(alpine.__x.getUnobservedData())
		},
		getType(value) {
			if (Array.isArray(value)) {
				return 'array'
			}
			if (typeof value === 'function') {
				return 'function'
			}
			return typeof value
        },
        updateAlpine(alpineIndex, key, value) {
            // Right now only support toggling true/false
            if (!['true', 'false'].includes(value)) return
            window.alpines[alpineIndex].__x.$data[key] = (value !== 'true')
        },
		getItem(key, value, alpineIndex = null) {
            const id = Date.now() + Math.floor(Math.random() * 1000000)
            return `
            <span class="py-1 inline-block relative">
                ${this.getType(value) === 'boolean' ? this.getGutterAction(id, alpineIndex, key, value) : ''}
				<span style="color:#4aea8b" class="text-serif">
					<label for="${id}" class="inline-block" style="min-width:1rem">${key}</label>
					<span class="text-white">:</span>
					<span style="color:#8ac0cf" class="bg-gray-800 px-1 text-xs">${this.getType(value)}</span>
				</span>
                <span
                    class="${this.getType(value) === 'boolean' ? 'cursor-pointer' : '' }"
                    style="color:#d8dee9">
                        ${this.getType(value) === 'string' ? this.escapeHTML(this.getValue(value)) : this.getValue(value)}
                </span>
			</span>`
        },
        getGutterAction(id, alpineIndex, key, value) {
            return `
            <span class="-ml-5 absolute left-0">
                <input
                    id="${id}"
                    style="margin-top:3px;"
                    type="checkbox"
                    :checked="${value}"
                    @change.stop="updateAlpine('${alpineIndex}', '${key}', '${value}')">
            </span>`
        },
		getValue(value) {
			if (this.getType(value) == 'boolean') {
				return value
			}
			if (this.getType(value) == 'number') {
				return value
			}
			if (this.getType(value) == 'string') {
				return `"${value}"`
			}
			if (this.getType(value) == 'array') {
				if (!value) return value
				return Object.entries(value).map(([...item]) => {
					return `<ul class="ml-4">${this.getItem(item[0], item[1])}</ul>`
				}).join('')
			}
			if (this.getType(value) == 'object') {
				if (!value) return value
				return Object.entries(value).map(([...item]) => {
					return `<ul class="ml-4">${this.getItem(item[0], item[1])}</ul>`
				}).join('')
			}
			return value
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
    alpineDevToolsComponent.style.cssText = "position:fixed!important;bottom:0!important;right:0!important;margin:4px!important;padding:5px 8px!important;border-radius:10px!important;background-color:#1a202c!important;color:#d8dee9!important;font-size:14px!important;outline:0!important;z-index:2147483647!important"

    // Set some hard styles on the button based on need
    const styleSheet = document.createElement('style')
    styleSheet.type = 'text/css'
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
