# Where to Start – Billing Integration

You have all backend endpoints in Postman. Use this order on the frontend.

---

## Step 1 – API layer (done)

**File:** `src/services/billingService.js`

- Uses your existing `api.js` (same base URL and auth).
- Wraps every billing endpoint from the doc in a function and returns `{ success, data, error }`.
- **Backend paths assumed:** `/billing/config`, `/billing/plans`, `/billing/subscription`, `/billing/checkout`, `/billing/portal`, `/billing/setup-intent`, `/billing/payment-methods`, `/billing/invoices`.

If your Postman paths differ (e.g. `/billing/checkout-session` instead of `/billing/checkout`), change the path in the corresponding function in `billingService.js` so it matches the backend.

---

## Step 2 – Match paths to Postman ✅ Verified

Your Postman Billing collection has been checked against `billingService.js`:

| Postman request              | Method | Path                          | billingService.js        | Body/query              |
|-----------------------------|--------|-------------------------------|--------------------------|-------------------------|
| Get Billing Config          | GET    | `/api/v1/billing/config`      | `getConfig()`            | —                       |
| Get Plans                   | GET    | `/api/v1/billing/plans`       | `getPlans()`             | —                       |
| Get Subscription Status     | GET    | `/api/v1/billing/subscription` | `getSubscription()`    | —                       |
| Create Subscription         | POST   | `/api/v1/billing/subscription` | `createSubscription()`  | `plan_id`, `payment_method_id` |
| Update Subscription         | PUT    | `/api/v1/billing/subscription` | `updateSubscription()`  | `plan_id`               |
| Cancel Subscription         | DELETE | `/api/v1/billing/subscription` | `cancelSubscription()`   | `immediately`, `reason`  |
| Resume Subscription         | POST   | `/api/v1/billing/subscription/resume` | `resumeSubscription()` | —                |
| Create Checkout Session     | POST   | `/api/v1/billing/checkout`    | `createCheckoutSession()`| `plan_id`, `success_url`, `cancel_url` |
| Create Billing Portal Session| POST   | `/api/v1/billing/portal`      | `createBillingPortalSession()` | `return_url`    |
| Create Setup Intent         | POST   | `/api/v1/billing/setup-intent`| `createSetupIntent()`   | —                       |
| Get Payment Methods         | GET    | `/api/v1/billing/payment-methods` | `getPaymentMethods()` | —                 |
| Delete Payment Method       | DELETE | `/api/v1/billing/payment-methods` | `deletePaymentMethod()` | `payment_method_id` |
| Get Invoices                | GET    | `/api/v1/billing/invoices?limit=10` | `getInvoices(limit)` | `limit` query   |

**No path or body changes needed** – the service already matches your Postman collection. The Stripe Webhook endpoint is backend-only (Stripe → your server), so it is not in `billingService.js`.

---

## Step 3 – Install Stripe packages

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

Needed if you will use Stripe Checkout redirect, Billing Portal, or Stripe Elements (card form). If you only call your backend and redirect to URLs it returns, you can do Step 4 first and add Stripe packages when you add Stripe UI.

---

## Step 4 – Wire “Get Started” to checkout (pricing → Stripe)

1. **Where:** HomePage pricing section (or the page where you show plans).
2. **Flow:** User clicks “Get Started” on a paid plan → call `createCheckoutSession(planId, successUrl, cancelUrl)` → redirect to `data.checkout_url`.
3. **URLs:**  
   - `successUrl`: e.g. `window.location.origin + '/billing/success'`  
   - `cancelUrl`: e.g. `window.location.origin + '/billing/cancel'`
4. **Plan id:** Use the backend plan id (same as in Postman). If you still show plans from `pricingPlans.json`, map your plan id (e.g. `starter` / `plus` / `pro`) to the backend plan id before calling `createCheckoutSession`.

Add two routes (Step 5) so those URLs exist.

---

## Step 5 – Success and cancel routes

1. In `App.jsx`, add two routes, e.g.:
   - `/billing/success` → simple “Payment successful” page (and optional “Back to dashboard”).
   - `/billing/cancel` → “Checkout canceled” page (and “Back to pricing”).
2. Keep these URLs in sync with the `successUrl` and `cancelUrl` you pass in Step 4.

---

## Step 6 – Stripe provider (optional for redirect-only)

If you only redirect to Stripe Checkout / Billing Portal, you don’t need Stripe.js on the frontend yet. If you will use Stripe Elements (card input on your site), add:

1. A context that loads Stripe using `getConfig().data.publishable_key` and wraps the app with `<Elements>`.
2. Wrap your app (e.g. in `App.jsx`) with that provider.

You can add this when you implement “Add payment method” or an embedded card form.

---

## Step 7 – Settings → Billing tab

1. In the Billing tab of Settings, call `getSubscription()`.
2. If `data.has_subscription`, show current plan, status, period end, and actions:
   - “Manage billing” → `createBillingPortalSession(returnUrl)` → redirect to `data.portal_url`.
   - Optional: “Cancel subscription” → `cancelSubscription(immediately, reason)`.
3. If no subscription, show “View plans” linking to pricing (or home #pricing).

You can later add payment methods and invoices here by calling `getPaymentMethods()` and `getInvoices()` and rendering the result.

---

## Order summary

| Order | Step | What |
|-------|------|------|
| 1 | Done | `billingService.js` – all endpoints in one place using `api.js`. |
| 2 | You | Align paths/payloads in `billingService.js` with Postman. |
| 3 | You | `npm install` Stripe packages (when you need Checkout/Portal/Elements). |
| 4 | You | “Get Started” on pricing → `createCheckoutSession` → redirect. |
| 5 | You | Add `/billing/success` and `/billing/cancel` routes. |
| 6 | Optional | Stripe provider + Elements (only if you need card form on your site). |
| 7 | You | Settings Billing tab: subscription + “Manage billing” (portal). |

Start by checking Step 2 (paths and payloads in `billingService.js` against Postman), then do Step 4 and 5 so users can subscribe and land on success/cancel pages.
