'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

interface UserProfile {
  email: string;
  metadata: {
    name?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      postal_code?: string;
      country?: string;
    };
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    email: '',
    metadata: {}
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile({
            email: data.email,
            metadata: data.metadata || {}
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        alert('Error loading profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, router]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          metadata: profile.metadata
        })
        .eq('id', user.id);

      if (error) throw error;

      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
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
    <div className="max-w-2xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-500 hover:text-gray-700 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <p className="text-gray-500">Update your personal information</p>
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

        {/* Profile Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Basic Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-3 py-2 rounded-lg border bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.metadata.name || ''}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, name: e.target.value }
                    }))}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={profile.metadata.phone || ''}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        metadata: { ...prev.metadata, phone: e.target.value }
                      }))}
                      placeholder="Enter your phone number"
                      className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Address Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Address Line 1</label>
                  <input
                    type="text"
                    value={profile.metadata.address?.line1 || ''}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        address: {
                          ...prev.metadata.address,
                          line1: e.target.value
                        }
                      }
                    }))}
                    placeholder="Street address"
                    className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address Line 2</label>
                  <input
                    type="text"
                    value={profile.metadata.address?.line2 || ''}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        address: {
                          ...prev.metadata.address,
                          line2: e.target.value
                        }
                      }
                    }))}
                    placeholder="Apartment, suite, etc."
                    className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={profile.metadata.address?.city || ''}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        metadata: {
                          ...prev.metadata,
                          address: {
                            ...prev.metadata.address,
                            city: e.target.value
                          }
                        }
                      }))}
                      placeholder="City"
                      className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={profile.metadata.address?.postal_code || ''}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        metadata: {
                          ...prev.metadata,
                          address: {
                            ...prev.metadata.address,
                            postal_code: e.target.value
                          }
                        }
                      }))}
                      placeholder="Postal code"
                      className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <select
                    value={profile.metadata.address?.country || ''}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        address: {
                          ...prev.metadata.address,
                          country: e.target.value
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a country</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                    <option value="NL">Netherlands</option>
                    <option value="BE">Belgium</option>
                    <option value="AT">Austria</option>
                    <option value="PL">Poland</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 