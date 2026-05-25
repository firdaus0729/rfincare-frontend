import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { leadService } from '../../../services/leadService';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const normalizedPhone = () => phone.replace(/\D/g, '').slice(-10);

  const validateContact = () => {
    if (!fullName.trim()) return 'Full name is required.';
    if (!email.trim() || !EMAIL_RE.test(email.trim())) return 'Enter a valid email address.';
    if (!normalizedPhone() || !/^[6-9]\d{9}$/.test(normalizedPhone())) {
      return 'Enter a valid 10-digit Indian mobile number.';
    }
    if (!consent) return 'Please accept the consent to continue.';
    return null;
  };

  const handleCreateAndSendOtp = async () => {
    setError('');
    const validationError = validateContact();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const lead = await leadService.createLead({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: normalizedPhone(),
        loanType,
        source: 'eligibility',
        consentAccepted: true,
      });
      setLeadId(lead.id);
      await leadService.requestOtp({
        phone: normalizedPhone(),
        email: email.trim(),
        leadId: lead.id,
      });
      setOtpSent(true);
      setOtp('');
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    if (otp.length !== 6) {
      setError('Enter the 6-digit OTP sent to your mobile.');
      return;
    }

    setLoading(true);
    try {
      const res = await leadService.verifyOtp({
        phone: normalizedPhone(),
        otp,
        leadId,
      });
      setVerified(true);
      onVerified?.({
        leadId: res?.lead?.id || leadId,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: normalizedPhone(),
      });
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="p-4 bg-success/10 border border-success/30 rounded-lg flex items-start gap-2 text-sm text-success">
        <Icon name="CheckCircle2" size={18} className="shrink-0 mt-0.5" />
        <span>
          <strong>Verified.</strong> Mobile ({normalizedPhone()}) and email ({email.trim()}) confirmed.
          Continue with the loan details below.
        </span>
      </div>
    );
  }

  return (
    <div className="p-5 bg-muted/50 border border-border rounded-xl space-y-4">
      <div>
        <h3 className="font-semibold text-foreground">Verify your contact details</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Enter your name, email, and mobile. We will send an OTP to your mobile to verify before showing the
          eligibility form.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={otpSent && loading}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={otpSent && loading}
        />
        <Input
          label="Mobile (10 digits)"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          required
          maxLength={10}
          disabled={otpSent && loading}
        />
      </div>
      <label className="flex items-start gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
          disabled={otpSent && loading}
        />
        <span className="text-muted-foreground">
          I consent to Rfincare contacting me about loan products and storing my details per the Privacy Policy.
        </span>
      </label>
      {otpSent && (
        <div className="space-y-2">
          <Input
            label="OTP sent to your mobile"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="6-digit code"
            maxLength={6}
          />
          <p className="text-xs text-muted-foreground">
            OTP sent to {normalizedPhone()}
            {email.trim() ? ` · Email on file: ${email.trim()}` : ''}
          </p>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {!otpSent ? (
          <Button type="button" onClick={handleCreateAndSendOtp} disabled={loading}>
            {loading ? 'Sending…' : 'Send OTP to mobile'}
          </Button>
        ) : (
          <>
            <Button type="button" onClick={handleVerify} disabled={loading || otp.length !== 6}>
              {loading ? 'Verifying…' : 'Verify & continue'}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => {
                setOtpSent(false);
                setOtp('');
                setError('');
              }}
            >
              Change details
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default EligibilityLeadGate;
