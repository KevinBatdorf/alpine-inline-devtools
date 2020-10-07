const DevTools = {
    start(Loader, Viewer, theme) {
        window.alpineDevTools = {
            version: '0.11.1',
            Viewer: Viewer,
            Loader: Loader,
            theme: theme,
        }
        window.addEventListener('DOMContentLoaded', () => {
            this.injectDevToolsHandler()

            // A button is on the page already. use that instead
            const button = document.getElementById('alpine-devtools-button')
            if (button) {
                button.addEventListener('click', () => {
                    window.dispatchEvent(new CustomEvent('open-alpine-devtools-popup', {
                        bubbles: true,
                    }))
                })
            }
            if (sessionStorage.getItem('alpine-devtools') !== 'Popup') {
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('open-alpine-devtools', {
                        bubbles: true,
                    }))
                }, 0)
            }
        })
    },
    injectDevToolsHandler() {
        const alpineDevToolsComponent = document.createElement('div')
        alpineDevToolsComponent.id = 'alpine-devtools'
        alpineDevToolsComponent.setAttribute('x-data', 'window.alpineDevTools.Loader(window.alpineDevTools.Viewer, window.alpineDevTools.theme)')
        alpineDevToolsComponent.setAttribute('x-devtools-ignore', '')
        alpineDevToolsComponent.setAttribute('x-on:open-alpine-devtools.window', 'openIframe()')
        alpineDevToolsComponent.setAttribute('x-on:open-alpine-devtools-popup.window', 'openPopup()')
        alpineDevToolsComponent.setAttribute('x-on:focus-alpine-devtools.window', 'focusDevTools()')
        alpineDevToolsComponent.setAttribute('x-on:alpine-devtools-switch-theme.window', 'setTheme($event.detail)')
        alpineDevToolsComponent.setAttribute('x-init', '$nextTick(() => { start() })')
        alpineDevToolsComponent.style.cssText = "display:none!important"
        document.body.appendChild(alpineDevToolsComponent)
    }
}

export default DevTools
