const DevTools = {
    start(Loader, Viewer, theme) {
        window.alpineDevTools = {
            version: '0.10.0',
            Viewer: Viewer,
            Loader: Loader,
            theme: theme,
        }
        window.addEventListener('DOMContentLoaded', () => this.injectButtonIntoPage())
    },
    injectButtonIntoPage() {
        // TODO: If packages as a Chrome/FF plugin this can likely be removed entirely!
        const alpineDevToolsComponent = document.createElement('button')
        alpineDevToolsComponent.id = 'alpine-devtools'
        alpineDevToolsComponent.setAttribute('x-data', 'window.alpineDevTools.Loader(window.alpineDevTools.Viewer, window.alpineDevTools.theme)')
        alpineDevToolsComponent.setAttribute('x-devtools-ignore', '')
        alpineDevToolsComponent.setAttribute('x-show.transition.out.opacity.duration.1000', 'alpines.length && !open')
        alpineDevToolsComponent.setAttribute('x-bind:class', '{"alpine-button-devtools-closed" : !open}')
        alpineDevToolsComponent.setAttribute('x-on:click', 'openWindow')
        alpineDevToolsComponent.setAttribute('x-on:open-alpine-devtools.window', 'openWindow')
        alpineDevToolsComponent.setAttribute('x-on:focus-alpine-devtools.window', 'focusDevTools')
        alpineDevToolsComponent.setAttribute('x-on:alpine-devtools-switch-theme.window', 'setTheme(event.detail)')
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
}

export default DevTools
