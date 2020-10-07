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
                // Color palette: https://primer.style/css/support/color-system
                'background': '#ffffff',
                'container-border': '#f0f0f0',
                'component-divider': '#d1d5da',
                'component-title': '#24292e',
                'status-text': '#6a737d',
                'status-text-hover': '#ea4aaa',
                'property-name-color': '#0366d6',
                'property-seperator-color': '#0069ff',
                'typeof-color': '#2ea44f',
                'typeof-bg': 'transparent',
                'value-color': '#24292e',
                'string-editor-color': '#24292e',
                'string-editor-bg': '#d1d5da',
                'icon-color': '#6a737d',
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
