import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { homepageService } from '../../services/homepageService';

const ShareYourStory = () => {
  const [form, setForm] = useState({
    submitterName: '',
    submitterEmail: '',
    submitterPhone: '',
    storyType: 'customer',
    storyText: '',
    location: '',
    loanAmount: '',
  });
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await homepageService.submitStory(form);
      setDone(true);
    } catch (err) {
      setError(err?.response?.data?.error || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Share Your Story</h1>
        <p className="text-muted-foreground mb-8">
          Tell us about your loan journey. Approved stories may appear on our homepage after review.
        </p>
        {done ? (
          <p className="text-green-600 font-medium">
            Thank you! Your story is pending moderation and will appear once approved.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Input label="Your name" value={form.submitterName} onChange={(e) => setForm({ ...form, submitterName: e.target.value })} required />
            <Input label="Email" type="email" value={form.submitterEmail} onChange={(e) => setForm({ ...form, submitterEmail: e.target.value })} required />
            <Input label="Phone" value={form.submitterPhone} onChange={(e) => setForm({ ...form, submitterPhone: e.target.value })} />
            <Select label="I am a" value={form.storyType} onChange={(v) => setForm({ ...form, storyType: v })} options={[
              { value: 'customer', label: 'Customer' },
              { value: 'agent', label: 'Agent' },
            ]} />
            <div>
              <label className="block text-sm font-medium mb-1">Your story</label>
              <textarea
                className="w-full min-h-[160px] rounded-md border border-input px-3 py-2"
                value={form.storyText}
                onChange={(e) => setForm({ ...form, storyText: e.target.value })}
                required
                minLength={20}
              />
            </div>
            <Input label="Location (optional)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input label="Loan amount (optional)" value={form.loanAmount} onChange={(e) => setForm({ ...form, loanAmount: e.target.value })} />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Submitting...' : 'Submit story'}
            </Button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ShareYourStory;
