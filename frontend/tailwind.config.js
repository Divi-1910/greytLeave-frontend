/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
	  extend: {
		animation: {
		  'spin': "spin 1s linear infinite",
		  'gradient': 'gradient 8s linear infinite',
		  'float': 'float 8s ease-in-out infinite',
		},
		keyframes: {
		  spin: {
			"0%": { transform: "rotate(0deg)" },
			"100%": { transform: "rotate(360deg)" },
		  },
		  gradient: {
			'0%, 100%': {
			  'background-size': '200% 200%',
			  'background-position': 'left center',
			},
			'50%': {
			  'background-size': '200% 200%',
			  'background-position': 'right center',
			},
		  },
		  float: {
			'0%, 100%': {
			  transform: 'translateY(0)',
			},
			'50%': {
			  transform: 'translateY(-20px)',
			},
		  },
		},
		boxShadow: {
		  'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		  'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		},
	  },
	},
	variants: {
	  extend: {
		opacity: ["disabled"],
		cursor: ["disabled"],
		backgroundColor: ['disabled'],
		boxShadow: ['hover'],
	  },
	},
	plugins: [],
  };