# Alpine Inline DevTools
Monitor and update your component state while developing with Alpine JS

[Live Demo](https://kevinbatdorf.github.io/alpine-inline-devtools/)

## Installation

Include the following `<script>` tag in the `<head>` of your document (before Alpine):

```html
<!-- To be used during development only -->
@if (App::environment(['local', 'staging'])) {
    <script src="https://cdn.jsdelivr.net/gh/kevinbatdorf/alpine-inline-devtools@0.12.x/dist/Default.js"></script>
@endif
```

## Coming soon
- Currently from the Dev Tools, you can update strings, booleans, and arrays, but not numbers and objects.

## Themes
Choose from a variety of themes. ([Demo](https://kevinbatdorf.github.io/alpine-inline-devtools/))

My current favorite is Dracula:
```html
<script src="https://cdn.jsdelivr.net/gh/kevinbatdorf/alpine-inline-devtools@0.12.x/dist/Dracula.js"></script>
```

## Tips
- Add `x-devtools-ignore` to instruct the DevTools to ignore specific components.
- Add `x-title` to set the title (will default to the `aria-label`, `x-id` then `id` otherwise).
- Add your own button with an `id` of `alpine-devtools-button` to prevent the iframe from loading (will load a popup when pressed)
- Add your own iframe with an `id` of `alpine-devtools-iframe` to position it where you like (see [demo](https://kevinbatdorf.github.io/alpine-inline-devtools/))
- Click the status bar on the iframe to collapse it. It will remember this on page reload.

## Wrapped up as a browser extension
If there's enough interest I will look into packaging this up as a browser extension so you can run it on any page whether in development or not

## Contributing
If you're interested in contributing to this project, please read our [contributing docs](https://github.com/KevinBatdorf/alpine-inline-devtools/blob/master/.github/CONTRIBUTING.md) **before submitting a pull request**.

## License

Copyright (c) 2020 Kevin Batdorf

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
