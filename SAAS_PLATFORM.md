 # TONMAG SaaS platform

## Implemented customer capabilities

- Email/password and Google authentication, password reset, sign-out, onboarding, persistent sessions, and protected portfolio routes.
- User preferences for country, phone/WhatsApp, and display currency.
- Persistent saved homes shared between search, property cards, details, and the portfolio.
- Portfolio overview, owned properties, build progress, notifications, and adviser availability.
- Server-initialized Paystack checkout with fixed server-side amounts, authenticated customer metadata, server verification, idempotent paid-state finalization, and downloadable receipts.
- Secure document vault with Firebase Storage uploads, download links, review status, file-size limits, and user-scoped security rules.
- Inspection scheduling for virtual, representative, and in-person visits.
- Construction milestone timeline, maintenance requests, agent messaging, account settings, and browser-persisted demo mode.
- Quiet-luxury motion system: staggered hero entrance, section reveals, map-pin arrival, card lift, panel transitions, and reduced-motion fallbacks.

## Production setup

1. Copy `example.env` to `.env.local`.
2. Create a Firebase project and enable Email/Password and Google providers under Authentication.
3. Add the public Firebase web configuration to `.env.local`.
4. Create a Firebase service account and store its compact JSON (or base64 JSON) in `FIREBASE_SERVICE_ACCOUNT_JSON`.
5. Deploy `firestore.rules` and `storage.rules` to the same Firebase project.
6. Add a Paystack **test** secret key as `PAYSTACK_SECRET_KEY` and set `NEXT_PUBLIC_APP_URL` to the deployed HTTPS origin.
7. Set `NEXT_PUBLIC_SAAS_DEMO_MODE=false` before production deployment.
8. Run `pnpm build`, deploy the Next.js app, then test Paystack with test credentials before switching to a live key.

## Important data model note

Customer-editable workspace data is stored under `users/{uid}/workspace/main`. Portfolio and transaction arrays are protected from client-side modification by Firestore rules; verified payments are finalized through Firebase Admin on the server. New production accounts start empty until an administrator assigns a property/payment plan.

## Structural boundary

This implementation uses the Firebase foundation already present in the repository so authentication, storage, and persistence work inside the current Next.js application. Migrating to the previously proposed Clerk + NestJS + Prisma + Postgres stack is a separate backend migration, not a visual or incremental feature change. Flutterwave and Stripe can be added behind the same server-side payment boundary; Paystack is the completed checkout provider in this version.

## Staff RBAC

The staff dashboard uses four composable roles: Super Administrator, Sales
Manager, Sales Representative, and Content & Property Manager. The canonical
role-to-permission matrix is `lib/rbac.ts`; UI visibility and every admin API
derive from the same permission names.

Private staff roles are stored in `staff/{firebaseAuthUid}`. Customer PII stays
in owner-scoped `users/{uid}` documents. Leads, sales, staff, properties,
content, settings, and activity logs are server-only Firestore collections and
must be accessed through `/api/admin/*` with a verified Firebase ID token.
Representative lead ownership is checked again after every direct document
lookup, so changing a URL or document ID cannot expose another representative's
lead.

### Safe migration and first Super Administrator

The migration is additive and defaults to dry-run mode:

```powershell
npm run rbac:migrate:dry
```

For the first applied migration, temporarily set these server-only values in
`.env.local`:

```dotenv
RBAC_BOOTSTRAP_SUPER_ADMIN_EMAIL=owner@example.com
RBAC_BOOTSTRAP_SUPER_ADMIN_PASSWORD=a-unique-temporary-password
```

Then run:

```powershell
npm run rbac:migrate
```

Remove both bootstrap values immediately afterward. Existing client records are
preserved. Legacy `agent` users migrate to Sales Representative; legacy
`admin` users are not promoted unless `RBAC_PROMOTE_LEGACY_ADMINS=true` is set
explicitly. The migration also copies legacy contact submissions into leads and
upserts the existing website property catalogue without deleting legacy
documents.



-------------------------------------------------------------------------------------------------------------------------
UPDATE  #1
-------------------------------------------------------------------------------------------------------------------------

