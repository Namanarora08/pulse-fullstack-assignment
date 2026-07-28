import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "system-ui",
          "sans-serif"
        ]
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)"
      },
      colors: {
        /* ── Backgrounds ── */
        background: "hsl(0 0% 4%)" /* #09090B */,
        "background-secondary": "hsl(0 0% 7%)" /* #111113 */,
        "background-elevated": "hsl(0 0% 9%)" /* #18181B */,
        "background-raised": "hsl(0 0% 13%)" /* #202024 */,

        foreground: "hsl(var(--foreground))",

        /* ── Text hierarchy ── */
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          muted: "hsl(var(--text-muted))"
        },

        /* ── Card ── */
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },

        /* ── Shadcn compat ── */
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        border: "rgba(255,255,255,0.06)",
        input: "rgba(255,255,255,0.08)",
        ring: "hsl(var(--ring))",

        /* ── Healthcare semantics ── */
        recovery: {
          DEFAULT: "hsl(var(--recovery))",
          foreground: "hsl(var(--recovery-fg))"
        },
        heart: {
          DEFAULT: "hsl(var(--heart))",
          foreground: "hsl(var(--heart-fg))"
        },
        medication: {
          DEFAULT: "hsl(var(--medication))",
          foreground: "hsl(var(--medication-fg))"
        },
        sleep: {
          DEFAULT: "hsl(var(--sleep))",
          foreground: "hsl(var(--sleep-fg))"
        },
        hydration: {
          DEFAULT: "hsl(var(--hydration))",
          foreground: "hsl(var(--hydration-fg))"
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-fg))"
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-fg))"
        },
        success: {
          DEFAULT: "hsl(var(--recovery))",
          foreground: "hsl(var(--recovery-fg))"
        }
      },

      boxShadow: {
        /* Elevation */
        "premium-sm":
          "0 1px 3px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.04)",
        "premium-md":
          "0 4px 12px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04)",
        "premium-lg":
          "0 8px 24px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.05)",
        "premium-xl":
          "0 16px 40px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.05)",
        "premium-2xl":
          "0 24px 64px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.05)",
        /* Glows */
        "glow-green": "0 0 28px rgba(52,211,153,.30)",
        "glow-red": "0 0 28px rgba(239,68,68,.30)",
        "glow-blue": "0 0 28px rgba(96,165,250,.30)",
        "glow-purple": "0 0 28px rgba(167,139,250,.30)",
        "glow-cyan": "0 0 28px rgba(34,211,238,.30)",
        "glow-amber": "0 0 28px rgba(251,191,36,.30)",
        /* Inset depth */
        "inner-sm": "inset 0 1px 2px rgba(0,0,0,.3)",
        "inner-md": "inset 0 2px 6px rgba(0,0,0,.4)"
      },

      animation: {
        "fade-up": "fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) forwards",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.4,0,0.2,1) forwards",
        "slide-right": "slideRight 0.35s cubic-bezier(0.4,0,0.2,1) forwards",
        "slide-left": "slideLeft 0.35s cubic-bezier(0.4,0,0.2,1) forwards",
        shimmer: "shimmer 1.6s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "ping-slow": "ping 2.5s cubic-bezier(0,0,0.2,1) infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite"
      },

      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        shimmer: {
          from: { backgroundPosition: "-200% center" },
          to: { backgroundPosition: "200% center" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },

      spacing: {
        "4.5": "1.125rem",
        "18": "4.5rem",
        "22": "5.5rem",
        "72": "18rem",
        "88": "22rem"
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        "3xs": ["0.5rem", { lineHeight: "0.75rem" }]
      },

      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        snug: "-0.01em"
      }
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
