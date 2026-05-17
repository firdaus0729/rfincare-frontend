import React, { useEffect, useState } from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { bankService } from '../../../services/apiServices';

const PRIORITY_OPTIONS = [
  {
    id: 'low_interest',
    label: 'Lowest interest rate',
    description: 'Minimize EMI and total interest paid',
    icon: 'TrendingDown',
  },
  {
    id: 'low_charges',
    label: 'Low processing & other charges',
    description: 'Focus on fees, legal, and stamp duty costs',
    icon: 'IndianRupee',
  },
  {
    id: 'urgent',
    label: 'Fast disbursal',
    description: 'Get funds quickly even if rate is slightly higher',
    icon: 'Zap',
  },
  {
    id: 'best_deal',
    label: 'Best overall deal',
    description: 'Balance rate, charges, and lender reputation',
    icon: 'Award',
  },
];

const BankPreferencesStep = ({ formData, onChange, errors = {} }) => {
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    bankService
      .getActiveBanks()
      .then((data) => setBanks(Array.isArray(data) ? data : []))
      .catch(() => setBanks([]));
  }, []);

  const bankOptions = [
    { value: '', label: 'Select preferred bank (optional)' },
    ...banks.map((b) => ({ value: b.id, label: b.name })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Bank & loan preferences</h2>
        <p className="text-sm text-muted-foreground">
          Choose your preferred lender and what matters most for your loan.
        </p>
      </div>

      <Select
        label="Preferred bank to apply with"
        options={bankOptions}
        value={formData.preferredBankId || ''}
        onChange={(value) => {
          const bank = banks.find((b) => b.id === value);
          onChange('preferredBankId', value);
          onChange('preferredBankName', bank?.name || '');
        }}
        error={errors.preferredBankId}
      />

      {formData.preferredBankName && (
        <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm">
          <Icon name="Building2" size={18} className="text-primary" />
          <span>
            Applying with: <strong>{formData.preferredBankName}</strong>
          </span>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-foreground mb-3">Your top priority</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange('loanPriority', opt.id)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                formData.loanPriority === opt.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon name={opt.icon} size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">{opt.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        {errors.loanPriority && (
          <p className="text-xs text-destructive mt-2">{errors.loanPriority}</p>
        )}
      </div>
    </div>
  );
};

export default BankPreferencesStep;
