/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cahs: {
          // Light mode backgrounds
          cream: '#FEFCF9',
          'warm-gray': '#F7F3EE',
          charcoal: '#1A1A1A',
          stone: '#6B6B6B',
          ash: '#C8C0B8',
          // Accent
          amber: '#C47B47',
          'amber-light': '#F5E6D3',
          'amber-hover': '#A8642E',
          // Mood semantic colors
          peaceful: '#6B9E7A',
          heavy: '#5A80C8',
          overwhelmed: '#C0544A',
          warning: '#D4A030',
          // Dark mode surfaces
          'dark-bg': '#121212',
          'dark-surface': '#1E1E1E',
          'dark-elevated': '#2A2A2A',
          'dark-text': '#F0EBE3',
          'dark-muted': '#A09890',
        },
      },
      fontFamily: {
        'dm-sans': ['DMSans_400Regular'],
        'dm-sans-medium': ['DMSans_500Medium'],
        'dm-sans-semibold': ['DMSans_600SemiBold'],
        'dm-serif': ['DMSerifDisplay_400Regular'],
        'dm-serif-italic': ['DMSerifDisplay_400Regular_Italic'],
      },
    },
  },
  plugins: [],
};
