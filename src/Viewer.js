const Viewer = function() {
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
                <span class="text-serif text-property-name-color whitespace-no-wrap mr-2">
                    <label for="${id}" class="inline-block" style="min-width:1rem">${key}</label>
                    <span class="text-property-seperator-color bg-property-seperator-bg">:</span>
                    <span class="px-1 text-xs text-typeof-color bg-typeof-bg">${type}</span>
                </span>
                <span
                    class="relative w-full ${type === 'boolean' ? 'cursor-pointer' : '' } text-value-color bg-value-bg">
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
                        class="block relative z-30 p-2 text-string-editor-text bg-string-editor-bg text-sm focus:outline-none"
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
                            class="transition duration-200 w-4 mt-px text-string-icon-color focus:outline-none">
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
                <div class="flex items-center justify-end space-x-2">
                    <a class="hover:text-status-text-hover" title="Follow the developer's Twitter" target="_blank" href="https://twitter.com/kevinbatdorf">
                        <svg class="stroke-current inline" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                    </a>
                    <a class="hover:text-status-text-hover" title="Follow the project on GitHub" target="_blank" href="https://github.com/kevinbatdorf/alpine-inline-devtools">
                        <svg class="stroke-current inline" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </a>
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
    }
}

export default Viewer
