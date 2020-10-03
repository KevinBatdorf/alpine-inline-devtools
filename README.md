# Alpine Inline DevTools
Monitor and update your component state while developing with Alpine JS

![alt text](assets/devtools.gif "Title")

## Installation

Include the following `<script>` tag in the `<head>` of your document (before Alpine):

```html
<!-- To be used during development only -->
@if (App::environment(['local', 'staging'])) {
    <script src="https://cdn.jsdelivr.net/gh/kevinbatdorf/alpine-inline-devtools@0.8.0/dist/default.min.js"></script>
@endif
```

## Themes
### Github
A light theme based on the [Github color palette](https://primer.style/css/support/color-system).
```
<script src="https://cdn.jsdelivr.net/gh/kevinbatdorf/alpine-inline-devtools@0.8.0/dist/Github.min.js"></script>
```
### Dracula
A dark theme based on the [Dracula color palette](https://draculatheme.com/contribute).
```
<script src="https://cdn.jsdelivr.net/gh/kevinbatdorf/alpine-inline-devtools@0.8.0/dist/Dracula.min.js"></script>
```
### Hacktoberfest 2020
A dark theme based on the [Hacktoberfest 2020 branding](http://web.archive.org/web/20200924003932/https://embed-ssl.wistia.com/deliveries/49bd387c40e2c5aada92abdf973bc46d.webp).
```
<script src="https://cdn.jsdelivr.net/gh/kevinbatdorf/alpine-inline-devtools@0.8.0/dist/Hacktoberfest2020.min.js"></script>
```

## Wrapped up as a browser extension
If there's enough interest I will look into packaging this up as a browser extension so you can run it on any page whether in development or not

## Limitations
* CodePen support is limited to using Live/Debug mode, as the script will otherwise be blocked on code refresh.

## Contributing
If you're interested in contributing to this project, please read our [contributing docs](https://github.com/KevinBatdorf/alpine-inline-devtools/blob/master/.github/CONTRIBUTING.md) **before submitting a pull request**.

## License

Copyright (c) 2020 Kevin Batdorf

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
