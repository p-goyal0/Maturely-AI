import { useState } from 'react';
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
  Building
} from 'lucide-react';
import { Button } from '../ui/button';
import { PageHeader } from '../shared/PageHeader';

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

  const handleSave = () => {
    // In a real app, this would call an API
    console.log('Settings saved:', { orgName, orgEmail, timezone, language, notifications });
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
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
          className="max-w-7xl mx-auto relative"
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
                className="text-xl text-slate-600 max-w-3xl"
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

      {/* Content */}
      <div className="px-8 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
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
                      <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-br from-[#46CDCF]/10 to-purple-500/10 border border-[#46CDCF]/20 rounded-2xl">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-2xl font-bold text-slate-900 mb-1">Enterprise Plan</h4>
                              <p className="text-slate-600">Unlimited users & features</p>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-[#46CDCF]">$299</div>
                              <div className="text-sm text-slate-600">per month</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Next billing date: January 15, 2026</span>
                          </div>
                        </div>

                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                          <h4 className="font-bold text-slate-900 mb-4">Payment Method</h4>
                          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-8 bg-slate-900 rounded flex items-center justify-center text-white text-xs font-bold">
                                VISA
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">•••• •••• •••• 4242</p>
                                <p className="text-sm text-slate-500">Expires 12/26</p>
                              </div>
                            </div>
                            <Button variant="outline" className="rounded-xl border-2">
                              Update
                            </Button>
                          </div>
                        </div>
                      </div>
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

