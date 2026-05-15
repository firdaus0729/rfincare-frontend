import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { homepageService } from '../../../services/homepageService';

const CustomerStatusCheckModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({ applicationNumber: '', email: '', phone: '', channel: 'email' });
  const [otp, setOtp] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const requestOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await homepageService.requestStatusOtp({ email: formData.email, phone: formData.phone, channel: formData.channel });
      setStep('otp');
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not send OTP');
    } finally { setLoading(false); }
  };

  const verify = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await homepageService.verifyStatusCheck({ email: formData.email, otp, applicationNumber: formData.applicationNumber });
      setResult(data.application);
      setStep('result');
    } catch (err) {
      setError(err?.response?.data?.error || 'Verification failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Check Application Status</h3>
          <button type="button" onClick={onClose}><Icon name="X" size={20} /></button>
        </div>
        {error && <p className="text-sm text-destructive mb-3">{error}</p>}
        {step === 'form' && (
          <form onSubmit={requestOtp} className="space-y-4">
            <Input label="Application Number" value={formData.applicationNumber} onChange={(e) => setFormData({ ...formData, applicationNumber: e.target.value })} required />
            <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <Input label="Phone (for SMS/WhatsApp)" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <Select label="OTP via" value={formData.channel} onChange={(v) => setFormData({ ...formData, channel: v })} options={[
              { value: 'email', label: 'Email' }, { value: 'sms', label: 'SMS' }, { value: 'whatsapp', label: 'WhatsApp' },
            ]} />
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Sending...' : 'Send OTP'}</Button>
          </form>
        )}
        {step === 'otp' && (
          <form onSubmit={verify} className="space-y-4">
            <Input label="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Verifying...' : 'Verify & View Status'}</Button>
          </form>
        )}
        {step === 'result' && result && (
          <div className="space-y-3">
            <p><strong>Application:</strong> {result.applicationNumber}</p>
            <p><strong>Status:</strong> {result.status}</p>
            {result.eligibilityStatus && <p><strong>Eligibility:</strong> {result.eligibilityStatus}</p>}
            {result.statusNotes && <p className="text-sm text-muted-foreground">{result.statusNotes}</p>}
            <Button onClick={() => navigate('/customer-login')} className="w-full">Sign in for full dashboard</Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default CustomerStatusCheckModal;
