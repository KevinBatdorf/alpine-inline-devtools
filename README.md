# Alpine Inline DevTools
Monitor and update your component state while developing with Alpine JS

[Live Demo](https://kevinbatdorf.github.io/alpine-inline-devtools/)

## Installation

Include the following `<script>` tag in the `<head>` of your document (before Alpine):

```html
<!-- To be used during development only -->
@if (App::environment(['local', 'staging'])) {
    <script src="https://cdn.jsdelivr.net/gh/kevinbatdorf/alpine-inline-devtools@0.9.x/dist/Default.js"></script>
@endif
```

## Themes
Choose from a variety of themes. ([Demo](https://kevinbatdorf.github.io/alpine-inline-devtools/))

## Wrapped up as a browser extension
If there's enough interest I will look into packaging this up as a browser extension so you can run it on any page whether in development or not

## Limitations
* CodePen support is limited to using Live/Debug mode, as the script will otherwise be blocked on code refresh.

## Contributing
If you're interested in contributing to this project, please read our [contributing docs](https://github.com/KevinBatdorf/alpine-inline-devtools/blob/master/.github/CONTRIBUTING.md) **before submitting a pull request**.

## License

Copyright (c) 2020 Kevin Batdorf

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
