window.alpineDevTools = function(position) {
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

            const alpineScript = this.windowRef.document.createElement('script')
            alpineScript.src = 'https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js'
            this.windowRef.document.head.appendChild(alpineScript)

            const tailwindCSS = this.windowRef.document.createElement('link')
            tailwindCSS.href = 'https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css'
            tailwindCSS.rel = 'stylesheet'
            this.windowRef.document.head.appendChild(tailwindCSS)

            const devtoolsScript = this.windowRef.document.createElement('script')
            devtoolsScript.setAttribute('type', 'text/javascript')
            devtoolsScript.src = document.getElementById('alpine-devtools-script').src
            this.windowRef.document.head.appendChild(devtoolsScript)

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
                class="flex flex-col justify-between fixed inset-0 bg-gray-900 text-gray-400 pb-3 pt-6 max-w-screen overflow-hidden"
                x-cloak
                x-show="open"
				x-transition:enter="transition ease-in duration-200"
				x-transition:enter-start="transform opacity-100 translate-y-2"
				x-transition:enter-end="transform opacity-100"
				x-transition:leave="transition ease-out duration-300"
				x-transition:leave-start="transform translate-y-0 opacity-100"
				x-transition:leave-end="transform translate-y-2 opacity-0">
				<div
					class="divide-y-2 divide-gray-700 space-y-5 -mt-5 mb-5 px-3 overflow-scroll">
					<template x-for="alpine of alpines">
						<div class="pt-5">
							<div x-text="computeTitle(alpine)" class="mb-1 font-extrabold" style="color:#d8dee9"></div>
							<template x-if="!getAlpineData(alpine).length"><p class="text-sm">No data found</p></template>
							<template x-for="[key, value] of getAlpineData(alpine)">
								<div
									class="leading-normal"
									x-html="getItem(key, value)"
									x-show="getType(value) !== 'function'">
								</div>
							</template>
						</div>
					</template>
				</div>
				<div class="border-t border-gray-700 pt-2 text-xs leading-none mx-3">
					<a class="hover:text-blue-500 mr-1" target="_blank" href="https://twitter.com/kevinbatdorf">@kevinbatdorf</a>
					·
					<a class="hover:text-blue-500 mx-1" target="_blank" href="https://github.com/kevinbatdorf/alpine-inline-devtools">github</a>
					·
					<a class="hover:text-blue-500 mx-1" target="_blank" href="https://github.com/sponsors/KevinBatdorf">sponsor</a>
					·
					<a class="hover:text-blue-500 mx-1" target="_blank" href="https://codepen.io/collection/nRxrPk">Alpine demos</a>
				</div>
			</div>`
		}
	}
}

window.alpineDevToolsViewer = function(alpines) {
    Alpine.addMagicProperty('devtoolsRefresh', function ($el) {
        return () => {
            this.updateElements()
        }
    })
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
		getItem(key, value) {
			return `<span>
				<span style="color:#4aea8b" class="text-serif">
					<span class="inline-block" style="min-width:1rem">${key}</span>
					<span class="text-white">:</span>
					<span style="color:#8ac0cf" class="bg-gray-800 px-1 text-xs">${this.getType(value)}</span>
				</span>
				<span style="color:#d8dee9">${this.getType(value) === 'string' ? this.escapeHTML(this.getValue(value)) : this.getValue(value)}</span>
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

const alpine = window.deferLoadingAlpine || ((alpine) => alpine())
window.deferLoadingAlpine = function (callback) {
    alpine(callback)
    const alpineDevToolsComponent = document.createElement('button')
    alpineDevToolsComponent.id = 'alpine-devtools'
    alpineDevToolsComponent.setAttribute('x-data', 'alpineDevTools()')
    alpineDevToolsComponent.setAttribute('x-show.transition.opacity.duration.1000', 'alpines.length && !open')
    alpineDevToolsComponent.setAttribute('x-on:click', 'openWindow')
    alpineDevToolsComponent.setAttribute('x-data', 'alpineDevTools()')
    alpineDevToolsComponent.setAttribute('x-init', '$nextTick(() => { start() })')
    alpineDevToolsComponent.textContent = 'Alpine Devtools'
    alpineDevToolsComponent.style.cssText = "position:fixed!important;bottom:0!important;right:0!important;margin:4px!important;padding:5px 8px!important;border-radius:10px!important;background-color:#1a202c!important;color:#d8dee9!important;font-size:14px!important;outline:0!important"
    document.body.appendChild(alpineDevToolsComponent)
}

export default alpineDevTools