const Viewer = function(type) {
    return {
        editing: '',
        type: type,
        collapsedArrays: [], // TODO: persist this??
        setup() {
            this.$el.innerHTML = `<div
                class="absolute bg-background border border-container-border flex flex-col font-mono justify-between max-w-screen py-2 w-full min-h-full"
                x-cloak
                x-show="open">
                <style>
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    .no-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
                </style>
                <div
                    class="divide-y-2 divide-component-divider -mt-5 mb-5 p-2 no-scrollbar">
                    <template x-for="(alpine, i) in [...alpines]" :key="i">
                        <div class="">
                            <div class="pl-4 py-5 overflow-y-hidden no-scrollbar">
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
                    @click="window.parent.dispatchEvent(new CustomEvent('collapse-devtools', {
                        bubbles: true,
                    }))"
                    x-html="getStatusMessage()"
                    class="bg-background border-component-divider border-t bottom-0 fixed flex items-center justify-between leading-none left-0 p-1.5 right-0 text-status-text w-full z-50" style="font-size:11px;">
                </div>
            </div>`
        },
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
        updateAlpine(type, alpineIndex, key, value, scope, context = '') {
            let scopes = scope.split('.') // Just focus on the last one
            switch (scopes[scopes.length - 1]) {
                case 'boolean':
                    return this.objectSetDeep(window.alpines[alpineIndex].__x.$data, context, (value !== 'true'))
                case 'string':
                    return this.objectSetDeep(window.alpines[alpineIndex].__x.$data, context, value)
            }
        },
        removeItemFromArray(type, alpineIndex, key, value, scope, context = '') {
            return this.objectSpliceDeep(window.alpines[alpineIndex].__x.$data, context)
        },
        getItem(key, value, alpineIndex = null, scope = '', context = '') {
            const id = Date.now() + Math.floor(Math.random() * 1000000)
            const type = this.getType(value)
            scope = scope ? `${scope}.${type}` : type
            context = context ? `${context}.${key}` : key
            return `
            <span class="${this.getItemRowStyling(id, type, alpineIndex, key, value, scope, context)}">
                ${this.getGutterAction(id, type, alpineIndex, key, value, scope, context)}
                <span class="inline-flex items-center text-serif text-property-name-color whitespace-no-wrap group">
                    <label for="${id}" class="inline-block">${key}</label>
                    <span class="text-property-seperator-color">:</span>
                    ${this.getProperyTypeMessage(id, type, alpineIndex, key, value, scope, context)}
                    <!-- Used to add an array item, but could be used for other types -->
                    ${this.getGutterExtraRight(id, type, alpineIndex, key, value, scope, context)}
                </span>
                <span
                    x-show.transition="!collapsedArrays.includes('${alpineIndex}:${key}')"
                    class="relative w-full text-value-color">
                        <span
                            x-show="editing !== '${alpineIndex}-${key}'"
                            :class="{
                                'absolute': editing === '${alpineIndex}-${key}',
                                'top-1': '${scope}' === 'array'
                            }"
                            class="relative z-10">
                            ${this.getValue(id, type, alpineIndex, key, value, scope, context)}
                        </span>
                        ${this.getEditField(id, type, alpineIndex, key, value, scope, context)}
                </span>
            </span>`
        },
        getItemRowStyling(id, type, alpineIndex, key, value, scope, context = '') {
            switch (type) {
                case 'string':
                    return `relative py-1 pl-1.5 flex items-start`
                case 'array':
                    return `relative py-1 pl-1.5 inline-block`
            }
            return `relative py-1 pl-1.5 inline-block`
        },
        getEditField(id, type, alpineIndex, key, value, scope, context = '') {
            if (scope.endsWith('array.string') || scope === 'string') {
                return `<span
                    x-ref="editor-${alpineIndex}-${key}"
                    x-show="editing === '${alpineIndex}-${key}'"
                    style="display:none"
                    contenteditable="true"
                    class="block relative z-30 p-2 text-string-editor-color bg-string-editor-bg leading-relaxed text-sm focus:outline-none"
                    :class="{'z-50': editing === '${alpineIndex}-${key}'}"
                    @click.away="editing = ''"
                    @keydown.enter.prevent.stop="
                        editing = ''
                        updateAlpine('${type}', '${alpineIndex}', '${key}', $event.target.textContent.trim(), '${scope}', '${context}');
                    "
                    @keydown.escape.stop="
                        editing = ''
                    "
                    @input.stop="updateAlpine('${type}', '${alpineIndex}', '${key}', $event.target.textContent.trim(), '${scope}', '${context}')">
                    ${this.escapeHTML(value)}
                </span>`
            }
            return ''
        },
        getGutterAction(id, type, alpineIndex, key, value, scope, context = '') {
            const wrap = (content) => `<span class="absolute flex left-0 -ml-3.5 -mt-px">${content}</span>`
            const wrapTight = (content) => `<span class="absolute flex left-0 -ml-7 -mt-px">${content}</span>`
            switch (type) {
                case 'boolean':
                    return wrap(`
                        <input
                            id="${id}"
                            style="margin-top:3px;"
                            type="checkbox"
                            :checked="${value}"
                            @change.stop="updateAlpine('boolean', '${alpineIndex}', '${key}', '${value}', '${scope}', '${context}')">`)
                case 'string':
                    if ('string' !== scope && !scope.endsWith('array.string')) return ''
                    const deleteButton = `
                        <button
                            id="${id}"
                            @click="removeItemFromArray('${type}', '${alpineIndex}', '${key}', '${value}', '${scope}', '${context}')"
                            :class="{'opacity-0 group-hover:opacity-100': ${scope.endsWith('array.string')}}"
                            class="transition duration-200 w-4 mt-px text-icon-color focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>`
                    const editButton = `
                        <button
                            id="${id}"
                            @click="openEditorAndSelectText('${id}', '${type}', '${alpineIndex}', '${key}', '${value}', '${scope}', '${context}')"
                            :class="{'opacity-0 group-hover:opacity-100': ${scope.endsWith('array.string')}}"
                            class="transition duration-200 w-4 mt-px text-icon-color focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>`
                        return scope.endsWith('array.string') ? wrapTight(deleteButton + editButton) : wrap(editButton)
                case 'array':
                    return wrap(`
                        <button
                            id="${id}"
                            @click="
                                const index = collapsedArrays.indexOf('${alpineIndex}:${key}')
                                if (index === -1) {
                                    collapsedArrays.push('${alpineIndex}:${key}')
                                    return
                                }
                                collapsedArrays.splice(index, 1)
                            "
                            class="transition duration-200 w-4 mt-px text-icon-color focus:outline-none">
                            <svg
                                :class="{ 'transform -rotate-90' : collapsedArrays.includes('${alpineIndex}:${key}') }"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>`)
                default:
                    return ''
            }
        },
        getGutterExtraRight(id, type, alpineIndex, key, value, scope, context = '') {
            switch (type) {
                case 'array':
                    return `
                    <span
                        :class="{
                            'opacity-0 group-hover:opacity-100': ${scope.endsWith('array')},
                            'hidden': collapsedArrays.includes('${alpineIndex}:${key}')
                        }"
                        class="text-xs text-typeof-color bg-typeof-bg ml-1">
                        <button
                            id="${id}"
                            @click="
                                updateAlpine('string', '${alpineIndex}', '', '', 'string', '${context}.${value.length}')
                                openEditorAndSelectText('', '${type}', '${alpineIndex}', '${value.length}', '', '${scope}', '${context}')
                            "
                            class="transition duration-200 w-4 mt-px text-icon-color focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </span>`
                case 'string':
                    if (!scope.endsWith('array.string')) return ''
                    return ''
            }
            return ''
        },
        getProperyTypeMessage(id, type, alpineIndex, key, value, scope) {
            let wrap = (content) => `<span class="p-1 text-xs text-typeof-color bg-typeof-bg">${content}</span>`
            switch (type) {
                case 'string':
                    return ''
                case 'array':
                    if (this.collapsedArrays.includes(`${alpineIndex}:${key}`)) {
                        return wrap(`array[${value.length}]`)
                    }
                    return wrap`array`
            }
            return wrap(type)
        },
        openEditorAndSelectText(id, type, alpineIndex, key, value, scope, context) {
            // If the editor is already open and they press the edit icon again, commit the edit
            if (this.editing === `${alpineIndex}-${key}`) {
                this.updateAlpine('string', alpineIndex, key, this.$refs[`editor-${alpineIndex}-${key}`].textContent.trim(), scope, context)
                this.editing = ''
                return
            }
            this.editing = `${alpineIndex}-${key}`
            this.$nextTick(() => {
                this.editing && this.$refs[`editor-${alpineIndex}-${key}`].focus()
                this.editing && document.execCommand('selectAll', false, null)
            })
        },
        getValue(id, type, alpineIndex, key, value, scope, context = '') {
            switch (type) {
                case 'function':
                    return ''
                case 'boolean':
                    return value
                case 'number':
                    return value
                case 'string':
                    if (!['string', 'array.string'].includes(scope)){
                        return `<span class="editable-content whitespace-no-wrap">"${this.escapeHTML(value)}"</span>`
                    }
                    return `<span
                        class="editable-content whitespace-no-wrap"
                        @click="openEditorAndSelectText('${id}', '${type}', '${alpineIndex}', '${key}', '${value}', '${scope}', '${context}')">
                            "${this.escapeHTML(value)}"
                        </span>`
                case 'array':
                    if (!value) return value
                    return Object.entries(value).map(([...item]) => {
                        return `<div class="group pl-2">${this.getItem(item[0], item[1], alpineIndex, scope, context)}</div>`
                    }).join('')
                case 'object':
                    if (!value) return value
                    return Object.entries(value).map(([...item]) => {
                        return `<div class="pl-2">${this.getItem(item[0], item[1], alpineIndex, scope, context)}</div>`
                    }).join('')
            }
            return value
        },
        getStatusMessage() {
            if (this.editing.length) {
                return 'Press Enter or click away to finish. Press Esc to cancel.'
            }
            return `
                <span>Watching ${window.alpines.length} components...</span>
                <div class="flex items-center justify-end space-x-2">
                    <a @click.stop class="hover:text-status-text-hover" title="Follow the developer's Twitter" target="_blank" href="https://twitter.com/kevinbatdorf">
                        <svg class="stroke-current inline" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                    </a>
                    <a @click.stop class="hover:text-status-text-hover" title="Follow the project on GitHub" target="_blank" href="https://github.com/kevinbatdorf/alpine-inline-devtools">
                        <svg class="stroke-current inline" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </a>
                    <button x-show="type === 'Iframe'" @click.stop="$dispatch('open-alpine-devtools-popup')" class="hover:text-status-text-hover focus:outline-none" title="Open in popup window">
                        <svg class="stroke-current inline" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                    </button>
                </div>
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
        // Borrowed from https://stackoverflow.com/a/54733755/1437789
        objectSetDeep(object, path, value) {
            path = path.toString().match(/[^.[\]]+/g) || []
            // Iterate all of them except the last one
            path.slice(0, -1).reduce((a, currentKey, index) => {
                // If the key does not exist or its value is not an object, create/override the key
                if (Object(a[currentKey]) !== a[currentKey]) {
                    // Is the next key a potential array-index?
                    a[currentKey] = Math.abs(path[index + 1]) >> 0 === +path[index + 1]
                        ? [] // Yes: assign a new array object
                        : {} // No: assign a new plain object
                }
                return a[currentKey]
            }, object)[path[path.length - 1]] = value // Finally assign the value to the last key
            return object
        },
        objectSpliceDeep(object, path) {
            path = path.toString().match(/[^.[\]]+/g) || []
            path.slice(0, -1).reduce((a, currentKey, index) => {
                return a[currentKey]
            }, object).splice(path[path.length - 1], 1)
            return object
        },
    }
}

export default Viewer
