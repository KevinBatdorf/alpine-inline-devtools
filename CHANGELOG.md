# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
- Removes the string label and puts the text in quotes (For now. Might consider adding this back)
### Removed
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
