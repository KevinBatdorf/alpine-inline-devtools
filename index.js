window.devtools = function (position) {
	return {
		show: false,
		alpines: [],
		observer: null,
		position: position || 'right',
		start() {
			this.insertHTML()
			this.alpines = null
			this.alpines = document.querySelectorAll('[x-data]:not(#alpine-devtools)')
			this.observer = new MutationObserver(mutations => {
				this.updateAlpines()
			})
			this.registerEventsFromComponentsOnWindow()
			this.alpines && this.wrapAlpines()
		},
		getAlpineData(alpine) {
			if (!alpine.__x) return []
			return Object.entries(alpine.__x.getUnobservedData())
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
		},
		computeTitle(alpine) {
			return alpine.getAttribute('x-title')
				|| alpine.getAttribute('aria-label')
				|| alpine.id
				|| this.convertFunctionName(alpine.getAttribute('x-data'))
				|| `<${alpine.tagName.toLowerCase()}>`
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
			return `<li>
				<span style="color:#4aea8b" class="text-serif">
					<span class="inline-block" style="min-width:1rem">${key}</span>
					<span class="text-white">:</span>
					<span style="color:#8ac0cf" class="bg-gray-800 px-1 text-xs">${this.getType(value)}</span>
				</span>
				<span style="color:#d8dee9">${this.getType(value) === 'string' ? this.escapeHTML(this.getValue(value)) : this.getValue(value)}</span>
			</li>`
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
				return Object.entries(value).map(([...item]) => {
					return `<ul class="ml-4">${this.getItem(item[0], item[1])}</ul>`
				}).join('')
			}
			if (this.getType(value) == 'object') {
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
		insertHTML() {
			this.$el.innerHTML = `<button
				x-show.immediate="!show"
				style="background-color:rgb(138, 192, 207);border-color:#d8dee9"
				:class="position + '-0'"
				class="border border-3 bottom-0 fixed focus:outline-none font-black h-10 mb-3 mx-4 rounded-full text-gray-900 hover:text-white shadow-2xl text w-10"
				@click="show = true">A</button>
			<div
				style="width:500px;z-index:2147483647;"
				:class="position + '-0'"
				class="fixed bottom-0 my-3 mx-4 bg-gray-900 text-gray-400 pb-3 pt-6 max-w-screen shadow-2xl rounded-lg overflow-hidden"
				x-cloak
				x-show="show"
				x-transition:enter="transition ease-in duration-200"
				x-transition:enter-start="transform opacity-100 translate-y-2"
				x-transition:enter-end="transform opacity-100"
				x-transition:leave="transition ease-out duration-300"
				x-transition:leave-start="transform translate-y-0 opacity-100"
				x-transition:leave-end="transform translate-y-2 opacity-0">
				<button class="absolute top-0 right-0 mr-2 bg-gray-900 font-mono focus:outline-none" @click="show = false">x</button>
				<div
					style="max-height:70vh"
					class="divide-y-2 divide-gray-700 space-y-5 -mt-5 mb-5 px-3 overflow-scroll">
					<template x-for="alpine of alpines">
						<div class="pt-5">
							<h1 x-text="computeTitle(alpine)" class="mb-1 font-extrabold" style="color:#d8dee9"></h1>
							<template x-if="!getAlpineData(alpine).length"><p class="text-sm">No data found</p></template>
							<template x-for="[key, value] of getAlpineData(alpine)">
								<ul
									class="leading-normal"
									x-html="getItem(key, value)"
									x-show="getType(value) !== 'function'">
								</ul>
							</template>
						</div>
					</template>
				</div>
				<div class="border-t border-gray-700 pt-2 text-xs leading-none mx-3">
					<a class="hover:text-blue-500 mr-1" target="_blank" href="https://twitter.com/kevinbatdorf">@kevinbatdorf</a>
					·
					<a class="hover:text-blue-500 mx-1" target="_blank" href="https://github.com/kevinbatdorf">github</a>
					·
					<a class="hover:text-blue-500 mx-1" target="_blank" href="https://github.com/sponsors/KevinBatdorf">sponsor</a>
					·
					<a class="hover:text-blue-500 mx-1" target="_blank" href="https://codepen.io/collection/nRxrPk">more demos</a>
				</div>
			</div>`
		}
	}
}
