/**
 * Theme Test Page
 * 
 * A comprehensive test page for verifying Tailwind V4 theme system,
 * responsive design, and dark mode functionality.
 * 
 * Features:
 * - Color system verification (Primary, Secondary, Neutral, Semantic)
 * - Responsive breakpoint testing
 * - Dark mode toggle
 * - Font selection
 * - Component examples
 * - Typography system
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ThemeToggleButton } from '../components/ThemeToggleButton';

// ============================================================================
// Reusable Components
// ============================================================================

interface ColorSwatchProps {
  shade: number;
  colorName: 'primary' | 'secondary' | 'neutral' | 'tertiary';
  label?: string;
}

function ColorSwatch({ shade, colorName, label }: ColorSwatchProps) {
  const colorMap: Record<string, Record<number, string>> = {
    primary: {
      50: 'bg-primary-50', 100: 'bg-primary-100', 200: 'bg-primary-200',
      300: 'bg-primary-300', 400: 'bg-primary-400', 500: 'bg-primary-500',
      600: 'bg-primary-600', 700: 'bg-primary-700', 800: 'bg-primary-800',
      900: 'bg-primary-900', 950: 'bg-primary-950',
    },
    secondary: {
      50: 'bg-secondary-50', 100: 'bg-secondary-100', 200: 'bg-secondary-200',
      300: 'bg-secondary-300', 400: 'bg-secondary-400', 500: 'bg-secondary-500',
      600: 'bg-secondary-600', 700: 'bg-secondary-700', 800: 'bg-secondary-800',
      900: 'bg-secondary-900', 950: 'bg-secondary-950',
    },
    neutral: {
      50: 'bg-neutral-50', 100: 'bg-neutral-100', 200: 'bg-neutral-200',
      300: 'bg-neutral-300', 400: 'bg-neutral-400', 500: 'bg-neutral-500',
      600: 'bg-neutral-600', 700: 'bg-neutral-700', 800: 'bg-neutral-800',
      900: 'bg-neutral-900', 950: 'bg-neutral-950',
    },
    tertiary: {
      50: 'bg-tertiary-50', 100: 'bg-tertiary-100', 200: 'bg-tertiary-200',
      300: 'bg-tertiary-300', 400: 'bg-tertiary-400', 500: 'bg-tertiary-500',
      600: 'bg-tertiary-600', 700: 'bg-tertiary-700', 800: 'bg-tertiary-800',
      900: 'bg-tertiary-900', 950: 'bg-tertiary-950',
    },
  };

  const bgClass = colorMap[colorName]?.[shade];
  const textClass =
    (colorName === 'primary' && shade <= 300) ||
    (colorName === 'secondary' && shade <= 300) ||
    (colorName === 'neutral' && shade <= 400)
      ? 'text-neutral-900 dark:text-neutral-50'
      : 'text-white';

  return (
    <div className={`${bgClass} ${textClass} p-4 md:p-5 rounded-xl text-center transition-all hover:scale-105 cursor-pointer shadow-sm hover:shadow-lg border border-black/5 dark:border-white/5`}>
      <div className="text-xs md:text-sm font-semibold">{label || shade}</div>
    </div>
  );
}

interface SemanticCardProps {
  type: 'success' | 'warning' | 'error' | 'info';
  description: string;
}

function SemanticCard({ type, description }: SemanticCardProps) {
  const config = {
    success: { bg: 'bg-success', icon: '✓', iconBg: 'bg-success-light dark:bg-success-dark' },
    warning: { bg: 'bg-warning', icon: '⚠', iconBg: 'bg-warning-light dark:bg-warning-dark' },
    error: { bg: 'bg-error', icon: '✕', iconBg: 'bg-error-light dark:bg-error-dark' },
    info: { bg: 'bg-info', icon: 'ℹ', iconBg: 'bg-info-light dark:bg-info-dark' },
  };

  const { bg, icon } = config[type];

  return (
    <div className={`${bg} text-white p-6 md:p-8 rounded-xl shadow-md transition-all hover:shadow-xl hover:scale-[1.02] border border-white/10 group`}>
      <div className="font-semibold capitalize text-lg md:text-xl flex items-center gap-3 mb-3">
        <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">{icon}</span>
        <span>{type}</span>
      </div>
      <div className="text-sm md:text-base opacity-90 leading-relaxed">{description}</div>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  description?: string;
  className?: string;
}

function Section({ title, children, description, className = '' }: SectionProps) {
  return (
    <section
      className={`bg-background-secondary dark:bg-background-tertiary 
      border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow
      p-6 sm:p-8 md:p-10 lg:p-12 
      space-y-8 ${className}`}
    >
      <header className="space-y-3 border-b border-border pb-6 mb-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm md:text-base text-foreground-secondary mt-2">
            {description}
          </p>
        )}
      </header>

      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
}


// ============================================================================
// Main Component
// ============================================================================

export default function TestThemePage() {
  const router = useRouter();
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const [selectedFont, setSelectedFont] = useState<'sans' | 'mono'>('sans');
  const [isClient, setIsClient] = useState(false);

  // Exclude from production builds
  useEffect(() => {
    setIsClient(true);
    
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
      router.replace('/');
      return;
    }
  }, [router]);

  // Don't render anything until client-side check is complete
  if (!isClient || process.env.NODE_ENV === 'production') {
    return null;
  }

  const colorShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  const fontClasses = {
    sans: 'font-sans',
    mono: 'font-mono',
    serif: 'font-serif',
  display: 'font-display',
  };

  return (
    <div className={`min-h-screen bg-background transition-colors ${fontClasses[selectedFont]}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-secondary dark:bg-background-tertiary border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                Theme System Test
              </h1>
              <p className="text-sm md:text-base text-foreground-secondary mt-1">
                Comprehensive theme verification and responsive design testing
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {/* Font Selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-foreground-secondary">Font:</label>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value as 'sans' | 'mono')}
                  className="px-3 py-1.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-background-secondary"
                >
                  <option value="sans">Sans</option>
                  <option value="mono">Mono</option>
                  <option value="serif">Serif</option>
                  <option value="display">Display</option>
                </select>
              </div>
              
              {/* Theme Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground-secondary">
                  {currentTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </span>
                <ThemeToggleButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
        <div className="space-y-16 md:space-y-20 lg:space-y-24">
        {/* Color Scales */}
        <Section 
          title="Color Scales" 
          description="Primary, Secondary, and Neutral color palettes with all shades"
        >
          <div className="space-y-10">
            {/* Primary Colors */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-foreground">Primary Colors (Blue)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
                  {colorShades.map((shade) => (
                    <ColorSwatch key={shade} shade={shade} colorName="primary" />
                  ))}
                </div>
              </div>

            {/* Secondary Colors */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-foreground">Secondary Colors (Purple)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
                  {colorShades.map((shade) => (
                    <ColorSwatch key={shade} shade={shade} colorName="secondary" />
                  ))}
                </div>
              </div>

            {/* Tertiary Colors */}      
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-foreground">Neutral Colors (Gray)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
                  {colorShades.map((shade) => (
                    <ColorSwatch key={shade} shade={shade} colorName="tertiary" />
                  ))}
                </div>
              </div>
              
              {/* Neutral Colors */}
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold text-foreground">Neutral Colors (Gray)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
                    {colorShades.map((shade) => (
                      <ColorSwatch key={shade} shade={shade} colorName="neutral" />
                    ))}
                  </div>
                </div>
            </div>
          </Section>

          {/* Semantic Colors */}
          <Section 
            title="Semantic Colors" 
            description="Colors for specific use cases and states"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SemanticCard 
                type="success" 
                description="Use for positive actions, confirmations, and successful operations" 
              />
              <SemanticCard 
                type="warning" 
                description="Use for cautions, warnings, and important notices" 
              />
              <SemanticCard 
                type="error" 
                description="Use for errors, failures, and destructive actions" 
              />
              <SemanticCard 
                type="info" 
                description="Use for informational messages and helpful tips" 
              />
            </div>
          </Section>

          {/* Responsive Design */}
          <Section 
            title="Responsive Design" 
            description="Test how components adapt to different screen sizes"
          >
            <div className="space-y-6">
              {/* Responsive Typography */}
              <div className="p-4 bg-background rounded-lg border border-border">
                <h3 className="text-sm font-medium text-foreground-secondary mb-3">Responsive Typography</h3>
                <p className="text-sm md:text-base lg:text-lg xl:text-xl text-foreground">
                  This text scales: sm (14px) → base (16px) → lg (18px) → xl (20px)
                </p>
              </div>

              {/* Responsive Grid */}
              <div className="p-4 bg-background rounded-lg border border-border">
                <h3 className="text-sm font-medium text-foreground-secondary mb-3">Responsive Grid</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className="bg-primary-100 dark:bg-primary-900 p-4 rounded-lg border border-primary-200 dark:border-primary-800 transition-all hover:shadow-lg"
                    >
                      <div className="font-semibold text-foreground">Card {num}</div>
                      <div className="text-sm text-foreground-secondary mt-2">
                        1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Responsive Spacing */}
              <div className="p-4 bg-background rounded-lg border border-border">
                <h3 className="text-sm font-medium text-foreground-secondary mb-3">Responsive Spacing</h3>
                <div className="bg-primary-50 dark:bg-primary-950 p-2 sm:p-4 md:p-6 lg:p-8 rounded-lg border border-primary-200 dark:border-primary-800">
                  <p className="text-foreground text-sm">
                    Padding adapts: p-2 (mobile) → p-4 (sm) → p-6 (md) → p-8 (lg)
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Typography System */}
          <Section 
            title="Typography System" 
            description="Font sizes, weights, and text colors"
          >
            <div className="space-y-4 p-4 bg-background rounded-lg border border-border">
              <h1 className="text-4xl font-bold text-foreground">Heading 1 - Bold</h1>
              <h2 className="text-3xl font-semibold text-foreground">Heading 2 - Semibold</h2>
              <h3 className="text-2xl font-medium text-foreground">Heading 3 - Medium</h3>
              <p className="text-base text-foreground-secondary leading-relaxed">
                Body text with normal weight. This is what regular paragraph text looks like in your application.
                It uses the secondary foreground color for better readability.
              </p>
              <p className="text-sm text-foreground-tertiary">
                Small text or captions use tertiary color for less emphasis.
              </p>
              <code className="block bg-neutral-100 dark:bg-neutral-900 p-3 rounded text-sm font-mono text-foreground border border-border">
                const example = "Monospace font for code";
              </code>
            </div>
          </Section>

          {/* Interactive Components */}
          <Section 
            title="Interactive Components" 
            description="Form elements and UI components"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Elements */}
              <div className="p-6 bg-background rounded-lg border border-border space-y-4">
                <h3 className="font-semibold text-foreground text-lg">Form Elements</h3>
                <input 
                  type="text" 
                  placeholder="Text input"
                  className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <select className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all">
                  <option>Select option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
                <textarea 
                  placeholder="Text area"
                  className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all"
                  rows={3}
                />
              </div>

              {/* Buttons */}
              <div className="p-6 bg-background rounded-lg border border-border space-y-4">
                <h3 className="font-semibold text-foreground text-lg">Button Variants</h3>
                <div className="space-y-3">
                  <button className="w-full bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm hover:shadow-md dark:bg-primary-200 dark:hover:bg-primary-100">
                    Primary Button
                  </button>
                  <button className="w-full bg-secondary-600 hover:bg-secondary-500 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm hover:shadow-md dark:bg-secondary-200 dark:hover:bg-secondary-100">
                    Secondary Button
                  </button>
                  <button className="w-full bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm hover:shadow-md">
                    Neutral Button
                  </button>
                  <button className="w-full bg-neutral-500 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed font-medium">
                    Disabled Button
                  </button>
                </div>
              </div>
            </div>
          </Section>

          {/* Breakpoint Indicator */}
          <Section 
            title="Current Breakpoint" 
            description="Visual indicator of the current responsive breakpoint"
          >
            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="block sm:hidden px-4 py-2 bg-primary-500 text-white rounded-lg font-medium shadow-sm">
                  📱 Mobile (&lt;640px)
                </span>
                <span className="hidden sm:block md:hidden px-4 py-2 bg-primary-500 text-white rounded-lg font-medium shadow-sm">
                  📱 SM (≥640px)
                </span>
                <span className="hidden md:block lg:hidden px-4 py-2 bg-primary-500 text-white rounded-lg font-medium shadow-sm">
                  💻 MD (≥768px)
                </span>
                <span className="hidden lg:block xl:hidden px-4 py-2 bg-primary-500 text-white rounded-lg font-medium shadow-sm">
                  💻 LG (≥1024px)
                </span>
                <span className="hidden xl:block 2xl:hidden px-4 py-2 bg-primary-500 text-white rounded-lg font-medium shadow-sm">
                  🖥️ XL (≥1280px)
                </span>
                <span className="hidden 2xl:block px-4 py-2 bg-primary-500 text-white rounded-lg font-medium shadow-sm">
                  🖥️ 2XL (≥1536px)
                </span>
              </div>
            </div>
          </Section>

          {/* Theme Configuration */}
          <Section 
            title="Theme Configuration" 
            description="Current theme settings and configuration"
          >
            <div className="p-4 md:p-6 bg-background rounded-lg border border-border">
              <pre className="text-xs md:text-sm overflow-x-auto text-foreground-secondary font-mono">
                {JSON.stringify(
                  {
                    darkMode: currentTheme === 'dark',
                    font: selectedFont,
                    note: 'Theme colors are defined in CSS custom properties',
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </Section>
        </div>
        {/* Footer */}
        <footer className="text-center py-8 border-t border-border mt-12">
          <p className="text-sm text-foreground-secondary">
            Theme test page • All colors and components are reusable • Dark mode: {currentTheme === 'dark' ? 'Active' : 'Inactive'} • Font: {selectedFont}
          </p>
        </footer>
      </main>
    </div>
  );
}
