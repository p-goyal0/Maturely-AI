# BILLING_INTEGRATION.md – Feasibility in Our System

## Summary

**Yes, the Stripe billing integration described in BILLING_INTEGRATION.md is possible in our system**, but it depends on the backend exposing the required billing APIs. On the frontend we’d need new packages, a billing service, Stripe context, billing UI, and routes. Several details in the doc (TypeScript, axios, route names) would be adapted to our stack (JSX, existing `api.js`, current routing).

---

## 1. Backend dependency (critical)

The doc assumes a backend that:

- Serves **`/api/v1/billing/*`** endpoints:
  - `GET /billing/config` – publishable key, `billing_enabled`
  - `GET /billing/plans` – list of plans (Stripe price IDs, etc.)
  - `GET /billing/subscription` – current subscription
  - `POST /billing/subscription` – create
  - `PUT /billing/subscription` – change plan
  - `DELETE /billing/subscription` – cancel
  - `POST /billing/subscription/resume`
  - `POST /billing/checkout` – create Checkout Session, return `checkout_url`
  - `POST /billing/portal` – create Billing Portal session
  - `POST /billing/setup-intent`
  - `GET /billing/payment-methods`, `DELETE /billing/payment-methods`
  - `GET /billing/invoices`
- Handles Stripe webhooks (e.g. `customer.subscription.*`, `invoice.*`, `checkout.session.completed`).

**If these endpoints and webhooks don’t exist**, the integration is not possible end-to-end until the backend implements them. The frontend can still be prepared so that once the backend is ready, we only plug in the API base URL and keys.

---

## 2. What already matches our system

| Doc requirement              | Our system                                                                 |
|-----------------------------|----------------------------------------------------------------------------|
| React 18+                   | Yes (Vite + React 18)                                                      |
| Node 18+                    | Yes (typical for Vite projects)                                           |
| API base URL                | `VITE_API_BASE_URL` / `http://localhost:8000/api/v1` in `api.js`         |
| Auth (Bearer token)         | `api.js` + `getAuthToken()` from `currentUser.token` (session/localStorage) |
| Billing-related user flag   | `currentUser.is_billing_admin` (authStore, PageHeader, RoleManagement)   |
| Settings “Billing” tab      | SettingsPage has Billing tab; settingsService has `getBillingInfo`, `updatePaymentMethod` |
| Pricing plans data          | We have `src/data/pricingPlans.json` (static); doc assumes API-driven plans |

So the **general architecture** (auth, API client, settings, billing admin concept) is compatible; the main gap is **billing-specific API and Stripe** on frontend and backend.

---

## 3. What we’d need to add or change

### 3.1 New dependencies

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

Doc also mentions `axios`; we already use our own `api.js` (fetch-based), so we should **not** add a separate axios-based client for billing. All billing calls should go through `api.js` so auth and error handling stay consistent.

### 3.2 New / modified frontend pieces

| Piece | Doc | Our adaptation |
|-------|-----|----------------|
| **Stripe context** | `StripeContext.tsx` (TypeScript) | Add `StripeContext.jsx` – same logic, no types; use existing `api` for `getConfig()` (see below). |
| **Billing API service** | `billingService.ts` (axios) | Add `billingService.js` – same endpoints and response shapes, but **use `api` from `api.js`** (get/post/put/delete) so token and base URL are shared. |
| **App root** | Wrap app with `<StripeProvider>` | In `App.jsx`, wrap `<BrowserRouter>` (or the whole app) with `<StripeProvider>`. |
| **Pricing / checkout** | Dedicated `PricingPage` with API plans + Stripe Checkout | Either: (A) New route e.g. `/pricing` or `/billing` for logged-in users that loads plans from API and “Get Started” → checkout, or (B) Keep HomePage pricing as-is and, when user picks a paid plan, call billing service and redirect to `checkout_url`. Both are possible. |
| **Subscription management** | `SubscriptionManager` component | Use inside **Settings → Billing tab**: current plan, cancel/resume, link to Stripe Billing Portal, and optionally payment methods / invoices if backend exposes them. |
| **Payment form / Add payment method** | `PaymentForm`, `AddPaymentMethod` (Stripe Elements) | Use only if we offer in-app card collection (e.g. “Add payment method” in Settings). If we rely on Stripe Checkout + Portal only, we can defer or skip these. |
| **Success / cancel URLs** | Redirect after Stripe Checkout | Add routes, e.g. `/billing/success` and `/billing/cancel`, and pass them into `createCheckoutSession(successUrl, cancelUrl)`. |

### 3.3 API client: use existing `api.js`

