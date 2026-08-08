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
      },
      keyframes: {
        livePulse: {
          '0%, 100%': { boxShadow: '0 0 4px 0 rgba(86,217,43,0.5), 0 0 0 0 rgba(86,217,43,0.4)' },
          '50%': { boxShadow: '0 0 14px 3px rgba(86,217,43,0.75), 0 0 22px 6px rgba(86,217,43,0.25)' }
        },
        liveDot: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.3, transform: 'scale(0.75)' }
        },
        shimmerSweep: {
          '0%': { backgroundPosition: '160% 0' },
          '100%': { backgroundPosition: '-60% 0' }
        }
      },
      animation: {
        // Two animations combined on one property (comma-separated), so the
        // LIVE NOW badge shimmers AND pulses at once — see HeroPanel.
        liveBadge: 'shimmerSweep 2.6s linear infinite, livePulse 1.8s ease-in-out infinite',
        liveDot: 'liveDot 1.4s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
