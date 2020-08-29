# Alpine Inline Devtools
An easy way to monitor your state while developing with Alpine

![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/kevinbatdorf/alpine-inline-devtools?label=version&style=flat-square)

## About

![alt text](assets/devtools.gif "Title")

## Installation

Include the following `<script>` tag in the `<head>` of your document (before Alpine):

```html
@if (App::environment(['local', 'staging'])) {
    <script src="https://cdn.jsdelivr.net/gh/kevinbatdorf/alpine-inline-devtools@0.x.x/dist/index.js"></script>
@endif
```
> ⚠️ This code isn't meant to be used in production.

## Themes
The next iteration of this project will include adding themes, since as developers it's important to have our tools look as comfortable as they function.

## Two-way binding
The idea of this project wasn't to replicate other popular Dev Tools but instead to create a tool so that I could easily and quickly view the changes in my components. I found while working in VueJS I hardly ever used that feature. That said, I may still impliment this, especially if there is demand (So check if there is an open issue).

## License

Copyright (c) 2020Kevin Batdorf

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