- **Do not** introduce a separate axios instance for billing.
- Implement `billingService.js` with:
  - `getConfig()` → `api.get('/billing/config')` and use `response.data.data` (or whatever shape the backend returns).
  - Same for plans, subscription, checkout, portal, setup-intent, payment-methods, invoices.
- So: **“API Service” in the doc is possible, but implemented with our existing `api` + a new `billingService.js`**, not with the doc’s axios snippet.

### 3.4 TypeScript vs JavaScript

- Doc uses `.ts` / `.tsx` and types. We use `.js` / `.jsx`.
- **Change:** Implement the same logic in `.jsx` / `.js` (no type annotations). Optional: add JSDoc or a separate `billingTypes.js` for clarity.

### 3.5 Environment variables

- **Frontend:** Doc uses `VITE_STRIPE_PUBLISHABLE_KEY` as optional; we can keep it optional and prefer fetching from `GET /billing/config` so one backend controls keys.
- **Backend:** Doc assumes `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`. No change on our side except to document that backend must set these.

### 3.6 Settings “Billing” tab vs doc

- We already have:
  - `getBillingInfo` → `GET /settings/billing`
  - `updatePaymentMethod` → `PUT /settings/billing/payment`
- Doc uses:
  - `GET /billing/subscription`, `GET /billing/payment-methods`, `GET /billing/invoices`, and Stripe Portal for managing payment methods and invoices.
- **Options:**
  1. **If backend adds `/billing/*`:** Use billing service for subscription + payment methods + invoices in the Billing tab; keep or deprecate `getBillingInfo` / `updatePaymentMethod` depending on backend design.
  2. **If backend keeps only `/settings/billing`:** We can still add Stripe Provider and Checkout (redirect) for “Get Started” from pricing; subscription management in Settings would stay limited to what `/settings/billing` returns until backend adds more.

So: **the doc’s “Subscription Management” is possible in our system if we have the `/billing/*` APIs; otherwise we can do checkout only and keep current Settings Billing as-is.**

---

## 4. What can be reused as-is (conceptually)

- **Flows:** Checkout redirect, optional custom payment form, optional setup intent for saving cards – all fit our app.
- **Webhooks:** Described as backend-only; we don’t need to change our frontend for that.
- **Error handling:** Doc’s Stripe error codes (e.g. `card_declined`) can be handled in our existing error handling (e.g. in `api.js` or billing UI) with the same user-facing messages.
- **Testing:** Stripe test cards and (if needed) Stripe CLI for webhooks – unchanged.

---

## 5. Minimal path to “possible in our system”

1. **Backend:** Implement (or confirm) `/api/v1/billing/*` and Stripe webhook handler.
2. **Frontend:**
   - Install `@stripe/stripe-js` and `@stripe/react-stripe-js`.
   - Add `billingService.js` (using `api.js`) for all doc endpoints we need.
   - Add `StripeContext.jsx` that uses `billingService.getConfig()` and `loadStripe(publishable_key)`.
   - Wrap app with `StripeProvider` in `App.jsx`.
   - Add routes `/billing/success` and `/billing/cancel` (simple success/cancel pages).
   - From pricing (HomePage or a dedicated page), “Get Started” for a paid plan → `createCheckoutSession` → redirect to `checkout_url`.
   - In Settings → Billing tab, add subscription summary + “Manage billing” (Stripe Portal) using `createBillingPortalSession`; optionally list payment methods and invoices if backend supports it.
3. **Optional later:** PaymentForm / AddPaymentMethod (Stripe Elements) if we want in-app card collection; otherwise rely on Checkout + Portal.

---

## 6. Conclusion

| Question | Answer |
|----------|--------|
| Is the integration **possible** in our system? | **Yes**, provided the backend exposes the billing APIs and webhooks described in the doc. |
| Main **blocker**? | Backend: `/api/v1/billing/*` and Stripe webhook handling. |
| Main **frontend changes**? | New packages (Stripe), `billingService.js` (using `api.js`), `StripeContext.jsx`, `StripeProvider` in App, billing/success/cancel routes, wire pricing CTA to checkout, extend Settings Billing tab with subscription + portal (and optionally payment methods/invoices). |
| What to **change** from the doc? | Use **JS/JSX** instead of TS/TSX; use **existing `api.js`** instead of a separate axios client; align **Settings Billing** with `/billing/*` if backend provides it; keep **pricing plans** source flexible (static JSON today, API when backend is ready). |

If you want, next step can be a concrete checklist (file-by-file) for implementing the “minimal path” above in this repo.
