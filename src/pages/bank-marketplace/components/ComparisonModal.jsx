import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ComparisonModal = ({ banks, onClose, onApply }) => {
  if (banks?.length === 0) return null;

  const comparisonRows = [
    { label: 'Bank Name', key: 'name', type: 'text' },
    { label: 'Approval Probability', key: 'probability', type: 'probability' },
    { label: 'Interest Rate', key: 'interestRate', type: 'rate' },
    { label: 'Processing Fee', key: 'processingFee', type: 'text' },
    { label: 'Max Loan Amount', key: 'maxAmount', type: 'text' },
    { label: 'Max Tenure', key: 'maxTenure', type: 'text' },
    { label: 'Rating', key: 'rating', type: 'rating' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground">
            Compare Banks
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close comparison"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="p-4 md:p-6">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 md:p-4 bg-muted rounded-tl-lg">
                    <span className="text-sm md:text-base font-semibold text-foreground">Features</span>
                  </th>
                  {banks?.map((bank) => (
                    <th key={bank?.id} className="p-2 md:p-4 bg-muted">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden bg-background">
                          <Image
                            src={bank?.logo}
                            alt={bank?.logoAlt}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <span className="text-xs md:text-sm font-semibold text-foreground text-center line-clamp-2">
                          {bank?.name}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows?.map((row, index) => (
                  <tr key={row?.key} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                    <td className="p-2 md:p-4 text-xs md:text-sm font-semibold text-foreground">
                      {row?.label}
                    </td>
                    {banks?.map((bank) => (
                      <td key={bank?.id} className="p-2 md:p-4 text-center">
                        {row?.type === 'text' && (
                          <span className="text-xs md:text-sm text-foreground">{bank?.[row?.key]}</span>
                        )}
                        {row?.type === 'probability' && (
                          <div className="flex flex-col items-center space-y-1">
                            <span className={`text-base md:text-lg font-bold ${
                              bank?.[row?.key] >= 80 ? 'text-success' :
                              bank?.[row?.key] >= 60 ? 'text-warning' : 'text-error'
                            }`}>
                              {bank?.[row?.key]}%
                            </span>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div
                                className={`h-full rounded-full ${
                                  bank?.[row?.key] >= 80 ? 'bg-success' :
                                  bank?.[row?.key] >= 60 ? 'bg-warning' : 'bg-error'
                                }`}
                                style={{ width: `${bank?.[row?.key]}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {row?.type === 'rate' && (
                          <span className="text-base md:text-lg font-bold text-primary">
                            {bank?.[row?.key]}%
                          </span>
                        )}
                        {row?.type === 'rating' && (
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-xs md:text-sm font-semibold text-foreground">
                              {bank?.[row?.key]}
                            </span>
                            <Icon name="Star" size={14} className="text-warning fill-warning" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-2 md:p-4"></td>
                  {banks?.map((bank) => (
                    <td key={bank?.id} className="p-2 md:p-4">
                      <Button
                        variant="default"
                        size="sm"
                        fullWidth
                        onClick={() => onApply(bank)}
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