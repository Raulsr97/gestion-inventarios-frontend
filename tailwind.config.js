/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        display: ['group-hover', 'group-focus', 'print'],
      },
    },
    plugins: [],
    corePlugins: {
      // Puedes activar estas utilidades si no están por defecto
      breakInside: true
    }
  };
  