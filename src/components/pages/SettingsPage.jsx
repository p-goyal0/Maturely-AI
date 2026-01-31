import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  CreditCard,
  Globe,
  Sparkles,
  Save,
  Mail,
  Building,
  DollarSign,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PageHeader } from '../shared/PageHeader';
import {
  getPlans,
  getConfig,
  createCheckoutSession,
  getSubscription,
  getPaymentMethods,
  getInvoices,
  createBillingPortalSession,
} from '../../services/billingService';

/** Convert snake_case to Title Case for display */
function snakeToTitleCase(str) {
  if (!str || typeof str !== 'string') return str;
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/** Feature keys that are booleans (exclude nested objects like feature_tooltips) */
const FEATURE_BOOLEAN_KEYS = [
  'sso',
  'basic_report',
  'email_support',
  'export_to_pdf',
  'custom_roadmap',
  'trend_analysis',
  'priority_support',
  'single_assessment',
  'white_label_reports',
  'static_use_case_bank',
  'industry_benchmarking',
  'continuous_assessments',
  'custom_use_case_creation',
  'detailed_strategic_report',
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [orgName, setOrgName] = useState('MATURELY.AI Enterprise');
  const [orgEmail, setOrgEmail] = useState('contact@maturely.ai');
  const [timezone, setTimezone] = useState('UTC-5 (EST)');
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
  });
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState(null);
  const [isAnnualPricing, setIsAnnualPricing] = useState(false);
  const [planSelectionLoading, setPlanSelectionLoading] = useState(null);
  const [planSelectionError, setPlanSelectionError] = useState(null);

  // Post-checkout feedback: ?billing=success or ?billing=cancel
  const [searchParams, setSearchParams] = useSearchParams();
  const [billingBanner, setBillingBanner] = useState(null); // 'success' | 'cancel' | null

  // Billing tab: subscription, payment methods, invoices
  const [subscription, setSubscription] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);

  // On mount: read ?billing= and show banner, switch tab, clear URL
  useEffect(() => {
    const billing = searchParams.get('billing');
    if (billing === 'success') {
      setBillingBanner('success');
      setActiveTab('billing');
      setSearchParams({}, { replace: true });
    } else if (billing === 'cancel') {
      setBillingBanner('cancel');
      setActiveTab('pricing');
      setSearchParams({}, { replace: true });
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'pricing') {
      setPlansLoading(true);
      setPlansError(null);
      getPlans()
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setPlans(res.data);
          } else {
            setPlansError(res.error || 'Failed to load plans');
            setPlans([]);
          }
        })
        .catch((err) => {
          setPlansError(err?.message || 'Failed to load plans');
          setPlans([]);
        })
        .finally(() => setPlansLoading(false));
    }
  }, [activeTab]);

  // Fetch subscription, payment methods, invoices when Billing tab is active
  useEffect(() => {
    if (activeTab !== 'billing') return;
    setBillingLoading(true);
    setBillingError(null);
    Promise.all([
      getSubscription(),
      getPaymentMethods(),
      getInvoices(10),
    ])
      .then(([subRes, pmRes, invRes]) => {
        if (subRes.success && subRes.data != null) setSubscription(subRes.data);
        else setSubscription(null);
        if (pmRes.success && Array.isArray(pmRes.data)) setPaymentMethods(pmRes.data);
        else setPaymentMethods([]);
        if (invRes.success && Array.isArray(invRes.data)) setInvoices(invRes.data);
        else setInvoices([]);
        if (!subRes.success && subRes.error) setBillingError(subRes.error);
        else if (!pmRes.success && pmRes.error) setBillingError(pmRes.error);
        else setBillingError(null);
      })
      .catch((err) => {
        setBillingError(err?.message || 'Failed to load billing data');
        setSubscription(null);
        setPaymentMethods([]);
        setInvoices([]);
      })
      .finally(() => setBillingLoading(false));
  }, [activeTab]);

  const handleSave = () => {
    // In a real app, this would call an API
    console.log('Settings saved:', { orgName, orgEmail, timezone, language, notifications });
    alert('Settings saved successfully!');
  };

  /** When user selects a plan: 1) GET /billing/config, 2) POST /billing/checkout, then redirect to Stripe Checkout */
  const handleSelectPlan = async (plan) => {
    setPlanSelectionError(null);
    setPlanSelectionLoading(plan.id);
    try {
      const configResult = await getConfig();
      if (!configResult.success) {
        setPlanSelectionError(configResult.error || 'Failed to load billing configuration.');
        return;
      }
      const config = configResult.data || {};
      if (!config.billing_enabled) {
        setPlanSelectionError('Billing is not currently available.');
        return;
      }

      const successUrl = `${window.location.origin}/settings?billing=success`;
      const cancelUrl = `${window.location.origin}/settings?billing=cancel`;
      const checkoutResult = await createCheckoutSession(plan.id, successUrl, cancelUrl);

      if (!checkoutResult.success) {
        setPlanSelectionError(checkoutResult.error || 'Failed to start checkout.');
        return;
      }
      const checkoutUrl = checkoutResult.data?.checkout_url;
      if (!checkoutUrl) {
        setPlanSelectionError('Checkout URL not received. Please try again.');
        return;
      }
      window.location.href = checkoutUrl;
    } catch (err) {
      setPlanSelectionError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setPlanSelectionLoading(null);
    }
  };

  /** Open Stripe Billing Portal to manage payment method / subscription */
  const handleOpenBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const returnUrl = window.location.origin + '/settings';
      const result = await createBillingPortalSession(returnUrl);
      if (result.success && result.data?.portal_url) {
        window.location.href = result.data.portal_url;
      } else {
        setBillingError(result.error || 'Could not open billing portal.');
      }
    } catch (err) {
      setBillingError(err?.message || 'Could not open billing portal.');
    } finally {
      setPortalLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background elements similar to homepage */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#46cdc6]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#46cdc6]/5 rounded-full blur-[100px]" />
      </div>

      {/* Tiles background pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url("/background/tiles.png")',
          backgroundSize: '80px 80px',
          backgroundRepeat: 'repeat',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3)) brightness(1.2)',
        }}
      />

      {/* Header */}
      <PageHeader />

      {/* SECTION 1: Hero Section */}
      <div className="px-8 pt-12 pb-8 relative z-10">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 right-40 w-96 h-96 bg-[#46CDCF]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full relative"
        >
          <div className="flex items-start justify-between mb-12">
            <div>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#46CDCF]/10 to-amber-500/10 rounded-full mb-6 border border-[#46CDCF]/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles className="w-4 h-4 text-[#46CDCF]" />
                <span className="text-sm font-semibold text-[#46CDCF]">SETTINGS</span>
              </motion.div>
              <motion.h1 
                className="text-6xl font-bold text-slate-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Account Settings
              </motion.h1>
              <motion.p 
                className="text-xl text-slate-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Configure your organization preferences and billing information.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Billing post-checkout banner */}
      {billingBanner && (
        <div className="px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-4 rounded-xl border flex items-center justify-between ${
              billingBanner === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {billingBanner === 'success' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <span className="font-medium">Subscription updated successfully. Your billing is now active.</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                  <span className="font-medium">Checkout was cancelled. You can choose a plan anytime from the Pricing tab.</span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setBillingBanner(null)}
              className="p-1 rounded-lg hover:bg-black/5 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className="px-8 pb-12 relative z-10">
        <div className="w-full">
          <div className="grid grid-cols-12 gap-6">
              {/* Sidebar Tabs */}
              <motion.div 
                className="col-span-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-4 shadow-xl">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2
                          ${activeTab === tab.id
                            ? 'bg-[#46CDCF] text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-50'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Content Area */}
              <motion.div 
                className="col-span-9"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-8 shadow-xl">
                  {activeTab === 'general' && (
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-6">General Settings</h3>
                      <div className="space-y-6">
                        <div>
                          <label className="block font-semibold text-slate-900 mb-3">
                            Organization Name
                          </label>
                          <input
                            type="text"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46CDCF] focus:border-transparent text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-900 mb-3">
                            Organization Email
                          </label>
                          <input
                            type="email"
                            value={orgEmail}
                            onChange={(e) => setOrgEmail(e.target.value)}
                            className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46CDCF] focus:border-transparent text-slate-900"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block font-semibold text-slate-900 mb-3">
                              Timezone
                            </label>
                            <select
                              value={timezone}
                              onChange={(e) => setTimezone(e.target.value)}
                              className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46CDCF] focus:border-transparent text-slate-900 bg-white"
                            >
                              <option>UTC-5 (EST)</option>
                              <option>UTC-8 (PST)</option>
                              <option>UTC+0 (GMT)</option>
                              <option>UTC+1 (CET)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-900 mb-3">
                              Language
                            </label>
                            <input
                              type="text"
                              value="English"
                              readOnly
                              disabled
                              className="w-full px-5 py-4 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 cursor-not-allowed opacity-75"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-6">Notification Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200">
                          <div>
                            <p className="font-semibold text-slate-900">Email Notifications</p>
                            <p className="text-sm text-slate-600">Receive updates via email</p>
                          </div>
                          <button
                            onClick={() => setNotifications({...notifications, email: !notifications.email})}
                            className={`
                              w-14 h-8 rounded-full transition-all relative
                              ${notifications.email ? 'bg-[#46CDCF]' : 'bg-slate-300'}
                            `}
                          >
                            <div className={`
                              w-6 h-6 bg-white rounded-full shadow-md transition-transform absolute top-1
                              ${notifications.email ? 'translate-x-7' : 'translate-x-1'}
                            `} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200">
                          <div>
                            <p className="font-semibold text-slate-900">Push Notifications</p>
                            <p className="text-sm text-slate-600">Receive push notifications in browser</p>
                          </div>
                          <button
                            onClick={() => setNotifications({...notifications, push: !notifications.push})}
                            className={`
                              w-14 h-8 rounded-full transition-all relative
                              ${notifications.push ? 'bg-[#46CDCF]' : 'bg-slate-300'}
                            `}
                          >
                            <div className={`
                              w-6 h-6 bg-white rounded-full shadow-md transition-transform absolute top-1
                              ${notifications.push ? 'translate-x-7' : 'translate-x-1'}
                            `} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200">
                          <div>
                            <p className="font-semibold text-slate-900">Weekly Reports</p>
                            <p className="text-sm text-slate-600">Get weekly summary emails</p>
                          </div>
                          <button
                            onClick={() => setNotifications({...notifications, weekly: !notifications.weekly})}
                            className={`
                              w-14 h-8 rounded-full transition-all relative
                              ${notifications.weekly ? 'bg-[#46CDCF]' : 'bg-slate-300'}
                            `}
                          >
                            <div className={`
                              w-6 h-6 bg-white rounded-full shadow-md transition-transform absolute top-1
                              ${notifications.weekly ? 'translate-x-7' : 'translate-x-1'}
                            `} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'billing' && (
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-6">Billing & Subscription</h3>
                      {billingLoading ? (
                        <div className="flex items-center justify-center py-16">
                          <Loader2 className="w-10 h-10 animate-spin text-[#46CDCF]" />
                        </div>
                      ) : billingError ? (
                        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700">
                          {billingError}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Current subscription */}
                          <div className="p-6 bg-gradient-to-br from-[#46CDCF]/10 to-purple-500/10 border border-[#46CDCF]/20 rounded-2xl">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-2xl font-bold text-slate-900 mb-1">
                                  {subscription?.plan?.name ?? subscription?.plan_name ?? 'No active plan'}
                                </h4>
                                <p className="text-slate-600">
                                  {subscription?.plan?.description ?? (subscription ? 'Active subscription' : 'Subscribe from the Pricing tab')}
                                </p>
                              </div>
                              {subscription && (
                                <div className="text-right">
                                  <div className="text-3xl font-bold text-[#46CDCF]">
                                    {subscription.plan?.amount != null
                                      ? new Intl.NumberFormat('en-US', {
                                          style: 'currency',
                                          currency: (subscription.plan?.currency || subscription.currency || 'usd').toUpperCase(),
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 0,
                                        }).format(subscription.plan.amount / 100)
                                      : subscription.amount
                                        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subscription.amount / 100)
                                        : '—'}
                                  </div>
                                  <div className="text-sm text-slate-600">
                                    per {subscription.plan?.interval ?? subscription.interval ?? 'month'}
                                  </div>
                                </div>
                              )}
                            </div>
                            {subscription?.current_period_end && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span>
                                  Next billing date:{' '}
                                  {new Date(subscription.current_period_end * 1000).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                            )}
                            {!subscription && (
                              <p className="text-sm text-slate-600">
                                Go to the <button type="button" onClick={() => setActiveTab('pricing')} className="text-[#46CDCF] font-medium hover:underline">Pricing</button> tab to subscribe.
                              </p>
                            )}
                          </div>

                          {/* Payment methods */}
                          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                            <h4 className="font-bold text-slate-900 mb-4">Payment Method</h4>
                            {paymentMethods.length === 0 ? (
                              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                                <p className="text-slate-600">No payment method on file.</p>
                                <Button
                                  variant="outline"
                                  className="rounded-xl border-2"
                                  onClick={handleOpenBillingPortal}
                                  disabled={portalLoading}
                                >
                                  {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add payment method'}
                                </Button>
                              </div>
                            ) : (
                              paymentMethods.map((pm) => {
                                const brand = (pm.card?.brand ?? pm.brand ?? 'CARD').toUpperCase();
                                const last4 = pm.card?.last4 ?? pm.last4 ?? '••••';
                                const exp = pm.card
                                  ? `${String(pm.card.exp_month).padStart(2, '0')}/${String(pm.card.exp_year).slice(-2)}`
                                  : pm.exp_month && pm.exp_year
                                    ? `${String(pm.exp_month).padStart(2, '0')}/${String(pm.exp_year).slice(-2)}`
                                    : null;
                                return (
                                  <div
                                    key={pm.id}
                                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 mb-3 last:mb-0"
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-8 bg-slate-900 rounded flex items-center justify-center text-white text-xs font-bold">
                                        {brand}
                                      </div>
                                      <div>
                                        <p className="font-medium text-slate-900">•••• •••• •••• {last4}</p>
                                        {exp && <p className="text-sm text-slate-500">Expires {exp}</p>}
                                      </div>
                                    </div>
                                    <Button
                                      variant="outline"
                                      className="rounded-xl border-2"
                                      onClick={handleOpenBillingPortal}
                                      disabled={portalLoading}
                                    >
                                      {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}
                                    </Button>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'pricing' && (
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-6">Pricing Plans</h3>

                      {planSelectionError && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{planSelectionError}</span>
                          <button
                            type="button"
                            onClick={() => setPlanSelectionError(null)}
                            className="ml-auto text-red-500 hover:text-red-700 font-medium"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}

                      {/* Monthly / Annually Toggle - same as Home page */}
                      {!plansLoading && !plansError && plans.length > 0 && (
                        <div className="flex items-center gap-4 mb-8">
                          <span className="text-slate-700 font-medium">Monthly</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={isAnnualPricing}
                              onChange={(e) => setIsAnnualPricing(e.target.checked)}
                            />
                            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#185D54]"></div>
                          </label>
                          <span className="text-slate-700 font-medium">Annually</span>
                          {isAnnualPricing && (
                            <span className="text-[#185D54] text-sm bg-[#185D54]/10 px-2 py-1 rounded">Save 15%</span>
                          )}
                        </div>
                      )}

                      {plansLoading ? (
                        <div className="flex items-center justify-center py-16">
                          <Loader2 className="w-10 h-10 animate-spin text-[#46CDCF]" />
                        </div>
                      ) : plansError ? (
                        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700">
                          {plansError}
                        </div>
                      ) : plans.length === 0 ? (
                        <p className="text-slate-600">No plans available.</p>
                      ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {plans
                            .filter((plan) => {
                              const interval = (plan.billing_interval || 'monthly').toLowerCase();
                              const isFree = plan.price === 0 || plan.price == null;
                              if (isAnnualPricing) {
                                return interval === 'yearly' || isFree;
                              }
                              return interval === 'monthly';
                            })
                            .map((plan) => {
                            const features = plan.features || {};
                            const tooltips = features.feature_tooltips || {};
                            const billingInterval = (plan.billing_interval || 'monthly').toLowerCase();
                            const intervalLabel = billingInterval === 'yearly' ? 'year' : 'month';
                            const priceDisplay =
                              plan.price === 0 || plan.price === null || plan.price === undefined
                                ? 'Free'
                                : new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: (plan.currency || 'usd').toUpperCase(),
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                  }).format(plan.price);
                            const annualSavings = features.annual_savings;

                            return (
                              <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-full"
                              >
                                <Card
                                  className={`h-full flex flex-col overflow-hidden relative ${
                                    plan.is_popular
                                      ? 'border-2 border-[#185D54]'
                                      : 'border-2 border-gray-200 hover:border-[#185D54]'
                                  } transition-all duration-300`}
                                >
                                  {plan.is_popular && (
                                    <div className="absolute top-0 right-0 bg-[#185D54] text-white px-3 py-1.5 text-xs font-bold shadow-lg z-10 rounded-bl-lg flex items-center gap-1">
                                      <span>★</span>
                                      <span>Recommended</span>
                                    </div>
                                  )}
                                  <CardHeader className="flex-shrink-0 min-h-[160px]">
                                    <CardTitle className="text-xl text-gray-900">{plan.name}</CardTitle>
                                    <div className="mt-3">
                                      <span className="text-3xl font-bold" style={{ color: '#185D54' }}>
                                        {priceDisplay}
                                      </span>
                                      {priceDisplay !== 'Free' && (
                                        <span className="text-gray-500 text-sm"> / {intervalLabel}</span>
                                      )}
                                    </div>
                                    {annualSavings != null && annualSavings > 0 && (
                                      <p className="text-sm text-[#185D54] mt-1">
                                        Save ${annualSavings} with annual billing
                                      </p>
                                    )}
                                    <CardDescription className="text-gray-600 mt-2 text-sm">
                                      {plan.description}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="flex flex-col flex-1">
                                    <ul className="space-y-2 flex-1">
                                      {FEATURE_BOOLEAN_KEYS.filter((key) => features[key] === true).map((key) => {
                                        const tooltip = tooltips[key];
                                        return (
                                          <li
                                            key={key}
                                            className="relative flex items-start gap-2 text-gray-900 cursor-pointer hover-item group"
                                          >
                                            <CheckCircle2
                                              className="w-5 h-5 mt-0.5 flex-shrink-0"
                                              style={{ color: '#185D54' }}
                                            />
                                            <div>
                                              <span className="block text-sm">{snakeToTitleCase(key)}</span>
                                              {tooltip && (
                                                <span className="popup-tooltip absolute left-0 top-full mt-1 w-56 p-2 bg-gray-800 text-gray-200 text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
                                                  {tooltip}
                                                </span>
                                              )}
                                            </div>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                    <Button
                                      type="button"
                                      className="w-full mt-6 text-white"
                                      style={{ backgroundColor: '#185D54' }}
                                      disabled={planSelectionLoading !== null}
                                      onClick={() => handleSelectPlan(plan)}
                                      onMouseEnter={(e) => {
                                        if (planSelectionLoading === null) e.currentTarget.style.backgroundColor = '#134a43';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#185D54';
                                      }}
                                    >
                                      {planSelectionLoading === plan.id ? (
                                        <span className="flex items-center justify-center gap-2">
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                          Loading...
                                        </span>
                                      ) : (
                                        'Get Started'
                                      )}
                                    </Button>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-4">
                    <Button variant="outline" className="rounded-xl border-2 border-slate-300 px-8 text-slate-700 hover:bg-slate-50 hover:border-slate-400">
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave}
                      className="bg-[#46CDCF] hover:bg-[#15ae99] text-white rounded-xl px-8 shadow-lg shadow-[#46CDCF]/20"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
  );
}

