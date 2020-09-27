// TODO: Add theme support so that you can override class names instead of being limited to defaults
module.exports = {
    purge: {
        enabled: true,
        content: [
            'src/Viewer.js',
            'src/Loader.js',
        ],
    },
    theme: {
        extend: {
            colors: {
                'background': '#1a202c',
                'component-divider': '#2d3748',
                'component-title': '#d8dee9',
                'status-text': '#8ac0cf',
                'status-text-hover': '#4299e1',
                'property-name-color': '#4aea8b',
                'property-name-bg': 'transparent',
                'property-seperator-color': '#ffffff',
                'property-seperator-bg': 'transparent',
                'typeof-color': '#8ac0cf',
                'typeof-bg': '#2d3748',
                'value-color': '#d8dee9',
                'value-bg': 'transparent',
                'string-editor-color': '#000',
                'string-editor-bg': '#edf2f7',
                'string-icon-color': '#edf2f7',
            },
            // TODO: spacing, font family,
            spacing: {
            }
        }
    },
    variants: {},
    plugins: [],
    future: {
        removeDeprecatedGapUtilities: true,
      },
      experimental: {
        extendedSpacingScale: true,
        extendedFontSizeScale: true,
      },
}
