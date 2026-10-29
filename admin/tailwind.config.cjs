module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F5F1',
        gold: '#C6A55C',
        gold2: '#D4AF37',
        muted: '#EDE8E1'
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        soft: '0 6px 20px rgba(12,8,6,0.06)'
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: []
}
