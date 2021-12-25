const colors = require('tailwindcss/colors')

module.exports = {
  'fontFamily': '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',

  'base-100': colors.neutral['50'],
  'base-200': colors.neutral['200'],
  'base-300': colors.neutral['400'],
  'base-content': colors.neutral['700'],

  'primary': colors.sky['500'],
  'primary-focus': colors.sky['600'],
  'primary-content': colors.sky['100'],
  'secondary': colors.violet['500'],
  'secondary-focus': colors.violet['400'],
  'secondary-content': colors.violet['300'],

  'accent': colors.emerald['500'],
  'accent-focus': colors.emerald['400'],
  'accent-content': colors.neutral['900'],

  'neutral': colors.neutral['800'],
  'neutral-focus': colors.neutral['700'],
  'neutral-content': colors.neutral['200'],

  'info': colors.pink['400'],
  'success': colors.green['600'],
  'warning': colors.amber['500'],
  'error': colors.red['600'],

  '--theme-gradient': `repeating-linear-gradient(
    -45deg,
    #77cbf9,
    #77cbf9 20px,
    #ecadb9 20px,
    #ecadb9 40px,
    #ffffff 40px,
    #ffffff 60px,
    #ecadb9 60px,
    #ecadb9 80px,
    #77cbf9 80px,
    #77cbf9 100px,
    transparent 100px,
    transparent 105px
  )`,

  '--code-background-color': colors.neutral['100'],
  '--code-border-color': colors.neutral['300'],
  '--code-color': colors.neutral['900'],
  '--code-font-family': `"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace`,
  '--code-border-radius': '0.5rem',
  '--code-border-style': 'solid',
  '--code-border-width': 1,
  '--code-outer-padding': '0 0.5rem',
  '--code-inner-padding': '1rem',

  '--code-color-keyword': colors.pink['500'],
  '--code-font-weight-keyword': 'bold',
  '--code-color-entity': colors.violet['500'],
  '--code-font-weight-entity': 'bold',
  '--code-color-constant': colors.lime['600'],
  '--code-color-string': colors.sky['600'],
  '--code-font-style-string': 'italic',
  '--code-color-variable': colors.indigo['600'],
  '--code-color-comment': colors.neutral['600'],
  '--code-color-tag': colors.green['600'],
  '--code-color-property': 'inherit',
  '--code-font-weight-property': 'bold',

  '--pattern-bg': colors.neutral['50'],
  '--pattern-fabric': colors.neutral['700'],
  '--pattern-lining': colors.emerald['500'],
  '--pattern-interfacing': colors.neutral['400'],
  '--pattern-canvas': colors.amber['600'],
  '--pattern-various': colors.red['500'],
  '--pattern-mark': colors.blue['500'],
  '--pattern-contrast': colors.pink['500'],
  '--pattern-note': colors.violet['500'],

  '--pattern-scale': 1,
  '--pattern-stroke-xs': "0.2",
  '--pattern-stroke-sm': "0.4",
  '--pattern-stroke': "0.7",
  '--pattern-stroke-lg': "1.3",
  '--pattern-stroke-xl': "2",
  '--pattern-stroke-xxl': "4",
}

