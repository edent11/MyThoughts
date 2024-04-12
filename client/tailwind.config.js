/** @type {import('tailwindcss').Config} */
module.exports = {

  darkMode: 'selector',
  plugins: ["prettier-plugin-tailwindcss"],

  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      lineClamp: {
        5: '5',
      },

      dropShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
        '4xl': [
          '0 35px 35px rgba(0, 0, 0, 0.25)',
          '0 45px 65px rgba(0, 0, 0, 0.15)'
        ]
      },

      fontFamily: {
        signika: ['signika', 'sans-serif'],
        info_story: ['infoStory', 'signika'],
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
        ping_slow: 'ping 1s ease-in-out',
        wiggle: 'wiggle 4s ease-in-out',
        bounce: 'bounce 1s ease-in',
        expand: 'width-expand 3s ease-in-out',
        height: 'height-expand 1.5s',
        shrink: 'width-shrink 10s ease-in-out',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({
      nocompatible: true
    })
  ],
}