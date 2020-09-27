# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Removed need to identify and load in entire script
Extracted functions into separate files for better loading
Added Tailwind config with purging for faster loading
Added auto theming based on tailwind config
Improved development of this project with reloading popup instead of previously having to open/close the popup
Made the status icons hopefully less distracting

## [0.6.0] - 2020-09-08
### Added
- Discovers new components added after page load
- Adds refresh attribute to elements to trigger external mutation watcher
- You can now edit strings from the dev tools
- Adds a status bar for important info (ex during string update)
### Removed
- No longer registers component events on the window
