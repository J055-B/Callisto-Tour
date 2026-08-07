module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        page: '#05090B',
        surface: '#0B1114',
        elevated: '#10181C',
        border: '#1D292F',
        yellow: '#FFD400',
        positive: '#56D92B',
        orange: '#FF7A00',
        negative: '#FF453A',
        electric: '#2F81FF',
        primaryText: '#F4F7F8',
        secondaryText: '#8B999F'
      }
    }
  },
  plugins: []
}
