'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Store,
  Mail,
  CreditCard,
  Truck,
  Globe,
  Bell,
  Shield,
  Save,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Settings {
  store: {
    name: string;
    description: string;
    currency: string;
    timezone: string;
  };
  shipping: {
    freeShippingThreshold: number;
    defaultShippingFee: number;
    allowedCountries: string[];
  };
  email: {
    orderConfirmation: boolean;
    shippingUpdates: boolean;
    promotionalEmails: boolean;
  };
  payment: {
    currency: string;
    allowedMethods: string[];
  };
}

const defaultSettings: Settings = {
  store: {
    name: 'Coffee Traders',
    description: 'Premium European Coffee Trading Platform',
    currency: 'EUR',
    timezone: 'Europe/Berlin',
  },
  shipping: {
    freeShippingThreshold: 50,
    defaultShippingFee: 5,
    allowedCountries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PL'],
  },
  email: {
    orderConfirmation: true,
    shippingUpdates: true,
    promotionalEmails: false,
  },
  payment: {
    currency: 'EUR',
    allowedMethods: ['card', 'sepa_debit'],
  },
};

const europeanCountries = [
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'AT', name: 'Austria' },
  { code: 'PL', name: 'Poland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'IE', name: 'Ireland' },
  { code: 'GR', name: 'Greece' },
];

const timezones = [
  'Europe/Berlin',
  'Europe/Paris',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Amsterdam',
  'Europe/Brussels',
  'Europe/Vienna',
  'Europe/Warsaw',
];

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card' },
  { id: 'sepa_debit', name: 'SEPA Direct Debit' },
  { id: 'sofort', name: 'SOFORT' },
  { id: 'giropay', name: 'Giropay' },
  { id: 'ideal', name: 'iDEAL' },
  { id: 'bancontact', name: 'Bancontact' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();

        if (error) throw error;

        if (data) {
          setSettings({
            store: data.store,
            shipping: data.shipping,
            email: data.email,
            payment: data.payment,
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        alert('Error loading settings');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .update({
          store: settings.store,
          shipping: settings.shipping,
          email: settings.email,
          payment: settings.payment,
        })
        .eq('id', 1);

      if (error) throw error;

      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Make sure you have admin access.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your store settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Store Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Store className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Store Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Store Name</label>
                  <input
                    type="text"
                    value={settings.store.name}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      store: { ...prev.store, name: e.target.value }
                    }))}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={settings.store.description}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      store: { ...prev.store, description: e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <select
                      value={settings.store.currency}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        store: { ...prev.store, currency: e.target.value }
                      }))}
                      className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Timezone</label>
                    <select
                      value={settings.store.timezone}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        store: { ...prev.store, timezone: e.target.value }
                      }))}
                      className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {timezones.map((timezone) => (
                        <option key={timezone} value={timezone}>
                          {timezone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Truck className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Shipping</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Free Shipping Threshold (€)
                    </label>
                    <input
                      type="number"
                      value={settings.shipping.freeShippingThreshold}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        shipping: { ...prev.shipping, freeShippingThreshold: parseFloat(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Default Shipping Fee (€)
                    </label>
                    <input
                      type="number"
                      value={settings.shipping.defaultShippingFee}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        shipping: { ...prev.shipping, defaultShippingFee: parseFloat(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Allowed Countries</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {europeanCountries.map((country) => (
                      <label
                        key={country.code}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={settings.shipping.allowedCountries.includes(country.code)}
                          onChange={(e) => {
                            const newCountries = e.target.checked
                              ? [...settings.shipping.allowedCountries, country.code]
                              : settings.shipping.allowedCountries.filter(c => c !== country.code);
                            setSettings(prev => ({
                              ...prev,
                              shipping: { ...prev.shipping, allowedCountries: newCountries }
                            }));
                          }}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{country.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Payment Methods</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    value={settings.payment.currency}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      payment: { ...prev.payment, currency: e.target.value }
                    }))}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Accepted Payment Methods</label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={settings.payment.allowedMethods.includes(method.id)}
                          onChange={(e) => {
                            const newMethods = e.target.checked
                              ? [...settings.payment.allowedMethods, method.id]
                              : settings.payment.allowedMethods.filter(m => m !== method.id);
                            setSettings(prev => ({
                              ...prev,
                              payment: { ...prev.payment, allowedMethods: newMethods }
                            }));
                          }}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{method.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Email Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Mail className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Email Notifications</h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.email.orderConfirmation}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, orderConfirmation: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-medium">Order Confirmations</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Send email confirmations for new orders
                    </p>
                  </div>
                </label>
                <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.email.shippingUpdates}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, shippingUpdates: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-medium">Shipping Updates</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Send notifications for shipping status changes
                    </p>
                  </div>
                </label>
                <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.email.promotionalEmails}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, promotionalEmails: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-medium">Promotional Emails</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Send marketing and promotional emails
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span>View Store</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <span>Notification Settings</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span>Security Settings</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 