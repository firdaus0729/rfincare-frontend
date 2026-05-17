import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { leadService } from '../../../services/leadService';

const EligibilityLeadGate = ({ onVerified, loanType }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [otp, setOtp] = useState('');
  const [leadId, setLeadId] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateAndSendOtp = async () => {
    setError('');
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Name, email, and mobile number are required.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, '').slice(-10))) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!consent) {
      setError('Please accept the consent to continue.');
      return;
    }
    setLoading(true);
    try {
      const lead = await leadService.createLead({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.replace(/\D/g, '').slice(-10),
        loanType,
        source: 'eligibility',
        consentAccepted: true,
      });
      setLeadId(lead.id);
      await leadService.requestOtp({ phone: phone.replace(/\D/g, '').slice(-10), email: email.trim(), leadId: lead.id });
      setOtpSent(true);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await leadService.verifyOtp({
        phone: phone.replace(/\D/g, '').slice(-10),
        otp,
        leadId,
      });
      setVerified(true);
      onVerified?.({
        leadId: res?.lead?.id || leadId,
        fullName,
        email,
        phone: phone.replace(/\D/g, '').slice(-10),
      });
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-lg flex items-center gap-2 text-sm text-success">
        <Icon name="CheckCircle2" size={18} />
        Mobile verified. Complete the calculator below.
      </div>
    );
  }

  return (
    <div className="mb-8 p-5 bg-muted/50 border border-border rounded-xl space-y-4">
      <div>
        <h3 className="font-semibold text-foreground">Verify your contact details</h3>
        <p className="text-xs text-muted-foreground mt-1">
          We use this to save your results and send a link to continue your application.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Mobile (10 digits)" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <label className="flex items-start gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
        <span className="text-muted-foreground">
          I consent to Rfincare contacting me about loan products and storing my details per the Privacy Policy.
        </span>
      </label>
      {otpSent && (
        <Input
          label="OTP sent to your mobile"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="6-digit code"
          maxLength={6}
        />
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {!otpSent ? (
          <Button type="button" onClick={handleCreateAndSendOtp} disabled={loading}>
            {loading ? 'Sending…' : 'Send OTP'}
          </Button>
        ) : (
          <Button type="button" onClick={handleVerify} disabled={loading || otp.length !== 6}>
            {loading ? 'Verifying…' : 'Verify & continue'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EligibilityLeadGate;
