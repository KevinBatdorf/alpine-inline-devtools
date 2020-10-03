import DevTools from '../../src/DevTools'
import Loader from '../../src/Loader.js'
import Viewer from '../../src/Viewer.js'
import theme from './main.css'

window.alpineDevToolsThemeHacktoberfest2020 = theme
const alpine = window.deferLoadingAlpine || ((alpine) => alpine())
window.deferLoadingAlpine = callback => {
    alpine(callback)
    DevTools.start(Loader, Viewer, theme)
}
