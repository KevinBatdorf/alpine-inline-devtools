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
                'background': '#072540',
                'container-border': 'transparent',
                'component-divider': '#183d5d',
                'component-title': '#ffffff',
                'status-text': '#93c2db',
                'status-text-hover': '#ff8ae2',
                'property-name-color': '#ff8ae2',
                'property-seperator-color': '#0069ff',
                'typeof-color': '#93c2db',
                'typeof-bg': 'transparent',
                'value-color': '#ffffff',
                'string-editor-color': '#ffffff',
                'string-editor-bg': '#183d5d',
                'icon-color': '#93c2db',
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
