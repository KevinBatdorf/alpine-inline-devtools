# Alpine Inline Devtools
An easy way to monitor your state while developing with Alpine

![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/kevinbatdorf/alpine-inline-devtools?label=version&style=flat-square)

## About

![alt text](assets/devtools.gif "Title")

## Installation

Include the following `<script>` tag in the `<head>` of your document (before Alpine):

```html
<!-- To be used in development only -->
@if (App::environment(['local', 'staging'])) {
    <script src="https://cdn.jsdelivr.net/gh/kevinbatdorf/alpine-inline-devtools@0.1.x/dist/index.js"></script>
@endif
```
> ⚠️ This will not work effeciently if installed via NPM. I've only added it to NPM for a better jsDeliver UX

## Themes
The next iteration of this project will include adding themes, since as developers it's important to have our tools look as comfortable as they function. Currently, all of TailwindCSS is being pulled in as well, which will most likely change to instead pull in a custom build per theme.

## Two-way binding
The idea of this project wasn't to replicate other popular Dev Tools but instead to create a tool so that I could easily and quickly view the changes in my components. I found while working in other frameworks, I hardly ever used the Dev Tools to manipulate the application state. That said, I may still impliment this, especially if there is demand (So check if there is an open issue and comment, or open a new one).

## License

Copyright (c) 2020Kevin Batdorf

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
