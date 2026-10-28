# Changelog

All notable changes to the MGS Jewellerys Commerce & Management platform are documented in this file.

## [1.2.0] - 2026-10-28

### Added
- **Social & SEO Optimization**: Added Schema.org structured data (`JewelryStore`, `CollectionPage`, `OfferCatalog`, `AboutPage`, `WebApplication`), OpenGraph rich meta tags, and Twitter Cards across all storefront pages.
- **A11y & Navigation Enhancements**: Added comprehensive ARIA landmarks, roles, `aria-live` regions for live search results, and accessible menu controls.
- **Interactive UI Utilities**: Added luxury floating back-to-top button with smooth scrolling and lightweight toast notification feedback (`window.showToast`).
- **Security Headers**: Integrated HTTP protection headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`) and disabled default `x-powered-by`.
- **Healthcheck & Observability**: Added `/api/health` diagnostic endpoint and request execution timing logging middleware.
- **Product Validation**: Added `validateProduct` middleware guarding against invalid payload types and malformed prices.
- **PWA & Offline Capabilities**: Added `manifest.json` and `sw.js` (Service Worker) with smart caching strategies for instantaneous load times.
- **Admin Portal Extensions**: Added 404 fallback routing (`NotFound.jsx`), React `ErrorBoundary.jsx`, instant product search bar, and clipboard helper utility.
- **Database Tooling**: Added `server/scripts/verifyDb.js` for automated schema integrity verification and `server/scripts/exportBackup.js` for timestamped data snapshots.
- **CI/CD Automation**: Added GitHub Actions workflow `.github/workflows/ci.yml` verifying builds and test integrity on commit.
- **API Documentation**: Added detailed OpenAPI 3.0 specification in `docs/openapi.yaml`.

---

## [1.1.0] - Earlier Releases
- Integrated React 18 Admin CMS into unified Express server.
- Added live gold and silver ticker rate updating.
- Added 129+ handcrafted jewelry catalog items with BIS hallmark tags.
