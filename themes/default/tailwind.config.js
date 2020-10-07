module.exports = {
    purge: {
        enabled: true,
        content: [
            'src/Viewer.js',
            'src/Loader.js',
        ],
    },
    theme: {
        fontFamily: {
            mono: ['Fira Code', 'monospace'],
        },
        extend: {
            colors: {
                'background': '#1a202c',
                'container-border': 'transparent',
                'component-divider': '#2d3748',
                'component-title': '#d8dee9',
                'status-text': '#8ac0cf',
                'status-text-hover': '#4299e1',
                'property-name-color': '#4aea8b',
                'property-seperator-color': '#ffffff',
                'typeof-color': '#8ac0cf',
                'typeof-bg': '#2d3748',
                'value-color': '#d8dee9',
                'string-editor-color': '#000',
                'string-editor-bg': '#edf2f7',
                'icon-color': '#edf2f7',
            },
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
