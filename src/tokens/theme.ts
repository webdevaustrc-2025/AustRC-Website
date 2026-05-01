/**
 * theme.ts — AustRC Design Token System
 *
 * Single source of truth for all color decisions.
 *
 * TWO USAGE PATTERNS:
 *
 * 1. Tailwind classes (zero JS, SSR-safe):
 *    <div className="bg-surface-card text-text-primary border-border-brand">
 *    Works because globals.css maps these tokens into Tailwind's --color-* namespace.
 *
 * 2. Inline style props (for rgba values, complex gradients):
 *    const t = useTokens();
 *    <div style={{ background: t.surfaceCard, color: t.textPrimary }}>
 *
 * ADDING A NEW TOKEN:
 *   1. Add it here in both dark + light objects (TypeScript will enforce this)
 *   2. Add the CSS var to globals.css :root / .dark blocks
 *   3. Add it to @theme inline block if you want a Tailwind class for it
 *   Done — all components that call useTokens() get it automatically.
 */

export type Theme = 'dark' | 'light';

export interface Tokens {
  // ── Page / Layout ────────────────────────────────────────────────────────────
  /** Root page background */
  pageBg:            string;
  /** Alternate section background (slightly lighter/darker than pageBg) */
  pageBgAlt:         string;

  // ── Surfaces ─────────────────────────────────────────────────────────────────
  /** Elevated card / panel surface */
  surfaceCard:       string;
  /** Card surface on hover */
  surfaceCardHover:  string;
  /** Modal / drawer scrim overlay */
  surfaceOverlay:    string;
  /** Navbar pill background */
  surfaceNavbar:     string;
  /** Navbar top gradient — full linear-gradient() string */
  surfaceNavbarGrad: string;
  /** Mobile drawer background */
  surfaceDrawer:     string;

  // ── Text ─────────────────────────────────────────────────────────────────────
  /** Headings, prominent labels */
  textPrimary:       string;
  /** Body text, descriptions */
  textSecondary:     string;
  /** Captions, timestamps, metadata */
  textMuted:         string;
  /** Slightly stronger than muted — sub-labels */
  textMutedMid:      string;
  /** Subtle labels, tag text */
  textMutedHigh:     string;
  /** Decorative separator dots */
  textDot:           string;

  // ── Borders ──────────────────────────────────────────────────────────────────
  /** Hairline dividers, near-invisible lines */
  borderSubtle:      string;
  /** Default card / container borders */
  borderDefault:     string;
  /** Interactive focus / hover borders (non-brand) */
  borderFocus:       string;
  /** Brand green border — default state */
  borderBrand:       string;
  /** Brand green border — hover state */
  borderBrandHover:  string;

  // ── Brand (constant across themes) ───────────────────────────────────────────
  brandGreen:        string;
  brandGreenDark:    string;
  brandGreenMid:     string;

  // ── Component-specific ───────────────────────────────────────────────────────
  // Timeline / Journey page
  nodeBg:            string;
  nodeBorder:        string;
  periodBadgeBg:     string;
  spineBg:           string;
  avatarBorder:      string;
  avatarBg:          string;
  statChipBg:        string;
  statChipBorder:    string;
}

const BRAND_GREEN      = '#2ECC71';
const BRAND_DARK       = '#27AE60';
const BRAND_MID        = '#3DED97';
// Light-mode variants — darker so they're readable on white/slate backgrounds
const BRAND_GREEN_LIGHT = '#16a34a';
const BRAND_DARK_LIGHT  = '#15803d';
const BRAND_MID_LIGHT   = '#22c55e';

export const tokens: Record<Theme, Tokens> = {
  // ─────────────────────────────────────────────────────────────────────────────
  // DARK
  // ─────────────────────────────────────────────────────────────────────────────
  dark: {
    pageBg:            '#000000',
    pageBgAlt:         '#0a0a0a',

    surfaceCard:       'rgba(255,255,255,0.025)',
    surfaceCardHover:  '#111111',
    surfaceOverlay:    'rgba(0,0,0,0.6)',
    surfaceNavbar:     'rgba(0,0,0,0.1)',
    surfaceNavbarGrad: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)',
    surfaceDrawer:     '#111111',

    textPrimary:       '#ffffff',
    textSecondary:     'rgba(255,255,255,0.48)',
    textMuted:         'rgba(255,255,255,0.22)',
    textMutedMid:      'rgba(255,255,255,0.32)',
    textMutedHigh:     'rgba(255,255,255,0.35)',
    textDot:           'rgba(255,255,255,0.18)',

    borderSubtle:      'rgba(255,255,255,0.05)',
    borderDefault:     'rgba(255,255,255,0.07)',
    borderFocus:       'rgba(255,255,255,0.12)',
    borderBrand:       'rgba(46,204,113,0.2)',
    borderBrandHover:  'rgba(46,204,113,0.55)',

    brandGreen:        BRAND_GREEN,
    brandGreenDark:    BRAND_DARK,
    brandGreenMid:     BRAND_MID,

    nodeBg:            '#000000',
    nodeBorder:        'rgba(46,204,113,0.22)',
    periodBadgeBg:     '#000000',
    spineBg:           'rgba(255,255,255,0.045)',
    avatarBorder:      '#000000',
    avatarBg:          '#0a0a0a',
    statChipBg:        'rgba(255,255,255,0.04)',
    statChipBorder:    'rgba(255,255,255,0.07)',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LIGHT
  // ─────────────────────────────────────────────────────────────────────────────
  light: {
    pageBg:            '#f1f5f9',
    pageBgAlt:         '#ffffff',

    surfaceCard:       'rgba(255,255,255,0.92)',
    surfaceCardHover:  '#ffffff',
    surfaceOverlay:    'rgba(15,23,42,0.5)',
    surfaceNavbar:     'rgba(255,255,255,0.75)',
    surfaceNavbarGrad: 'linear-gradient(to bottom, rgba(241,245,249,0.95), rgba(241,245,249,0.5), transparent)',
    surfaceDrawer:     '#ffffff',

    textPrimary:       '#0f172a',
    textSecondary:     '#475569',
    textMuted:         '#94a3b8',
    textMutedMid:      '#64748b',
    textMutedHigh:     '#475569',
    textDot:           '#cbd5e1',

    borderSubtle:      'rgba(0,0,0,0.06)',
    borderDefault:     'rgba(0,0,0,0.1)',
    borderFocus:       'rgba(0,0,0,0.15)',
    borderBrand:       'rgba(22,163,74,0.5)',
    borderBrandHover:  'rgba(22,163,74,0.9)',

    brandGreen:        BRAND_GREEN_LIGHT,
    brandGreenDark:    BRAND_DARK_LIGHT,
    brandGreenMid:     BRAND_MID_LIGHT,

    nodeBg:            '#f0fdf4',
    nodeBorder:        'rgba(46,204,113,0.5)',
    periodBadgeBg:     '#f0fdf4',
    spineBg:           'rgba(46,204,113,0.35)',
    avatarBorder:      '#d1fae5',
    avatarBg:          '#f0fdf4',
    statChipBg:        'rgba(255,255,255,0.8)',
    statChipBorder:    'rgba(46,204,113,0.3)',
  },
};
