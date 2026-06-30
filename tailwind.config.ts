import type { Config } from 'tailwindcss'

const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff8a00',
          start: '#ff8a00',
          end: '#ffb800',
          hover: '#ffb800',
          active: '#e6a000',
          subtle: 'rgba(255, 138, 0, 0.1)',
          light: 'rgba(255, 138, 0, 0.1)',
        },
        bg: {
          dark: 'rgb(0, 4, 25)',
          darkSolid: '#000419',
          light: '#f8f9ff',
          input: 'rgba(255, 255, 255, 0.05)',
          elevated: 'rgba(15, 23, 42, 0.8)',
        },
        text: {
          white: '#ffffff',
          primary: 'rgba(179, 197, 255, 0.8)',
          secondary: '#7285bc',
          placeholder: 'rgba(114, 133, 188, 0.5)',
          muted: '#7285bc',
          link: '#ff8a00',
          dark: '#0b1c30',
          disabled: 'rgba(114, 133, 188, 0.5)',
        },
        border: {
          light: 'rgba(255, 255, 255, 0.1)',
          input: 'rgba(255, 255, 255, 0.1)',
          divider: 'rgba(255, 255, 255, 0.1)',
          focus: '#ff8a00',
        },
      },
      fontFamily: {
        arabic: ['Cairo', 'sans-serif'],
        latin: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'heading-xl': '32px',
        'heading-lg': '18px',
        'body': '16px',
        'button': '14px',
        'label': '12px',
        'small': '14px',
      },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      lineHeight: {
        heading: '40px',
        subtitle: '28px',
        button: '20px',
        label: '16px',
        body: 'normal',
        small: '20px',
      },
      letterSpacing: {
        heading: '-0.64px',
        label: '0.48px',
        button: '0.14px',
        password: '1.6px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '48px',
        '6xl': '64px',
        '7xl': '80px',
      },
      borderRadius: {
        input: '16px',
        button: '16px',
        card: '16px',
      },
      boxShadow: {
        primary: '0px 8px 10px rgba(255, 138, 0, 0.3)',
        'primary-hover': '0px 12px 16px rgba(255, 138, 0, 0.4)',
      },
      backdropBlur: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '20px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #ff8a00 0%, #ffb800 100%)',
        'gradient-primary-horizontal': 'linear-gradient(90deg, #ff8a00 0%, #ffb800 100%)',
        'gradient-dark': 'linear-gradient(90deg, rgb(0, 4, 25) 0%, rgb(0, 4, 25) 100%)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'radar-sweep': 'radar-sweep 2s linear infinite',
      },
      keyframes: {
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
