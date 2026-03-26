export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        onyx: {
          50: '#fafafa',
          100: '#f4f4f5',
          400: '#a1a1aa',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          light: '#818cf8',
        },
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#f43f5e',
          info: '#3b82f6',
        }
      },
      fontFamily: { sans: ['Inter var', 'Inter', 'sans-serif'] },
    }
  },
  plugins: []
};
