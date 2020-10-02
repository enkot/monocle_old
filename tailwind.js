module.exports = {
  theme: {
    extend: {
      fontFamily: {
        mono: ['Cousine', 'monospace']
      },
      colors: {
        gray: {
          100: '#F7F8FA',
          150: '#F3F4F7',
          200: '#EAEEF3',
          300: '#DEE3EB',
          400: '#C5CFDD',
          500: '#ACBACE',
          600: '#9BA7B9',
          700: '#67707C',
          800: '#4D545D',
          900: '#34383E'
        },
        primary: {
          100: '#d0bcff',
          200: '#bca8ff',
          300: '#a894ff',
          400: '#9480ff',
          500: '#806CF6',
          600: '#6c58e2',
          700: '#5844ce',
          800: '#4430ba',
          900: '#301ca6'
        }
      },
      margin: {
        '0.5': '0.1rem',
        '1.5': '0.3rem'
      },
      padding: {
        '0.5': '0.1rem',
        '1.5': '0.35rem'
      },
      boxShadow: {
        '2lg':
          ' 0 10px 15px -3px rgba(0, 0, 0, .15), 0 4px 6px -2px rgba(0, 0, 0, .1)',
        'outline-primary': '0 0 0 3px rgba(128,108,246,0.3)'
      },
      fontSize: {
        xxs: '.675rem'
      },
      maxHeight: {
        '75vh': '75vh',
        '50vh': '50vh',
        none: 'none'
      },
      height: {
        '1/3': '33.33333%'
      },
      spacing: {
        '47': '11.5rem'
      },
      opacity: {
        10: '.1'
      }
    }
  },
  variants: {
    borderWidth: ['responsive', 'last']
  },
  plugins: []
}
