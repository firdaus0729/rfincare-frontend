import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { applyComparisonOverrides } from '../../../utils/bankMarketplace';

const ComparisonModal = ({
  banks,
  rawBanks = [],
  comparisonOverrides = {},
  onComparisonChange,
  onClose,
  onApply,
}) => {
  if (banks?.length === 0) return null;

  const sourceById = Object.fromEntries((rawBanks.length ? rawBanks : banks).map((b) => [b.id, b]));

  const getFieldValues = (bankId) => {
    const base = sourceById[bankId] || {};
    const o = comparisonOverrides[bankId] || {};
    return {
      interestRate: o.interestRate ?? base.interestRate ?? '',
      processingFee: o.processingFee ?? base.processingFee ?? '',
      otherCharges: o.otherCharges ?? base.otherCharges ?? '',
      featuresText: o.featuresText ?? (base.features || []).join('\n'),
    };
  };

  const displayBank = (bankId) => {
    const base = sourceById[bankId];
    if (!base) return banks.find((b) => b.id === bankId);
    return applyComparisonOverrides(base, {
      ...comparisonOverrides[bankId],
      features:
        comparisonOverrides[bankId]?.features ||
        (comparisonOverrides[bankId]?.featuresText
          ? comparisonOverrides[bankId].featuresText.split('\n').map((s) => s.trim()).filter(Boolean)
          : base.features),
    });
  };

  const bankIds = banks.map((b) => b.id);

  const staticRows = [
    { label: 'Bank Name', render: (bank) => bank?.name },
    { label: 'Approval Probability', render: (bank) => `${bank?.probability}%` },
    { label: 'Max Loan Amount', render: (bank) => bank?.maxAmount },
    { label: 'Max Tenure', render: (bank) => bank?.maxTenure },
    { label: 'Rating', render: (bank) => bank?.rating },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-hidden animate-scale-in flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground">
              Compare Banks
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Adjust rates, fees, and features below to compare side by side
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close comparison"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="overflow-auto flex-1">
          <div className="p-4 md:p-6">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left p-2 md:p-4 bg-muted rounded-tl-lg w-40">
                    <span className="text-sm font-semibold text-foreground">Compare</span>
                  </th>
                  {bankIds.map((bankId) => {
                    const bank = displayBank(bankId);
                    return (
                      <th key={bankId} className="p-2 md:p-4 bg-muted align-top">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden bg-background">
                            <Image
                              src={bank?.logo}
                              alt={bank?.logoAlt}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <span className="text-xs md:text-sm font-semibold text-foreground text-center">
                            {bank?.name}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-primary/5">
                  <td className="p-2 md:p-4 text-xs md:text-sm font-semibold">Interest rate (% p.a.)</td>
                  {bankIds.map((bankId) => (
                    <td key={bankId} className="p-2 md:p-4">
                      <Input
                        type="number"
                        step="0.01"
                        value={getFieldValues(bankId).interestRate}
                        onChange={(e) =>
                          onComparisonChange?.(bankId, {
                            interestRate: e.target.value === '' ? '' : Number(e.target.value),
                          })
                        }
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 md:p-4 text-xs md:text-sm font-semibold">Processing fee</td>
                  {bankIds.map((bankId) => (
                    <td key={bankId} className="p-2 md:p-4">
                      <Input
                        value={getFieldValues(bankId).processingFee}
                        onChange={(e) =>
                          onComparisonChange?.(bankId, { processingFee: e.target.value })
                        }
                      />
                    </td>
                  ))}
                </tr>
                <tr className="bg-muted/30">
                  <td className="p-2 md:p-4 text-xs md:text-sm font-semibold">Other charges</td>
                  {bankIds.map((bankId) => (
                    <td key={bankId} className="p-2 md:p-4">
                      <Input
                        value={getFieldValues(bankId).otherCharges}
                        onChange={(e) =>
                          onComparisonChange?.(bankId, { otherCharges: e.target.value })
                        }
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 md:p-4 text-xs md:text-sm font-semibold align-top">
                    Key features
                  </td>
                  {bankIds.map((bankId) => (
                    <td key={bankId} className="p-2 md:p-4 align-top">
                      <textarea
                        className="flex min-h-[88px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs md:text-sm"
                        value={getFieldValues(bankId).featuresText}
                        onChange={(e) =>
                          onComparisonChange?.(bankId, { featuresText: e.target.value })
                        }
                        placeholder="One feature per line"
                      />
                      <ul className="mt-2 space-y-1 text-left">
                        {(displayBank(bankId)?.features || []).slice(0, 5).map((f) => (
                          <li key={f} className="text-xs text-muted-foreground flex gap-1">
                            <Icon name="Check" size={12} className="text-success mt-0.5 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {staticRows.map((row, index) => (
                  <tr key={row.label} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                    <td className="p-2 md:p-4 text-xs md:text-sm font-semibold">{row.label}</td>
                    {bankIds.map((bankId) => (
                      <td key={bankId} className="p-2 md:p-4 text-center text-sm">
                        {row.render(displayBank(bankId))}
                      </td>
                    ))}
                  </tr>
                ))}

                <tr>
                  <td className="p-2 md:p-4" />
                  {bankIds.map((bankId) => (
                    <td key={bankId} className="p-2 md:p-4">
                      <Button
                        variant="default"
                        size="sm"
                        fullWidth
                        onClick={() => onApply(displayBank(bankId))}
                        iconName="ArrowRight"
                        iconPosition="right"
                      >
                        Apply
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
