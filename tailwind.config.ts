
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				carebow: {
					// Primary purple theme
					'primary': 'hsl(265, 89%, 66%)',
					'primary-dark': 'hsl(265, 89%, 50%)',
					'primary-light': 'hsl(265, 89%, 80%)',
					'primary-50': 'hsl(265, 89%, 95%)',
					'primary-100': 'hsl(265, 89%, 90%)',
					'primary-200': 'hsl(265, 89%, 85%)',
					'primary-300': 'hsl(265, 89%, 80%)',
					'primary-400': 'hsl(265, 89%, 70%)',
					'primary-500': 'hsl(265, 89%, 66%)',
					'primary-600': 'hsl(265, 89%, 60%)',
					'primary-700': 'hsl(265, 89%, 50%)',
					'primary-800': 'hsl(265, 89%, 40%)',
					'primary-900': 'hsl(265, 89%, 30%)',
					
					// Secondary colors for variety
					'blue': 'hsl(214, 92%, 91%)',
					'mint': 'hsl(90, 67%, 94%)',
					'peach': 'hsl(24, 92%, 91%)',
					'red': 'hsl(0, 84%, 60%)',
					'green': 'hsl(142, 76%, 60%)',
					'orange': 'hsl(25, 95%, 60%)',
					
					// Text colors
					'text-dark': 'hsl(0, 0%, 20%)',
					'text-medium': 'hsl(0, 0%, 33%)',
					'text-light': 'hsl(0, 0%, 47%)',
					'text-muted': 'hsl(0, 0%, 60%)',
					
					// Background colors
					'bg-light': 'hsl(0, 0%, 98%)',
					'bg-neutral': 'hsl(0, 0%, 96%)',
					'bg-card': 'hsl(0, 0%, 100%)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite'
			},
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'nunito': ['Nunito', 'sans-serif'],
				'poppins': ['Poppins', 'sans-serif']
			},
			backgroundImage: {
				'gradient-soft': 'linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)',
				'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
				'gradient-secondary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
