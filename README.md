# Alpine Inline DevTools
An easy way to monitor your state while developing with Alpine

![alt text](assets/devtools.gif "Title")

## Installation

Include the following `<script>` tag in the `<head>` of your document (before Alpine):

```html
<!-- To be used during development only -->
@if (App::environment(['local', 'staging'])) {
    <script id="alpine-devtools-script" src="https://cdn.jsdelivr.net/gh/kevinbatdorf/alpine-inline-devtools@0.5.0/dist/index.js"></script>
@endif
```
> ⚠️ Having the ID in the script tag is optional but will help identify the script slightly faster.

## Themes
The next iteration of this project will include adding themes, since as developers it's important to have our tools look as comfortable as they function. Currently, all of TailwindCSS is being pulled in as well, which will most likely change to instead pull in a custom build per theme.

## Two-way binding
I'll slowly be adding more features for this. Currently only boolean values are supported.

## To-do
* Add more two-way binding support (strings, numbers)
* Keep the scroll position on reload
* Create various themes

## Limitations
* CodePen support is limited to using Live/Debug mode, as the script will otherwise be blocked on code refresh.
* Currently it will not work in Ingocnito browsers as access to the session is blocked.

## License

Copyright (c) 2020 Kevin Batdorf

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
