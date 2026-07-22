# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-07-22
- Primary product surfaces: public landing, authentication, dashboard, instrument search/detail, portfolio, personalized news
- Evidence reviewed: `src/app/page.tsx`, `src/app/globals.css`, `src/components`, `messages/*.json`, `src/app/icon.png`

## Brand
- Personality: calm, analytical, precise, trustworthy
- Trust signals: explicit data states, restrained color, clear scoring language, investment disclaimer
- Avoid: oversized marketing typography, decorative gradients, floating glass cards, fake testimonials, excessive glow, ambient blobs, meaningless counters

## Product goals
- Goals: communicate the portfolio-to-news-to-impact workflow quickly and lead users to account creation
- Non-goals: promise returns, predict prices, resemble a trading terminal, or exaggerate AI capabilities
- Success signals: users understand the product before scrolling and can identify the primary action without ambiguity

## Personas and jobs
- Primary personas: retail investors monitoring Korean and U.S. securities and ETFs
- User jobs: find a security, register it, review relevant news, understand direction and impact strength
- Key contexts of use: quick daily review on desktop and mobile, often under information overload

## Information architecture
- Primary navigation: brand, language, login, signup
- Core routes/screens: `/`, `/login`, `/signup`, `/dashboard`, `/instruments`, `/portfolio`
- Content hierarchy: value proposition → product preview → workflow/features → market coverage → signup CTA → disclaimer

## Design principles
- Lead with evidence: show a compact product-shaped preview instead of abstract AI decoration.
- Dense but breathable: preserve the 8/12/16 spacing rhythm and avoid oversized containers.
- Motion explains state: animate chart drawing, signal distribution, and content entrance only when it reinforces hierarchy.
- Trust over spectacle: use borders, typography, and controlled contrast before shadow or color.

## Visual language
- Color: existing emerald brand for actions and positive signals; red/blue only for market direction; slate neutrals for structure
- Typography: 14px base, compact labels, restrained 40–56px desktop hero maximum
- Spacing/layout rhythm: 8/12/16px component rhythm, 64–80px section rhythm
- Shape/radius/elevation: 8–16px radius, 1px borders, low-opacity directional shadow
- Motion: 220–700ms entrances; one-time chart and bar reveals; minimal status pulse; no parallax or looping decorative motion
- Imagery/iconography: product UI, logo, and Lucide line icons; no stock photography

## Components
- Existing components to reuse: `LocaleSwitcher`, `Button` patterns, brand tokens, logo
- New/changed components: compact landing market-intelligence preview and landing-specific motion utilities
- Variants and states: light/dark, mobile/desktop, reduced-motion
- Token/component ownership: global color/focus tokens remain in `src/app/globals.css`; landing composition remains route-local

## Accessibility
- Target standard: WCAG 2.2 AA where practical
- Keyboard/focus behavior: all navigation and CTAs retain visible focus rings
- Contrast/readability: direction is represented with icon, text, and color; secondary text remains readable in both themes
- Screen-reader semantics: preview is labelled as a product preview and decorative chart details are hidden where redundant
- Reduced motion and sensory considerations: `prefers-reduced-motion` disables non-essential animation and smooth behavior

## Responsive behavior
- Supported breakpoints/devices: 320px mobile through large desktop
- Layout adaptations: hero changes from two columns to one; metric rows wrap without horizontal scrolling
- Touch/hover differences: core meaning never depends on hover and hit targets remain at least 36px high

## Interaction states
- Loading: skeletons belong to authenticated data surfaces, not the static landing preview
- Empty: authenticated surfaces use existing status components
- Error: authenticated surfaces use existing recovery actions
- Success: concise inline confirmation
- Disabled: reduced contrast without removing labels
- Offline/slow network: static landing remains server-rendered and dependency-free

## Content voice
- Tone: factual, direct, calm
- Terminology: impact possibility, direction, score, article evidence, portfolio
- Microcopy rules: never describe analysis as a prediction or recommendation; keep CTA verbs concrete

## Implementation constraints
- Framework/styling system: Next.js App Router, React 19, Tailwind CSS 4, next-intl
- Design-token constraints: reuse current brand palette and focus behavior
- Performance constraints: no animation or UI dependency; prefer CSS/SVG; keep landing server-rendered
- Compatibility constraints: Cloudflare OpenNext deployment and four locales
- Test/screenshot expectations: lint, typecheck, Vitest, Cloudflare production build, production smoke

## Open questions
- [ ] Replace the workers.dev URL with a branded custom domain when one is available.
