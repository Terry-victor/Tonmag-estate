.# Real estate UI refresh

- `app/globals.css` — replaced the previous multicolour theme with the navy, ivory, white, and muted-gold design tokens; added accessible focus, reduced-motion, and map-surface styles.
- `app/layout.tsx` — applied Cormorant Garamond display typography and Manrope body typography globally.
- `components/header.tsx` — rebuilt the navigation treatment, mobile menu, portfolio entry point, theme control, and inspection CTA with 48px touch targets.
- `components/hero.tsx` — introduced the editorial photography-led hero and consolidated location/type/price search bar.
- `components/property-card.tsx` and `lib/properties.ts` — added reusable cards with dual currencies, named title checks, permit references, ribbon badges, property facts, and direct save controls.
- `components/projects-showcase.tsx`, `components/statistics-showcase.tsx`, `components/services-section.tsx`, and `components/estate-features.tsx` — reframed the home-page sections around the diaspora ownership pipeline, valuation, local verification, inspections, management, and quiet-luxury presentation.
- `app/search/page.tsx` and `components/search-experience.tsx` — added the previously linked but missing search route with 15 filter controls, instant result/map updates, price pins, filter chips, and a mobile bottom-sheet filter panel.
- `app/projects/page.tsx` and `components/carousel-projects.tsx` — restyled the existing portfolio route and replaced non-existent project imagery with the shared verified-property cards.
- `app/view-project/[id]/page.tsx` — expanded the detail experience into an immersive property dossier with a cinematic gallery, keyboard-accessible captioned tour, property-specific story and specifications, named verification evidence, live deposit/payment scenarios, acquisition-cost breakdown, neighbourhood travel context, ownership timeline, related homes, and responsive inspection actions.
- `lib/properties.ts` — enriched each property with its own description, title type, completion date, parking, service charge, amenities, architectural highlights, and nearby destinations.
- `app/dashboard/page.tsx` and `components/diaspora-dashboard.tsx` — added the requested portfolio workspace for properties, transactions, documents, inspections, construction, maintenance, and agent communication; sections become accordions on mobile.
- `components/footer.tsx` and `components/whatsapp-button.tsx` — aligned global contact surfaces to the single-accent system and clarified the agent CTA.
- `components/template-selector.tsx` — corrected the existing numeric ID typing exposed by full TypeScript validation.

No existing route, component name, Firebase setup, or data-fetching function was removed or renamed. `/search` completes an already-referenced route; `/dashboard` is additive because no dashboard route existed.

## Integration flags

- Search filtering, price pins, currency values, dashboard activity, and the AI estimate currently use the shared local presentation data in `lib/properties.ts`. Connecting them to Postgres/NestJS, live FX, Google Maps, or an estimation service would be a data/API change and was intentionally not invented as part of this visual refresh.
- The captioned-tour CTA now routes into the existing booking flow. Publishing an inline tour requires an actual captioned media asset or video provider response.

The subsequent authenticated SaaS implementation, secure payments, persistence, and setup requirements are documented in `SAAS_PLATFORM.md`.
