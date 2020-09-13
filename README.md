# Alpine Inline DevTools
Monitor and update your component state while developing with Alpine JS

![alt text](assets/devtools.gif "Title")

## Installation

Include the following `<script>` tag in the `<head>` of your document (before Alpine):

```html
<!-- To be used during development only -->
@if (App::environment(['local', 'staging'])) {
    <script id="alpine-devtools-script" src="https://cdn.jsdelivr.net/gh/kevinbatdorf/alpine-inline-devtools@0.6.0/dist/index.js"></script>
@endif
```
> ⚠️ Having the ID in the script tag is optional but will help identify the script slightly faster.

## Themes
The next iteration of this project will include adding themes, since as developers it's important to have our tools look as comfortable as they function.

## Limitations
* CodePen support is limited to using Live/Debug mode, as the script will otherwise be blocked on code refresh.

## License

Copyright (c) 2020 Kevin Batdorf

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
