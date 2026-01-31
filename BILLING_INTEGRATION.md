# Maturely AI - Stripe Billing Integration Guide

## Overview

This guide provides comprehensive instructions for integrating Stripe billing into your React frontend application for the Maturely AI platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Setup](#environment-setup)
4. [Stripe Context Provider](#stripe-context-provider)
5. [API Service](#api-service)
6. [Components](#components)
7. [Integration Flows](#integration-flows)
8. [Webhook Handling](#webhook-handling)
9. [Error Handling](#error-handling)
10. [Testing](#testing)

---

## Prerequisites

- React 18+
- Node.js 18+
- Stripe Account (Test mode for development)
- Backend API running with Stripe keys configured

## Installation

Install required packages:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js axios
# or
yarn add @stripe/stripe-js @stripe/react-stripe-js axios
```

---

## Environment Setup

### Frontend Environment Variables

Create or update your `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Stripe (optional - can be fetched from API)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Backend Environment Variables

Ensure your backend has these configured:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # For production
```

---

## Stripe Context Provider

### `src/contexts/StripeContext.tsx`

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { billingService } from '../services/billingService';

interface StripeContextType {
  stripe: Stripe | null;
  isLoading: boolean;
  error: string | null;
  billingEnabled: boolean;
}

const StripeContext = createContext<StripeContextType>({
  stripe: null,
  isLoading: true,
  error: null,
  billingEnabled: false,
});

export const useStripe = () => useContext(StripeContext);

interface StripeProviderProps {
  children: React.ReactNode;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingEnabled, setBillingEnabled] = useState(false);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // Fetch publishable key from backend
        const config = await billingService.getConfig();
        
        if (!config.billing_enabled || !config.publishable_key) {
          setBillingEnabled(false);
          setIsLoading(false);
          return;
        }

        setBillingEnabled(true);
        const stripeInstance = await loadStripe(config.publishable_key);
        setStripe(stripeInstance);
      } catch (err) {
        setError('Failed to initialize billing');
        console.error('Stripe initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeStripe();
  }, []);

  return (
    <StripeContext.Provider value={{ stripe, isLoading, error, billingEnabled }}>
      {stripe ? (
        <Elements stripe={stripe}>
          {children}
        </Elements>
      ) : (
        children
      )}
    </StripeContext.Provider>
  );
};
```

### Usage in App

```tsx
// src/App.tsx
import { StripeProvider } from './contexts/StripeContext';

function App() {
  return (
    <StripeProvider>
      <Router>
        {/* Your routes */}
      </Router>
    </StripeProvider>
  );
}
```

---

## API Service

### `src/services/billingService.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface BillingConfig {
  publishable_key: string;
  billing_enabled: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  billing_interval: 'monthly' | 'yearly' | 'one_time';
  features: Record<string, any>;
  trial_days: number;
  is_popular: boolean;
  stripe_price_id: string;
}

export interface Subscription {
  has_subscription: boolean;
  subscription_id: string | null;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | null;
  plan: {
    id: string;
    name: string;
    price: number;
    billing_interval: string;
    features: Record<string, any>;
  } | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  trial_end: string | null;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

export interface Invoice {
  id: string;
  invoice_number: string | null;
  status: string;
  total: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  due_date: string | null;
  paid_at: string | null;
  hosted_invoice_url: string | null;
  invoice_pdf_url: string | null;
  created_at: string | null;
}

export interface CheckoutSession {
  checkout_url: string;
  session_id: string;
}

export interface SetupIntent {
  client_secret: string;
  setup_intent_id: string;
}

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  code: number;
  data: T;
  message: string;
}

export const billingService = {
  // Configuration (no auth required)
  async getConfig(): Promise<BillingConfig> {
    const response = await api.get<ApiResponse<BillingConfig>>('/billing/config');
    return response.data.data;
  },

  // Plans (no auth required)
  async getPlans(): Promise<Plan[]> {
    const response = await api.get<ApiResponse<Plan[]>>('/billing/plans');
    return response.data.data;
  },

  // Subscription
  async getSubscription(): Promise<Subscription> {
    const response = await api.get<ApiResponse<Subscription>>('/billing/subscription');
    return response.data.data;
  },

  async createSubscription(planId: string, paymentMethodId?: string): Promise<{
    subscription_id: string;
    stripe_subscription_id: string;
    status: string;
    client_secret: string | null;
  }> {
    const response = await api.post<ApiResponse<any>>('/billing/subscription', {
      plan_id: planId,
      payment_method_id: paymentMethodId,
    });
    return response.data.data;
  },

  async updateSubscription(planId: string): Promise<any> {
    const response = await api.put<ApiResponse<any>>('/billing/subscription', {
      plan_id: planId,
    });
    return response.data.data;
  },

  async cancelSubscription(immediately: boolean = false, reason?: string): Promise<any> {
    const response = await api.delete<ApiResponse<any>>('/billing/subscription', {
      data: { immediately, reason },
    });
    return response.data.data;
  },

  async resumeSubscription(): Promise<any> {
    const response = await api.post<ApiResponse<any>>('/billing/subscription/resume');
    return response.data.data;
  },

  // Checkout Session
  async createCheckoutSession(planId: string, successUrl: string, cancelUrl: string): Promise<CheckoutSession> {
    const response = await api.post<ApiResponse<CheckoutSession>>('/billing/checkout', {
      plan_id: planId,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return response.data.data;
  },

  // Billing Portal
  async createBillingPortalSession(returnUrl: string): Promise<{ portal_url: string }> {
    const response = await api.post<ApiResponse<{ portal_url: string }>>('/billing/portal', {
      return_url: returnUrl,
    });
    return response.data.data;
  },

  // Setup Intent (for saving payment methods)
  async createSetupIntent(): Promise<SetupIntent> {
    const response = await api.post<ApiResponse<SetupIntent>>('/billing/setup-intent');
    return response.data.data;
  },

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await api.get<ApiResponse<PaymentMethod[]>>('/billing/payment-methods');
    return response.data.data;
  },

  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    await api.delete('/billing/payment-methods', {
      data: { payment_method_id: paymentMethodId },
    });
  },

  // Invoices
  async getInvoices(limit: number = 10): Promise<Invoice[]> {
    const response = await api.get<ApiResponse<Invoice[]>>(`/billing/invoices?limit=${limit}`);
    return response.data.data;
  },
};
```

---

## Components

### Pricing Page Component

```tsx
// src/components/billing/PricingPage.tsx
import React, { useEffect, useState } from 'react';
import { billingService, Plan, Subscription } from '../../services/billingService';
import { useStripe } from '../../contexts/StripeContext';

export const PricingPage: React.FC = () => {
  const { billingEnabled, isLoading: stripeLoading } = useStripe();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansData, subData] = await Promise.all([
        billingService.getPlans(),
        billingService.getSubscription(),
      ]);
      setPlans(plansData);
      setSubscription(subData);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setCheckoutLoading(planId);
    try {
      const { checkout_url } = await billingService.createCheckoutSession(
        planId,
        `${window.location.origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        `${window.location.origin}/billing/cancel`
      );
      
      // Redirect to Stripe Checkout
      window.location.href = checkout_url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleChangePlan = async (newPlanId: string) => {
    if (!confirm('Are you sure you want to change your plan? Prorations will apply.')) {
      return;
    }

    setCheckoutLoading(newPlanId);
    try {
      await billingService.updateSubscription(newPlanId);
      await loadData(); // Refresh data
      alert('Plan updated successfully!');
    } catch (error) {
      console.error('Failed to update subscription:', error);
      alert('Failed to update plan. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading || stripeLoading) {
    return <div className="loading">Loading plans...</div>;
  }

  if (!billingEnabled) {
    return <div className="notice">Billing is not currently available.</div>;
  }

  return (
    <div className="pricing-page">
      <h1>Choose Your Plan</h1>
      
      {subscription?.has_subscription && (
        <div className="current-subscription">
          <h3>Current Plan: {subscription.plan?.name}</h3>
          <p>Status: {subscription.status}</p>
          {subscription.cancel_at_period_end && (
            <p className="warning">
              Scheduled to cancel on {new Date(subscription.current_period_end!).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      <div className="plans-grid">
        {plans.map((plan) => {
          const isCurrentPlan = subscription?.plan?.id === plan.id;
          const isPopular = plan.is_popular;

          return (
            <div 
              key={plan.id} 
              className={`plan-card ${isPopular ? 'popular' : ''} ${isCurrentPlan ? 'current' : ''}`}
            >
              {isPopular && <span className="badge">Most Popular</span>}
              
              <h2>{plan.name}</h2>
              <p className="description">{plan.description}</p>
              
              <div className="price">
                <span className="amount">${plan.price}</span>
                <span className="interval">/{plan.billing_interval}</span>
              </div>

              {plan.trial_days > 0 && (
                <p className="trial">{plan.trial_days}-day free trial</p>
              )}

              <ul className="features">
                {Object.entries(plan.features).map(([key, value]) => (
                  <li key={key}>
                    {typeof value === 'boolean' 
                      ? (value ? '✓' : '✗') 
                      : `${key.replace(/_/g, ' ')}: ${value}`
                    }
                  </li>
                ))}
              </ul>

              <button
                onClick={() => 
                  isCurrentPlan 
                    ? null 
                    : subscription?.has_subscription 
                      ? handleChangePlan(plan.id) 
                      : handleSubscribe(plan.id)
                }
                disabled={isCurrentPlan || checkoutLoading === plan.id}
                className={`btn ${isCurrentPlan ? 'btn-disabled' : 'btn-primary'}`}
              >
                {checkoutLoading === plan.id
                  ? 'Processing...'
                  : isCurrentPlan
                    ? 'Current Plan'
                    : subscription?.has_subscription
                      ? 'Switch to This Plan'
                      : 'Get Started'
                }
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

### Subscription Management Component

```tsx
// src/components/billing/SubscriptionManager.tsx
import React, { useEffect, useState } from 'react';
import { billingService, Subscription, PaymentMethod, Invoice } from '../../services/billingService';

export const SubscriptionManager: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subData, pmData, invData] = await Promise.all([
        billingService.getSubscription(),
        billingService.getPaymentMethods(),
        billingService.getInvoices(5),
      ]);
      setSubscription(subData);
      setPaymentMethods(pmData);
      setInvoices(invData);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    const immediately = confirm(
      'Cancel immediately? Click OK for immediate cancellation, Cancel for end of billing period.'
    );
    
    const reason = prompt('Please tell us why you are canceling (optional):');

    try {
      await billingService.cancelSubscription(immediately, reason || undefined);
      await loadData();
      alert('Subscription canceled successfully.');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('Failed to cancel subscription.');
    }
  };

  const handleResumeSubscription = async () => {
    try {
      await billingService.resumeSubscription();
      await loadData();
      alert('Subscription resumed successfully!');
    } catch (error) {
      console.error('Failed to resume subscription:', error);
      alert('Failed to resume subscription.');
    }
  };

  const handleOpenBillingPortal = async () => {
    try {
      const { portal_url } = await billingService.createBillingPortalSession(
        window.location.href
      );
      window.location.href = portal_url;
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      alert('Failed to open billing portal.');
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    if (!confirm('Are you sure you want to remove this payment method?')) return;

    try {
      await billingService.deletePaymentMethod(paymentMethodId);
      await loadData();
    } catch (error) {
      console.error('Failed to delete payment method:', error);
      alert('Failed to remove payment method.');
    }
  };

  if (loading) {
    return <div className="loading">Loading subscription details...</div>;
  }

  if (!subscription?.has_subscription) {
    return (
      <div className="no-subscription">
        <h2>No Active Subscription</h2>
        <p>Choose a plan to get started.</p>
        <a href="/pricing" className="btn btn-primary">View Plans</a>
      </div>
    );
  }

  return (
    <div className="subscription-manager">
      <h1>Subscription Management</h1>

      {/* Current Subscription */}
      <section className="section">
        <h2>Current Subscription</h2>
        <div className="subscription-details">
          <div className="detail-row">
            <span>Plan:</span>
            <span>{subscription.plan?.name}</span>
          </div>
          <div className="detail-row">
            <span>Status:</span>
            <span className={`status status-${subscription.status}`}>
              {subscription.status}
            </span>
          </div>
          <div className="detail-row">
            <span>Price:</span>
            <span>${subscription.plan?.price}/{subscription.plan?.billing_interval}</span>
          </div>
          <div className="detail-row">
            <span>Current Period:</span>
            <span>
              {subscription.current_period_start && new Date(subscription.current_period_start).toLocaleDateString()}
              {' - '}
              {subscription.current_period_end && new Date(subscription.current_period_end).toLocaleDateString()}
            </span>
          </div>
          {subscription.trial_end && (
            <div className="detail-row">
              <span>Trial Ends:</span>
              <span>{new Date(subscription.trial_end).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="actions">
          {subscription.cancel_at_period_end ? (
            <button onClick={handleResumeSubscription} className="btn btn-success">
              Resume Subscription
            </button>
          ) : (
            <button onClick={handleCancelSubscription} className="btn btn-danger">
              Cancel Subscription
            </button>
          )}
          <a href="/pricing" className="btn btn-secondary">Change Plan</a>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="section">
        <h2>Payment Methods</h2>
        {paymentMethods.length === 0 ? (
          <p>No payment methods saved.</p>
        ) : (
          <ul className="payment-methods-list">
            {paymentMethods.map((pm) => (
              <li key={pm.id} className="payment-method">
                <div className="card-info">
                  <span className="brand">{pm.brand.toUpperCase()}</span>
                  <span className="number">•••• {pm.last4}</span>
                  <span className="expiry">Expires {pm.exp_month}/{pm.exp_year}</span>
                </div>
                <button
                  onClick={() => handleDeletePaymentMethod(pm.id)}
                  className="btn btn-sm btn-danger"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <button onClick={handleOpenBillingPortal} className="btn btn-secondary">
          Manage Payment Methods
        </button>
      </section>

      {/* Invoices */}
      <section className="section">
        <h2>Recent Invoices</h2>
        {invoices.length === 0 ? (
          <p>No invoices yet.</p>
        ) : (
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoice_number || 'N/A'}</td>
                  <td>{invoice.created_at && new Date(invoice.created_at).toLocaleDateString()}</td>
                  <td>${invoice.total.toFixed(2)} {invoice.currency.toUpperCase()}</td>
                  <td className={`status status-${invoice.status}`}>{invoice.status}</td>
                  <td>
                    {invoice.hosted_invoice_url && (
                      <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    )}
                    {' '}
                    {invoice.invoice_pdf_url && (
                      <a href={invoice.invoice_pdf_url} target="_blank" rel="noopener noreferrer">
                        PDF
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={handleOpenBillingPortal} className="btn btn-secondary">
          View All Invoices
        </button>
      </section>
    </div>
  );
};
```

### Payment Form Component (for custom payment collection)

```tsx
// src/components/billing/PaymentForm.tsx
import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
import { billingService } from '../../services/billingService';

interface PaymentFormProps {
  planId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  planId,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment method
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (pmError) {
        throw new Error(pmError.message);
      }

      // Create subscription with payment method
      const result = await billingService.createSubscription(planId, paymentMethod.id);

      // If requires additional confirmation (3D Secure)
      if (result.client_secret) {
        const { error: confirmError } = await stripe.confirmCardPayment(result.client_secret);
        if (confirmError) {
          throw new Error(confirmError.message);
        }
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h3>Enter Payment Details</h3>
      
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!stripe || loading}
        >
          {loading ? 'Processing...' : 'Subscribe'}
        </button>
      </div>
    </form>
  );
};
```

### Add Payment Method Component

```tsx
// src/components/billing/AddPaymentMethod.tsx
import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
import { billingService } from '../../services/billingService';

interface AddPaymentMethodProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddPaymentMethod: React.FC<AddPaymentMethodProps> = ({
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get setup intent from backend
      const { client_secret } = await billingService.createSetupIntent();

      // Confirm setup with card details
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: setupError } = await stripe.confirmCardSetup(client_secret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (setupError) {
        throw new Error(setupError.message);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-payment-method-form">
      <h3>Add Payment Method</h3>
      
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!stripe || loading}
        >
          {loading ? 'Saving...' : 'Save Card'}
        </button>
      </div>
    </form>
  );
};
```

---

## Integration Flows

### Flow 1: New Subscription with Stripe Checkout (Recommended)

```
1. User clicks "Subscribe" on pricing page
2. Frontend calls POST /api/v1/billing/checkout with plan_id
3. Backend creates Stripe Checkout Session
4. Frontend redirects to checkout_url
5. User completes payment on Stripe's hosted page
6. Stripe redirects to success_url
7. Webhook updates subscription status in backend
```

```tsx
// Simple redirect flow
const handleSubscribe = async (planId: string) => {
  const { checkout_url } = await billingService.createCheckoutSession(
    planId,
    `${window.location.origin}/billing/success`,
    `${window.location.origin}/billing/cancel`
  );
  window.location.href = checkout_url;
};
```

### Flow 2: Custom Payment Form (for embedded experience)

```
1. User enters card details in your form
2. Frontend creates PaymentMethod with Stripe.js
3. Frontend calls POST /api/v1/billing/subscription with payment_method_id
4. Backend creates subscription, returns client_secret if 3DS required
5. Frontend confirms payment if needed
6. Subscription is active
```

### Flow 3: Saving Payment Method for Later

```
1. Frontend calls POST /api/v1/billing/setup-intent
2. Backend returns client_secret
3. User enters card in form
4. Frontend confirms setup with Stripe.js
5. Card is saved to customer for future charges
```

---

## Webhook Handling

The backend handles these Stripe webhook events automatically:

| Event | Action |
|-------|--------|
| `customer.subscription.created` | Creates/updates local subscription |
| `customer.subscription.updated` | Updates subscription status |
| `customer.subscription.deleted` | Marks subscription as canceled |
| `customer.subscription.trial_will_end` | (Optional) Send notification |
| `invoice.paid` | Records payment, updates subscription |
| `invoice.payment_failed` | Updates subscription status |
| `checkout.session.completed` | Creates subscription from checkout |

### Webhook URL Configuration

In your Stripe Dashboard:
1. Go to Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/v1/billing/webhook/stripe`
3. Select events to listen for
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Error Handling

### Common Error Scenarios

```tsx
// src/utils/billingErrors.ts
export const handleBillingError = (error: any): string => {
  // Stripe errors
  if (error.code) {
    switch (error.code) {
      case 'card_declined':
        return 'Your card was declined. Please try a different card.';
      case 'expired_card':
        return 'Your card has expired. Please update your payment method.';
      case 'incorrect_cvc':
        return 'Incorrect security code. Please check and try again.';
      case 'processing_error':
        return 'An error occurred while processing. Please try again.';
      case 'insufficient_funds':
        return 'Insufficient funds. Please try a different card.';
      default:
        return error.message || 'Payment failed. Please try again.';
    }
  }

  // API errors
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  return 'An unexpected error occurred. Please try again.';
};
```

---

## Testing

### Test Card Numbers

| Card | Number | Description |
|------|--------|-------------|
| Success | 4242 4242 4242 4242 | Always succeeds |
| Decline | 4000 0000 0000 0002 | Always declines |
| 3D Secure | 4000 0025 0000 3155 | Requires authentication |
| Insufficient Funds | 4000 0000 0000 9995 | Decline with insufficient funds |

Use any future expiry date and any 3-digit CVC.

### Testing Webhooks Locally

1. Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

2. Login and forward webhooks:
```bash
stripe login
stripe listen --forward-to localhost:8000/api/v1/billing/webhook/stripe
```

3. Copy the webhook signing secret and add to `.env`

4. Trigger test events:
```bash
stripe trigger checkout.session.completed
stripe trigger invoice.paid
```

---

## Best Practices

1. **Always use HTTPS** in production for Stripe.js
2. **Store sensitive data** (API keys) in environment variables
3. **Use Stripe Checkout** when possible for PCI compliance
4. **Handle webhook idempotency** - events may be sent multiple times
5. **Show clear error messages** to users
6. **Test thoroughly** with Stripe test mode before going live
7. **Monitor webhooks** in Stripe Dashboard for failures

---

## Support

For issues related to:
- **Stripe API**: Check [Stripe Documentation](https://stripe.com/docs)
- **Backend API**: Contact the backend team
- **Frontend Integration**: Review this guide or contact the frontend team

---

*Last updated: January 31, 2026*
