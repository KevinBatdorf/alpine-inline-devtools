# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.12.0] - 2020-10-07
### Fixed
- Shortened the iframe collapsed height to avoid overflow
- Removed double scrollbars in Windows.
- Made strings scrollable instead of a long paragraph.
### Added
- You can now edit strings to that are on arrays
- You can now append strings to arrays
- You can now delete items from arrays
- You can now collapse arrays (it doesn't persist but I might make that an option later on)

## [0.11.1] - 2020-10-07
### Fixed
- Fix min height issue for the inner container
- Fix loading the viewer twice

## [0.11.0] - 2020-10-07
### Added
- Added true inline DevTools via an iframe (default configuration)
- Added a button so you can open the iframe in a tab
- Added a border class for themes
- If you add your own iframe or button to the page, it will override the default loading
- The iframe can be collapsable, even between sessions (click the status bar)
### Changed
- Simplified the landing page to be more interactive and removed most the text.

## [0.10.1] - 2020-10-04
### Fixed
- Fixed typo `x-ignore` to `x-devtools-ignore`

## [0.10.0] - 2020-10-04
### Fixed
- Bumped up gutter button padding 1px
### Added
- Added an `x-devtools-ignore` attribute to hide components from DevTools

## [0.9.2] - 2020-10-03
### Fixed
- Updated build files with proper version numbers (TODO: automate that!)

## [0.9.1] - 2020-10-03
### Fixed
- Update build file name case in git (ie. `Github.js` -> `GitHub.js`)

## [0.9.0] - 2020-10-03
### Added
- Added live demo page
- Added version number that you can access from a component
- Added a way to live swap a theme (probably only useful for the live demo)
- Added a way to focus the DevTools (also probably only useful for the demo)
### Changed
- Updated the default theme spelling to Default to match others
- Hide functions (maybe a regression as I thought this was already happening)
### Fixed
- Updated the color of the text when no data was found
- Fixed bug where strings would infinitely nest quotes

## [0.8.1] - 2020-10-03
### Fixed
- Waits for `DOMContentLoaded` before injecting the button

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
