/** @type {import('tailwindcss').Config} */
module.exports = {

  darkMode: 'selector',

  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      fontFamily: {
        signika: ['signika', 'sans-serif'],
      },
      colors: {
        nav_dark: '#2a3038',
        background_dark: '#282c34',
        theme_purple: '#7C3AED;',
      },

      backgroundImage: {
        'hero-pattern': "url('./assets/images/background.png')",
        'view-pattern': "url('./assets/images/background3.jpg')",
        'footer-texture': "url('/img/footer-texture.png')",
      },

      keyframes: {
        wiggle: {
          '0%, 100%': {
            transform: 'rotate(-3deg)'
          },
          '50%': {
            transform: 'rotate(3deg)'
          },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-10%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          },
        },

        'width-expand': {
          '0%': {
            width: '0'
          },
          '100%': {
            width: '100%'
          },
        },
        'width-shrink': {
          '0%': {
            width: '100%'
          },
          '100%': {
            width: '0'
          },
        },

        'height-expand': {
          '0%': {
            height: '0px'
          },
          '100%': {
            height: '150px'
          },
        },
      },
      animation: {
        ping_slow: 'ping 1s ease-in-out',
        wiggle: 'wiggle 4s ease-in-out',
        bounce: 'bounce 1s ease-in',
        expand: 'width-expand 3s ease-in-out',
        height: 'height-expand 1.5s',
        shrink: 'width-shrink 10s ease-in-out',
      },
    },
  },
  plugins: [],
}