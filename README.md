# Alpine Inline DevTools
An easy way to monitor your state while developing with Alpine

![alt text](assets/devtools.gif "Title")

## Installation

Include the following `<script>` tag in the `<head>` of your document (before Alpine):

```html
<!-- To be used during development only -->
@if (App::environment(['local', 'staging'])) {
    <script id="alpine-devtools-script" src="https://cdn.jsdelivr.net/gh/kevinbatdorf/alpine-inline-devtools@0.4.0/dist/index.js"></script>
@endif
```
> ⚠️ Having the ID in the script tag is optional but will help identify the script slightly faster

> ⚠️ CodePen support is limited to using Live mode, as the script will otherwise be blocked on code refresh

### Bookmarklet

If you would like to add this as a bookmarklet, you may use the following:
```js
javascript:(function(){const s=document.createElement('script');s.id='alpine-devtools-script';s.setAttribute('type','text/javascript');s.src='https://cdn.jsdelivr.net/gh/kevinbatdorf/alpine-inline-devtools@0.4.0/dist/index.js';s.onload=function(){window.forceLoadAlpineDevTools();};document.head.appendChild(s)})();
```
> ⚠️ NB: The bookmarklet is only useful to just check a site out. You will have to press it on every page load to re-inject the script. If there is demand for something more flexible I can look into wrapping this up in a Chrome extension that can get more access and auto-inject.

## Themes
The next iteration of this project will include adding themes, since as developers it's important to have our tools look as comfortable as they function. Currently, all of TailwindCSS is being pulled in as well, which will most likely change to instead pull in a custom build per theme.

## Two-way binding
The idea of this project wasn't to replicate other popular Dev Tools but instead to create a tool so that I could easily and quickly view the changes in my components. I found while working in other frameworks, I hardly ever used the Dev Tools to manipulate the application state. That said, I may still implement this, especially if there is demand (So check if there is an open issue and comment, or open a new one).

## License

Copyright (c) 2020 Kevin Batdorf

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
