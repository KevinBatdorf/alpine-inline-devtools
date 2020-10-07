(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    const DevTools = {
      start(Loader, Viewer, theme) {
        window.alpineDevTools = {
          version: '0.11.0',
          Viewer: Viewer,
          Loader: Loader,
          theme: theme
        };
        window.addEventListener('DOMContentLoaded', () => {
          this.injectDevToolsHandler(); // A button is on the page already. use that instead

          const button = document.getElementById('alpine-devtools-button');

          if (button) {
            button.addEventListener('click', () => {
              window.dispatchEvent(new CustomEvent('open-alpine-devtools-popup', {
                bubbles: true
              }));
            });
          }

          if (sessionStorage.getItem('alpine-devtools') !== 'Popup') {
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('open-alpine-devtools', {
                bubbles: true
              }));
            }, 0);
          }
        });
      },

      injectDevToolsHandler() {
        const alpineDevToolsComponent = document.createElement('div');
        alpineDevToolsComponent.id = 'alpine-devtools';
        alpineDevToolsComponent.setAttribute('x-data', 'window.alpineDevTools.Loader(window.alpineDevTools.Viewer, window.alpineDevTools.theme)');
        alpineDevToolsComponent.setAttribute('x-devtools-ignore', '');
        alpineDevToolsComponent.setAttribute('x-on:open-alpine-devtools.window', 'openIframe()');
        alpineDevToolsComponent.setAttribute('x-on:open-alpine-devtools-popup.window', 'openPopup()');
        alpineDevToolsComponent.setAttribute('x-on:focus-alpine-devtools.window', 'focusDevTools()');
        alpineDevToolsComponent.setAttribute('x-on:alpine-devtools-switch-theme.window', 'setTheme($event.detail)');
        alpineDevToolsComponent.setAttribute('x-init', '$nextTick(() => { start() })');
        alpineDevToolsComponent.style.cssText = "display:none!important";
        document.body.appendChild(alpineDevToolsComponent);
      }

    };

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
        sessionId: Date.now() + Math.floor(Math.random() * 1000000),

        start() {
          this.alpines = document.querySelectorAll('[x-data]:not([x-devtools-ignore])');
          if (!this.alpines) return;
          this.registerAlpines(this.alpines); // If the window is already open, refresh it

          if (sessionStorage.getItem('alpine-devtools')) {
            this.type = sessionStorage.getItem('alpine-devtools');
            this[`open${this.type}`]();
            this.updateAlpines();
          }
        },

        focusDevTools() {
          if (!this.windowRef) {
            this[`open${this.type}`]();
          }

          this.windowRef.focus();
        },

        registerAlpines(alpines) {
          this.observer = new MutationObserver(mutations => {
            this.updateAlpines();
          });
          alpines.forEach(alpine => {
            // This will trigger a mutation when internal data changes but no visual mutation is observed
            alpine.setAttribute('x-bind:data-last-refresh', 'Date.now()');
            this.observer.observe(alpine, {
              attributes: true,
              childList: true,
              characterData: true,
              subtree: true
            });
          });
        },

        updateAlpines() {
          this.checkIfNewAlpinesWereAddedAndRegisterThem();

          if (this.windowRef) {
            this.windowRef.alpines = this.alpines;
            const viewer = this.windowRef.document.querySelector('#alpine-devtools-viewer');
            if (!viewer) return;
            if (viewer.__x.$data.editing.length) return;
            typeof viewer.__x !== 'undefined' && viewer.__x.updateElements(viewer);
          }
        },

        checkIfNewAlpinesWereAddedAndRegisterThem() {
          const fresh = [...document.querySelectorAll('[x-data]:not([x-devtools-ignore])')];
          const newAlpines = fresh.filter(alpine => {
            return ![...this.alpines].includes(alpine);
          });

          if (newAlpines) {
            this.alpines = document.querySelectorAll('[x-data]:not([x-devtools-ignore])');
            this.registerAlpines(newAlpines);
          }
        },

        openIframe() {
          this.iframe = document.getElementById('alpine-devtools-iframe');

          if (!this.iframe) {
            const state = sessionStorage.getItem('alpine-devtools-iframe-state');
            this.iframe = document.createElement('iframe');
            this.iframe.id = 'alpine-devtools-iframe';
            this.iframe.width = 450;
            this.iframe.height = 650;
            this.iframe.setAttribute('x-data', state ? state : '{height: 650, margin: "0.75rem"}');
            this.iframe.setAttribute('x-devtools-ignore', '');
            this.iframe.setAttribute('x-on:collapse-devtools.window', 'height = height === 650 ? 27 : 650;margin = margin === "0.75rem" ? "0" : "0.75rem";sessionStorage.setItem("alpine-devtools-iframe-state", `{height: ${height}, margin: "${margin}"}`)');
            this.iframe.setAttribute('x-bind:style', '`position:fixed;box-shadow:0 25px 50px -12px rgba(0,0,0,.25)!important;bottom:0!important;right:0!important;margin:${margin}!important;background-color:#252f3f!important;height: ${height}px!important`');
            document.body.appendChild(this.iframe);
          }

          this.windowRef = this.iframe.contentWindow;
          this.type = 'Iframe';
          this.load();
        },

        openPopup() {
          if (this.iframe) {
            this.iframe.parentNode.removeChild(this.iframe);
            this.iframe = null;
          }

          this.windowRef = window.open('', 'alpine-devtools', 'width=450, height=650, left=100, top=100');
          this.type = 'Popup';
          this.load();
        },

        load() {
          if (!this.windowRef) {
            sessionStorage.removeItem('alpine-devtools');
            this[`open${this.type}`]();
          } // Starting color. Consider some loading animation


          this.windowRef.document.body.style.backgroundColor = '#1a202c';
          this.windowRef.document.body.style.height = '100%';
          this.windowRef.document.body.innerHTML = '';
          this.windowRef.document.title = 'Alpine DevTools';
          this.windowRef.alpines = this.alpines; // TODO: take in AlpineJS version option

          if (!this.windowRef.document.getElementById('alpine-devtools-script')) {
            const alpineScript = this.windowRef.document.createElement('script');
            alpineScript.id = 'alpine-devtools-script';
            const version = window.Alpine.version || '2.x.x';
            alpineScript.src = `https://cdn.jsdelivr.net/gh/alpinejs/alpine@v${version}/dist/alpine.min.js`;
            this.windowRef.document.head.appendChild(alpineScript);
          } // TODO: This should eventually be settable somehow


          if (!this.windowRef.document.getElementById('alpine-devtools-font')) {
            const font = this.windowRef.document.createElement('link');
            font.id = 'alpine-devtools-font';
            font.rel = 'stylesheet';
            font.href = "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap";
            this.windowRef.document.head.appendChild(font);
          }

          this.setTheme(this.theme); // Add the dev tools component function and remove any previous

          const oldScript = this.windowRef.document.getElementById('devtools-script');
          oldScript && oldScript.remove();
          const devtoolsScript = this.windowRef.document.createElement('script');
          devtoolsScript.id = 'devtools-script';
          devtoolsScript.textContent = `window.Viewer = ${this.viewerScript}`;
          this.windowRef.document.head.appendChild(devtoolsScript);
          this.loadView();
        },

        setTheme(theme) {
          if (!this.windowRef) {
            this[`open${this.type}`]();
          }

          this.theme = theme ? theme : this.theme; // Add the theme and remove any previous (Can possibly support theme swapping)

          const oldTheme = this.windowRef.document.getElementById('alpine-devtools-theme');
          oldTheme && oldTheme.remove();
          const devtoolsTheme = this.windowRef.document.createElement('style');
          devtoolsTheme.id = 'alpine-devtools-theme';
          devtoolsTheme.textContent = this.theme;
          this.windowRef.document.head.appendChild(devtoolsTheme);
        },

        loadView() {
          const viewer = this.windowRef.document.createElement('div');
          viewer.id = 'alpine-devtools-viewer';
          viewer.setAttribute('x-data', `window.Viewer('${this.type}')`);
          viewer.setAttribute('x-init', 'setup()');
          viewer.setAttribute('x-on:open-alpine-devtools-popup.window', `
                window.parent.dispatchEvent(new CustomEvent('open-alpine-devtools-popup', {
                    bubbles: true,
                    event: 'Popup'
                }))`);
          viewer.setAttribute('x-init', 'setup()'); // Add the reference to the session so we don't need to reopen the popup everytime

          sessionStorage.setItem('alpine-devtools', this.type);
          this.open = true;
          window.alpineDevTools.open = true;
          setTimeout(() => {
            this.windowRef.document.body.appendChild(viewer);
          }, 500);
          this.windowRef.addEventListener('beforeunload', () => {
            sessionStorage.removeItem('alpine-devtools');
            this.type === 'popup' && this.windowRef.close();
            this.windowRef = null;
            this.open = false;
            window.alpineDevTools.open = false;
          });
        }

      };
    };

    const Viewer = function (type) {
      return {
        editing: '',
        type: type,

        setup() {
          this.$el.innerHTML = `<div
                class="absolute bg-background border border-container-border flex flex-col font-mono justify-between max-w-screen overflow-scroll py-2 w-full"
                x-cloak
                x-show="open">
                <div
                    class="divide-y-2 divide-component-divider space-y-3 -mt-5 mb-5 p-2 overflow-scroll">
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
                    @click="window.parent.dispatchEvent(new CustomEvent('collapse-devtools', {
                        bubbles: true,
                    }))"
                    x-html="getStatusMessage()"
                    class="bg-background border-component-divider border-t bottom-0 fixed flex items-center justify-between leading-none left-0 p-1.5 right-0 text-status-text w-full z-50" style="font-size:11px;">
                </div>
            </div>`;
        },

        computeTitle(alpine) {
          return alpine.getAttribute('x-title') || alpine.getAttribute('aria-label') || alpine.getAttribute('x-id') || alpine.id || this.convertFunctionName(alpine.getAttribute('x-data')) || `<${alpine.tagName.toLowerCase()}>`;
        },

        getAlpineData(alpine) {
          if (!alpine.__x) return [];
          return Object.entries(alpine.__x.getUnobservedData());
        },

        getType(value) {
          // Leave as object for now until we need it
          // if (value === null) {
          //     return 'null'
          // }
          if (Array.isArray(value)) {
            return 'array';
          }

          if (typeof value === 'function') {
            return 'function';
          }

          return typeof value;
        },

        updateAlpine(type, alpineIndex, key, value) {
          switch (type) {
            case 'boolean':
              window.alpines[alpineIndex].__x.$data[key] = value !== 'true';
              break;

            case 'string':
              window.alpines[alpineIndex].__x.$data[key] = value;
              break;
          }
        },

        getItem(key, value, alpineIndex = null, scope = '') {
          const id = Date.now() + Math.floor(Math.random() * 1000000);
          const type = this.getType(value);
          scope = scope ? `${scope}.${type}` : type;
          return `
            <span class="relative py-1 pl-2 ${type === 'string' ? 'flex' : 'inline-block'}">
                <span class="absolute left-0 -ml-3 -mt-px">
                    ${this.getGutterAction(id, type, alpineIndex, key, value, scope)}
                </span>
                <span class="text-serif text-property-name-color whitespace-no-wrap mr-2">
                    <label for="${id}" class="inline-block">${key}</label>
                    <span class="text-property-seperator-color -mx-1.5">:</span>
                    <span
                        x-show="${!['string'].includes(type)}"
                        class="px-1 text-xs text-typeof-color bg-typeof-bg">
                        ${type}
                    </span>
                </span>
                <span
                    class="relative w-full ${type === 'boolean' ? 'cursor-pointer' : ''} text-value-color">
                        <span
                            x-show="editing !== '${alpineIndex}-${key}'"
                            :class="{'absolute': editing === '${alpineIndex}-${key}'}"
                            class="relative z-10">
                            ${this.getValue(id, type, alpineIndex, key, value, scope)}
                        </span>
                        ${this.getEditField(id, type, alpineIndex, key, value, scope)}
                </span>
            </span>`;
        },

        getEditField(id, type, alpineIndex, key, value, scope) {
          switch (type) {
            case 'string':
              return `<span
                        x-ref="editor-${alpineIndex}-${key}"
                        x-show="editing === '${alpineIndex}-${key}'"
                        style="display:none"
                        contenteditable="true"
                        class="block relative z-30 p-2 text-string-editor-color bg-string-editor-bg text-sm focus:outline-none"
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
                    </span>`;
          }

          return '';
        },

        getGutterAction(id, type, alpineIndex, key, value, scope) {
          switch (type) {
            case 'boolean':
              return `
                        <input
                            id="${id}"
                            style="margin-top:3px;"
                            type="checkbox"
                            :checked="${value}"
                            @change.stop="updateAlpine('boolean', '${alpineIndex}', '${key}', '${value}')">`;

            case 'string':
              // Limit to only top level strings
              if (scope !== 'string') return '';
              return `
                        <button
                            id="${id}"
                            @click="openEditorAndSelectText('${alpineIndex}', '${key}')"
                            class="transition duration-200 w-4 mt-px text-icon-color focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>`;

            default:
              return '';
          }
        },

        openEditorAndSelectText(alpineIndex, key) {
          // If the editor is already open and they press the edit icon again, commit the edit
          if (this.editing === `${alpineIndex}-${key}`) {
            this.updateAlpine('string', alpineIndex, key, this.$refs[`editor-${alpineIndex}-${key}`].textContent.trim());
            this.editing = '';
            return;
          }

          this.editing = `${alpineIndex}-${key}`;
          this.$nextTick(() => {
            this.$refs[`editor-${alpineIndex}-${key}`].focus();
            document.execCommand('selectAll', false, null);
          });
        },

        getValue(id, type, alpineIndex, key, value, scope) {
          switch (type) {
            case 'function':
              return '';

            case 'boolean':
              return value;

            case 'number':
              return value;

            case 'string':
              if (scope === 'string') {
                return `<span
                            class="editable-content"
                            @click="openEditorAndSelectText('${alpineIndex}', '${key}')">
                                "${this.escapeHTML(value)}"
                            </span>`;
              }

              return `<span>
                                "${this.escapeHTML(value)}"
                            </span>`;

            case 'array':
              if (!value) return value;
              return Object.entries(value).map(([...item]) => {
                return `<div class="pl-2">${this.getItem(item[0], item[1], alpineIndex, scope)}</div>`;
              }).join('');

            case 'object':
              if (!value) return value;
              return Object.entries(value).map(([...item]) => {
                return `<div class="pl-2">${this.getItem(item[0], item[1], alpineIndex, scope)}</div>`;
              }).join('');
          }

          return value;
        },

        getStatusMessage() {
          if (this.editing.length) {
            return 'Press Enter or click away to finish. Press Esc to cancel.';
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
            `;
        },

        convertFunctionName(functionName) {
          if (functionName.indexOf('{') === 0) return;
          let name = functionName.replace(/\(([^\)]+)\)/, '').replace('()', '').replace(/([A-Z])/g, " $1");
          return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
        },

        escapeHTML(html) {
          let div = document.createElement('div');
          div.innerText = html;
          return div.innerHTML;
        }

      };
    };

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z = "/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Render the `main` element consistently in IE.\n */\n\nmain {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n[hidden] {\n  display: none;\n}\n\n/**\n * Manually forked from SUIT CSS Base: https://github.com/suitcss/base\n * A thin layer on top of normalize.css that provides a starting point more\n * suitable for web applications.\n */\n\n/**\n * Removes the default spacing and border for appropriate elements.\n */\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nbutton {\n  background-color: transparent;\n  background-image: none;\n}\n\n/**\n * Work around a Firefox/IE bug where the transparent `button` background\n * results in a loss of the default `button` focus styles.\n */\n\nbutton:focus {\n  outline: 1px dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nol,\nul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/**\n * Tailwind custom reset styles\n */\n\n/**\n * 1. Use the user's configured `sans` font-family (with Tailwind's default\n *    sans-serif font stack as a fallback) as a sane default.\n * 2. Use Tailwind's default \"normal\" line-height so the user isn't forced\n *    to override it to ensure consistency even when using the default theme.\n */\n\nhtml {\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 1 */\n  line-height: 1.5; /* 2 */\n}\n\n/**\n * 1. Prevent padding and border from affecting element width.\n *\n *    We used to set this in the html element and inherit from\n *    the parent element for everything else. This caused issues\n *    in shadow-dom-enhanced elements like <details> where the content\n *    is wrapped by a div with box-sizing set to `content-box`.\n *\n *    https://github.com/mozdevs/cssremedy/issues/4\n *\n *\n * 2. Allow adding a border to an element by just adding a border-width.\n *\n *    By default, the way the browser specifies that an element should have no\n *    border is by setting it's border-style to `none` in the user-agent\n *    stylesheet.\n *\n *    In order to easily add borders to elements by just setting the `border-width`\n *    property, we change the default border-style for all elements to `solid`, and\n *    use border-width to hide them instead. This way our `border` utilities only\n *    need to set the `border-width` property instead of the entire `border`\n *    shorthand, making our border utilities much more straightforward to compose.\n *\n *    https://github.com/tailwindcss/tailwindcss/pull/116\n */\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e2e8f0; /* 2 */\n}\n\n/*\n * Ensure horizontal rules are visible by default\n */\n\nhr {\n  border-top-width: 1px;\n}\n\n/**\n * Undo the `border-style: none` reset that Normalize applies to images so that\n * our `border-{width}` utilities have the expected effect.\n *\n * The Normalize reset is unnecessary for us since we default the border-width\n * to 0 on all elements.\n *\n * https://github.com/tailwindcss/tailwindcss/issues/362\n */\n\nimg {\n  border-style: solid;\n}\n\ntextarea {\n  resize: vertical;\n}\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  color: #a0aec0;\n}\n\ninput:-ms-input-placeholder, textarea:-ms-input-placeholder {\n  color: #a0aec0;\n}\n\ninput::-ms-input-placeholder, textarea::-ms-input-placeholder {\n  color: #a0aec0;\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  color: #a0aec0;\n}\n\nbutton,\n[role=\"button\"] {\n  cursor: pointer;\n}\n\ntable {\n  border-collapse: collapse;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/**\n * Reset links to optimize for opt-in styling instead of\n * opt-out.\n */\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/**\n * Reset form element properties that are easy to forget to\n * style explicitly so you don't inadvertently introduce\n * styles that deviate from your design system. These styles\n * supplement a partial reset that is already applied by\n * normalize.css.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  padding: 0;\n  line-height: inherit;\n  color: inherit;\n}\n\n/**\n * Use the configured 'mono' font family for elements that\n * are expected to be rendered with a monospace font, falling\n * back to the system monospace stack if there is no configured\n * 'mono' font family.\n */\n\npre,\ncode,\nkbd,\nsamp {\n  font-family: Fira Code, monospace;\n}\n\n/**\n * Make replaced elements `display: block` by default as that's\n * the behavior you want almost all of the time. Inspired by\n * CSS Remedy, with `svg` added as well.\n *\n * https://github.com/mozdevs/cssremedy/issues/14\n */\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block;\n  vertical-align: middle;\n}\n\n/**\n * Constrain images and videos to the parent width and preserve\n * their instrinsic aspect ratio.\n *\n * https://github.com/mozdevs/cssremedy/issues/14\n */\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n.container {\n  width: 100%;\n}\n\n@media (min-width: 640px) {\n  .container {\n    max-width: 640px;\n  }\n}\n\n@media (min-width: 768px) {\n  .container {\n    max-width: 768px;\n  }\n}\n\n@media (min-width: 1024px) {\n  .container {\n    max-width: 1024px;\n  }\n}\n\n@media (min-width: 1280px) {\n  .container {\n    max-width: 1280px;\n  }\n}\n\n.space-x-2 > :not(template) ~ :not(template) {\n  --space-x-reverse: 0;\n  margin-right: calc(0.5rem * var(--space-x-reverse));\n  margin-left: calc(0.5rem * calc(1 - var(--space-x-reverse)));\n}\n\n.space-y-3 > :not(template) ~ :not(template) {\n  --space-y-reverse: 0;\n  margin-top: calc(0.75rem * calc(1 - var(--space-y-reverse)));\n  margin-bottom: calc(0.75rem * var(--space-y-reverse));\n}\n\n.divide-y-2 > :not(template) ~ :not(template) {\n  --divide-y-reverse: 0;\n  border-top-width: calc(2px * calc(1 - var(--divide-y-reverse)));\n  border-bottom-width: calc(2px * var(--divide-y-reverse));\n}\n\n.divide-component-divider > :not(template) ~ :not(template) {\n  --divide-opacity: 1;\n  border-color: #183d5d;\n  border-color: rgba(24, 61, 93, var(--divide-opacity));\n}\n\n.bg-background {\n  --bg-opacity: 1;\n  background-color: #072540;\n  background-color: rgba(7, 37, 64, var(--bg-opacity));\n}\n\n.bg-typeof-bg {\n  background-color: transparent;\n}\n\n.bg-string-editor-bg {\n  --bg-opacity: 1;\n  background-color: #183d5d;\n  background-color: rgba(24, 61, 93, var(--bg-opacity));\n}\n\n.border-container-border {\n  border-color: transparent;\n}\n\n.border-component-divider {\n  --border-opacity: 1;\n  border-color: #183d5d;\n  border-color: rgba(24, 61, 93, var(--border-opacity));\n}\n\n.border {\n  border-width: 1px;\n}\n\n.border-t {\n  border-top-width: 1px;\n}\n\n.cursor-pointer {\n  cursor: pointer;\n}\n\n.block {\n  display: block;\n}\n\n.inline-block {\n  display: inline-block;\n}\n\n.inline {\n  display: inline;\n}\n\n.flex {\n  display: flex;\n}\n\n.table {\n  display: table;\n}\n\n.flex-col {\n  flex-direction: column;\n}\n\n.items-center {\n  align-items: center;\n}\n\n.justify-end {\n  justify-content: flex-end;\n}\n\n.justify-between {\n  justify-content: space-between;\n}\n\n.font-mono {\n  font-family: Fira Code, monospace;\n}\n\n.font-extrabold {\n  font-weight: 800;\n}\n\n.text-xs {\n  font-size: 0.75rem;\n}\n\n.text-sm {\n  font-size: 0.875rem;\n}\n\n.leading-none {\n  line-height: 1;\n}\n\n.-mx-1 {\n  margin-left: -0.25rem;\n  margin-right: -0.25rem;\n}\n\n.-mx-1\\.5 {\n  margin-left: -0.375rem;\n  margin-right: -0.375rem;\n}\n\n.mb-1 {\n  margin-bottom: 0.25rem;\n}\n\n.mr-2 {\n  margin-right: 0.5rem;\n}\n\n.mb-5 {\n  margin-bottom: 1.25rem;\n}\n\n.mt-px {\n  margin-top: 1px;\n}\n\n.-ml-3 {\n  margin-left: -0.75rem;\n}\n\n.-mt-5 {\n  margin-top: -1.25rem;\n}\n\n.-mt-px {\n  margin-top: -1px;\n}\n\n.focus\\:outline-none:focus {\n  outline: 0;\n}\n\n.overflow-hidden {\n  overflow: hidden;\n}\n\n.overflow-scroll {\n  overflow: scroll;\n}\n\n.p-1 {\n  padding: 0.25rem;\n}\n\n.p-2 {\n  padding: 0.5rem;\n}\n\n.p-1\\.5 {\n  padding: 0.375rem;\n}\n\n.py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\n\n.px-1 {\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n}\n\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n\n.pt-2 {\n  padding-top: 0.5rem;\n}\n\n.pl-2 {\n  padding-left: 0.5rem;\n}\n\n.pl-4 {\n  padding-left: 1rem;\n}\n\n.fixed {\n  position: fixed;\n}\n\n.absolute {\n  position: absolute;\n}\n\n.relative {\n  position: relative;\n}\n\n.right-0 {\n  right: 0;\n}\n\n.bottom-0 {\n  bottom: 0;\n}\n\n.left-0 {\n  left: 0;\n}\n\n.stroke-current {\n  stroke: currentColor;\n}\n\n.text-component-title {\n  --text-opacity: 1;\n  color: #ffffff;\n  color: rgba(255, 255, 255, var(--text-opacity));\n}\n\n.text-status-text {\n  --text-opacity: 1;\n  color: #93c2db;\n  color: rgba(147, 194, 219, var(--text-opacity));\n}\n\n.text-property-name-color {\n  --text-opacity: 1;\n  color: #ff8ae2;\n  color: rgba(255, 138, 226, var(--text-opacity));\n}\n\n.text-property-seperator-color {\n  --text-opacity: 1;\n  color: #0069ff;\n  color: rgba(0, 105, 255, var(--text-opacity));\n}\n\n.text-typeof-color {\n  --text-opacity: 1;\n  color: #93c2db;\n  color: rgba(147, 194, 219, var(--text-opacity));\n}\n\n.text-value-color {\n  --text-opacity: 1;\n  color: #ffffff;\n  color: rgba(255, 255, 255, var(--text-opacity));\n}\n\n.text-string-editor-color {\n  --text-opacity: 1;\n  color: #ffffff;\n  color: rgba(255, 255, 255, var(--text-opacity));\n}\n\n.text-icon-color {\n  --text-opacity: 1;\n  color: #93c2db;\n  color: rgba(147, 194, 219, var(--text-opacity));\n}\n\n.hover\\:text-status-text-hover:hover {\n  --text-opacity: 1;\n  color: #ff8ae2;\n  color: rgba(255, 138, 226, var(--text-opacity));\n}\n\n.whitespace-no-wrap {\n  white-space: nowrap;\n}\n\n.w-4 {\n  width: 1rem;\n}\n\n.w-full {\n  width: 100%;\n}\n\n.z-10 {\n  z-index: 10;\n}\n\n.z-30 {\n  z-index: 30;\n}\n\n.z-50 {\n  z-index: 50;\n}\n\n.transition {\n  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;\n}\n\n.duration-200 {\n  transition-duration: 200ms;\n}\n\n@-webkit-keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@-webkit-keyframes ping {\n  75%, 100% {\n    transform: scale(2);\n    opacity: 0;\n  }\n}\n\n@keyframes ping {\n  75%, 100% {\n    transform: scale(2);\n    opacity: 0;\n  }\n}\n\n@-webkit-keyframes pulse {\n  50% {\n    opacity: .5;\n  }\n}\n\n@keyframes pulse {\n  50% {\n    opacity: .5;\n  }\n}\n\n@-webkit-keyframes bounce {\n  0%, 100% {\n    transform: translateY(-25%);\n    -webkit-animation-timing-function: cubic-bezier(0.8,0,1,1);\n            animation-timing-function: cubic-bezier(0.8,0,1,1);\n  }\n\n  50% {\n    transform: none;\n    -webkit-animation-timing-function: cubic-bezier(0,0,0.2,1);\n            animation-timing-function: cubic-bezier(0,0,0.2,1);\n  }\n}\n\n@keyframes bounce {\n  0%, 100% {\n    transform: translateY(-25%);\n    -webkit-animation-timing-function: cubic-bezier(0.8,0,1,1);\n            animation-timing-function: cubic-bezier(0.8,0,1,1);\n  }\n\n  50% {\n    transform: none;\n    -webkit-animation-timing-function: cubic-bezier(0,0,0.2,1);\n            animation-timing-function: cubic-bezier(0,0,0.2,1);\n  }\n}\n\n@media (min-width: 640px) {\n  .sm\\:container {\n    width: 100%;\n  }\n\n  @media (min-width: 640px) {\n    .sm\\:container {\n      max-width: 640px;\n    }\n  }\n\n  @media (min-width: 768px) {\n    .sm\\:container {\n      max-width: 768px;\n    }\n  }\n\n  @media (min-width: 1024px) {\n    .sm\\:container {\n      max-width: 1024px;\n    }\n  }\n\n  @media (min-width: 1280px) {\n    .sm\\:container {\n      max-width: 1280px;\n    }\n  }\n}\n\n@media (min-width: 768px) {\n  .md\\:container {\n    width: 100%;\n  }\n\n  @media (min-width: 640px) {\n    .md\\:container {\n      max-width: 640px;\n    }\n  }\n\n  @media (min-width: 768px) {\n    .md\\:container {\n      max-width: 768px;\n    }\n  }\n\n  @media (min-width: 1024px) {\n    .md\\:container {\n      max-width: 1024px;\n    }\n  }\n\n  @media (min-width: 1280px) {\n    .md\\:container {\n      max-width: 1280px;\n    }\n  }\n}\n\n@media (min-width: 1024px) {\n  .lg\\:container {\n    width: 100%;\n  }\n\n  @media (min-width: 640px) {\n    .lg\\:container {\n      max-width: 640px;\n    }\n  }\n\n  @media (min-width: 768px) {\n    .lg\\:container {\n      max-width: 768px;\n    }\n  }\n\n  @media (min-width: 1024px) {\n    .lg\\:container {\n      max-width: 1024px;\n    }\n  }\n\n  @media (min-width: 1280px) {\n    .lg\\:container {\n      max-width: 1280px;\n    }\n  }\n}\n\n@media (min-width: 1280px) {\n  .xl\\:container {\n    width: 100%;\n  }\n\n  @media (min-width: 640px) {\n    .xl\\:container {\n      max-width: 640px;\n    }\n  }\n\n  @media (min-width: 768px) {\n    .xl\\:container {\n      max-width: 768px;\n    }\n  }\n\n  @media (min-width: 1024px) {\n    .xl\\:container {\n      max-width: 1024px;\n    }\n  }\n\n  @media (min-width: 1280px) {\n    .xl\\:container {\n      max-width: 1280px;\n    }\n  }\n}\n";
    styleInject(css_248z);

    window.alpineDevToolsThemeHacktoberfest2020 = css_248z;

    const alpine = window.deferLoadingAlpine || (alpine => alpine());

    window.deferLoadingAlpine = callback => {
      alpine(callback);
      DevTools.start(Loader, Viewer, css_248z);
    };

})));