Implemented the four-role RBAC system inside the existing Firebase/Next.js architecture.

### Core implementation

- Central permission matrix: lib/rbac.ts (lib/rbac.ts)
- Shared RBAC/data types: lib/admin-types.ts (lib/admin-types.ts)
- Role-aware responsive dashboard: components/admin-dashboard.tsx (components/admin-dashboard.tsx)
- Existing customer dashboard preserved and staff-aware: components/diaspora-dashboard.tsx (components/diaspora-dashboard.tsx)
- Server-side authentication, permission checks, activity logging: lib/firebase-admin.ts (lib/firebase-admin.ts)
- Protected APIs for staff, leads, properties, estates, content, reports, settings, and activity: app/api/admin (app/api/admin)
- Backend representative ownership checks: lib/lead-access.ts (lib/lead-access.ts)

Multiple roles receive the union of their permissions. Super Administrator privileges are only granted by explicitly assigning super_admin.

### Security

- Staff roles live in private staff/{uid} documents.
- Direct client access to staff, leads, sales, activity, settings, and administrative collections is denied.
- Every protected endpoint verifies the Firebase ID token, current account status, and required permission.
- Sales Representatives can query and modify only leads whose assignedTo equals their authenticated UID.
- Self-role changes, self-deactivation, and removal of the final Super Administrator are blocked.
- Sensitive mutations create activity-log records.
- Property price changes, financial reports, staff management, and settings remain Super Administrator-only.
- Customer notification persistence was moved behind a secured server endpoint.
- Payment initialization now requires the submitted email to match the authenticated account.

Prototype rules are in firestore.rules (firestore.rules) and storage.rules (storage.rules).

I've set up prototype Security Rules to keep the data in Firestore safe. They are designed to be secure for owner-scoped customer data, strict schemas, immutable privilege fields, and server-only RBAC collections. However, you should review and verify them before broadly sharing your app. If you'd like, I can help you harden these rules.

### Database migration

Created an additive, idempotent migration:

scripts/migrate-rbac.mjs (scripts/migrate-rbac.mjs)

It:

- Preserves all existing documents.
- Migrates legacy agents safely.
- Never promotes legacy administrators unless explicitly enabled.
- Migrates legacy enquiries into leads.
- Upserts the four existing website properties.
- Supports one-time Super Administrator bootstrapping.

Dry-run result:

- Auth users: 0
- Legacy staff: 0
- Enquiries requiring migration: 0
- Properties to upsert: 4
- Records changed: 0

Instructions are documented in SAAS_PLATFORM.md (SAAS_PLATFORM.md).

### Public website integration

Managed property and content changes now reach the public application through sanitized APIs:

- Published properties feed search, cards, saved homes, and detail pages.
- Published announcements, banners, and testimonials appear on the homepage.
- Existing static data remains the fallback if Firebase is unavailable.

### Verification

- TypeScript: passed
- RBAC tests: 7/7 passed
- Firestore Rules compile/dry-run: passed
- Production build: passed, 47 routes
- /dashboard: 200
- Public properties API: 200, four properties
- Unauthenticated admin APIs: 401
- Unauthenticated notification mutation: 401
- Invalid enquiry submission: 400
- git diff --check: passed aside from existing line-ending warnings

Tests are in tests/rbac.test.ts (tests/rbac.test.ts).

### Remaining external steps

1. Set temporary bootstrap credentials in .env.local, then run:

npm run rbac:migrate

2. Remove the bootstrap credentials immediately afterward.
3. Deploy the application and Firestore rules together.
4. Storage media uploads remain unavailable until Firebase Storage is initialized. New default buckets require Blaze billing according to Firebase’s Storage requirements.
5. ESLint could not run because the repository’s lint script references an ESLint executable that is not installed. Type-checking, tests, builds, rules validation, and HTTP smoke tests passed.

<!-- 


- Role: Super Administrator
- Employee ID: id_1
- Password: Tm!HrRHqPloGO1Yn_bjLYAc
- Email: superadmin@test.local -->