
import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Save, Loader2 } from 'lucide-react';

const AdminSettingsPage = () => {
  const { settings, updateSettings, loading } = useData();
  const [localSettings, setLocalSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleChange = (e) => setLocalSettings({ ...localSettings, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(localSettings);
      toast({ title: "Settings Saved", description: "Your settings have been updated in the database." });
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !localSettings) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <Helmet><title>Settings | Relicsphere Admin</title></Helmet>
      <div><h1 className="text-3xl font-serif font-bold text-[#2C2C2C]">General Settings</h1><p className="text-gray-500">Manage store details.</p></div>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSave} className="space-y-6">
          <div><Label>Store Name</Label><Input name="company_name" value={localSettings.company_name || ''} onChange={handleChange} required /></div>
          <div><Label>Store Description</Label><Textarea name="description" value={localSettings.description || ''} onChange={handleChange} rows={3} required /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label>Support Email</Label><Input name="support_email" type="email" value={localSettings.support_email || ''} onChange={handleChange} required /></div>
            <div><Label>Contact Email</Label><Input name="email" type="email" value={localSettings.email || ''} onChange={handleChange} required /></div>
             <div className="md:col-span-2"><Label>Contact Phone</Label><Input name="phone" value={localSettings.phone || ''} onChange={handleChange} required /></div>
          </div>
          <div><Label>Business Address</Label><Textarea name="address" value={localSettings.address || ''} onChange={handleChange} rows={4} required /></div>
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button type="submit" disabled={saving} className="bg-[#8B4513] hover:bg-[#A0522D] text-white">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} 
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
