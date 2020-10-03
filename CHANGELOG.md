# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.8.0] - 2020-10-03
### Added
- Added a theme based on Github (https://primer.style/css/support/color-system)
- Added a theme based on Hacktoberfest 2020 (http://web.archive.org/web/20200924003932/https://embed-ssl.wistia.com/deliveries/49bd387c40e2c5aada92abdf973bc46d.webp)
- Added a theme based on Dracula (https://draculatheme.com/contribute)
### Changed
- Updated font to Fira Code (Will eventually make font customizable)
### Fixed
- Fixed scoping issue where the scope label was updated twice

## [0.7.0] - 2020-09-28
### Added
- Improved how the script gets injected into the popup
- Includes Tailwind config with purging of the CSS instead of loading the CDN
- Added a theming setup based on a few Tailwind config items. Will add in more themes soon
- Improved development of this project with reloading popup instead of previously having to open/close the popup
- A default status message shows how many components are being watched
- Added internal way to track the nested scope (i.e. determine whether a string is inside an array)
### Changed
- Extracted functions into separate files for better loading
- Made the status icons hopefully less distracting
### Removed
- Removes the string label and puts the text in quotes (For now. Might consider adding this back)
### Fixed
- Fixed bug where you could attempt to edit strings in objects

## [0.6.0] - 2020-09-08
### Added
- Discovers new components added after page load
- Adds refresh attribute to elements to trigger external mutation watcher
- You can now edit strings from the dev tools
- Adds a status bar for important info (ex during string update)
### Removed
- No longer registers component events on the window
