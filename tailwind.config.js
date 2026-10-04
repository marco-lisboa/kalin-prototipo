/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kalin: {
          dark: '#193027',       // Verde escuro institucional profundo
          green: '#0B6B18',      // Verde vivo da marca
          primary: '#16A63A',    // Verde vibrante de destaque/ação
          light: '#EAF7ED',      // Fundo suave verde
          background: '#F6F8F7', // Fundo principal da aplicação
          text: '#17211D',       // Texto primário grafite escuro
          surface: '#FFFFFF',
          muted: '#5F7367',      // Cinza esverdeado para textos secundários
          border: '#DDE7E1',     // Bordas sutis
          card: '#FFFFFF',
          darksurface: '#11221B',// Superfície escura para player e streaming
          darkcard: '#1B342A',   // Card escuro para streaming
          darkborder: '#28483B', // Borda escura
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'kalin-sm': '0 2px 8px -2px rgba(25, 48, 39, 0.06)',
        'kalin-md': '0 8px 24px -4px rgba(25, 48, 39, 0.08)',
        'kalin-lg': '0 16px 36px -6px rgba(25, 48, 39, 0.12)',
        'kalin-glow': '0 0 25px rgba(22, 166, 58, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.35s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
