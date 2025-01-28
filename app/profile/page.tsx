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
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background before:absolute before:inset-0 before:bg-[url('/noise.png')] before:opacity-[0.02] before:mix-blend-overlay relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="max-w-2xl mx-auto py-8 px-4 relative">
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
                className="flex items-center text-muted-foreground hover:text-foreground mb-2 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Profile Settings</h1>
              <p className="text-muted-foreground">Update your personal information</p>
            </div>
            <motion.button
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg hover:from-primary/95 hover:to-primary/85 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </motion.button>
          </div>

          {/* Profile Form */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm">
            <div className="p-6 space-y-8">
              {/* Basic Information */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Basic Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-3 py-2 rounded-lg border bg-muted/50 text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.metadata.name || ''}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        metadata: { ...prev.metadata, name: e.target.value }
                      }))}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 rounded-lg border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Phone Number</label>
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <input
                        type="tel"
                        value={profile.metadata.phone || ''}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          metadata: { ...prev.metadata, phone: e.target.value }
                        }))}
                        placeholder="Enter your phone number"
                        className="w-full px-3 py-2 rounded-lg border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Address Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Address Line 1</label>
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
                      className="w-full px-3 py-2 rounded-lg border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Address Line 2</label>
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
                      className="w-full px-3 py-2 rounded-lg border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">City</label>
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
                        className="w-full px-3 py-2 rounded-lg border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Postal Code</label>
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
                        className="w-full px-3 py-2 rounded-lg border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Country</label>
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
                      className="w-full px-3 py-2 rounded-lg border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
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
    </div>
  );
} 