import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CommissionConfigModal = ({ agent, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    loanType: 'home_loan',
    commissionType: 'percentage',
    commissionValue: 2.5,
    minLoanAmount: '',
    maxLoanAmount: '',
    effectiveFrom: new Date()?.toISOString()?.split('T')?.[0],
    effectiveTo: '',
  });

  useEffect(() => {
    if (!isOpen || !agent?.id) return;
    (async () => {
      const { data } = await adminService.getAgentCommission(agent.id);
      if (data) {
        setFormData({
          loanType: data.loanType || 'home_loan',
          commissionType: data.commissionType || 'percentage',
          commissionValue: data.commissionValue ?? 2.5,
          minLoanAmount: data.minLoanAmount || '',
          maxLoanAmount: data.maxLoanAmount || '',
          effectiveFrom: data.effectiveFrom || new Date().toISOString().split('T')[0],
          effectiveTo: data.effectiveTo || '',
        });
      }
    })();
  }, [isOpen, agent?.id]);

  const loanTypeOptions = [
    { value: 'home_loan', label: 'Home Loan' },
    { value: 'personal_loan', label: 'Personal Loan' },
    { value: 'business_loan', label: 'Business Loan' },
    { value: 'auto_loan', label: 'Auto Loan' },
    { value: 'education_loan', label: 'Education Loan' }
  ];

  const commissionTypeOptions = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount (₹)' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-border p-4 md:p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Configure Commission</h2>
            <p className="text-sm text-muted-foreground">Agent: {agent?.name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Loan Type"
              options={loanTypeOptions}
              value={formData?.loanType}
              onChange={(value) => setFormData({ ...formData, loanType: value })}
              required
            />

            <Select
              label="Commission Type"
              options={commissionTypeOptions}
              value={formData?.commissionType}
              onChange={(value) => setFormData({ ...formData, commissionType: value })}
              required
            />

            <Input
              label={`Commission Value ${formData?.commissionType === 'percentage' ? '(%)' : '(₹)'}`}
              type="number"
              step="0.01"
              value={formData?.commissionValue}
              onChange={(e) => setFormData({ ...formData, commissionValue: e?.target?.value })}
              required
            />

            <Input
              label="Minimum Loan Amount (₹)"
              type="number"
              value={formData?.minLoanAmount}
              onChange={(e) => setFormData({ ...formData, minLoanAmount: e?.target?.value })}
              placeholder="Optional"
            />

            <Input
              label="Maximum Loan Amount (₹)"
              type="number"
              value={formData?.maxLoanAmount}
              onChange={(e) => setFormData({ ...formData, maxLoanAmount: e?.target?.value })}
              placeholder="Optional"
            />

            <Input
              label="Effective From"
              type="date"
              value={formData?.effectiveFrom}
              onChange={(e) => setFormData({ ...formData, effectiveFrom: e?.target?.value })}
              required
            />

            <Input
              label="Effective To"
              type="date"
              value={formData?.effectiveTo}
              onChange={(e) => setFormData({ ...formData, effectiveTo: e?.target?.value })}
              placeholder="Optional"
            />
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} color="var(--color-primary)" />
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Commission Calculation</p>
                <p>
                  {formData?.commissionType === 'percentage'
                    ? `Agent will receive ${formData?.commissionValue}% of the loan amount as commission.`
                    : `Agent will receive a fixed amount of ₹${formData?.commissionValue} per approved loan.`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-border">
            <Button variant="outline" fullWidth onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="default" fullWidth type="submit">
              Save Commission Config
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommissionConfigModal;
