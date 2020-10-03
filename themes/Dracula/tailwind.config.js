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
                // Color palette: https://draculatheme.com/contribute
                'background': '#282a36',
                'component-divider': '#44475a',
                'component-title': '#ff79c6',
                'status-text': '#6272a4',
                'status-text-hover': '#8be9fd',
                'property-name-color': '#50fa7b',
                'property-seperator-color': '#8be9fd',
                'typeof-color': '#bd93f9',
                'typeof-bg': 'transparent',
                'value-color': '#f8f8f2',
                'string-editor-color': '#f8f8f2',
                'string-editor-bg': '#44475a',
                'icon-color': '#f1fa8c',
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
