import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { bankService } from '../../../services/apiServices';
import { buildBankOffers, formatLoanAmount } from '../../../utils/bankOffers';

const BankOffersSection = ({ product }) => {
  const navigate = useNavigate();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await bankService.getActiveBanks({ loanType: product.slug });
        if (!cancelled) {
          setBanks(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) setError('Unable to load bank offers right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product.slug]);

  const offers = useMemo(() => buildBankOffers(banks, product), [banks, product]);

  const qs = `loanType=${product.slug}`;

  return (
    <section className="py-12 md:py-16 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
              Partner banks
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {product.label} offers from leading banks
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Compare {product.shortLabel.toLowerCase()} loan products from HDFC, ICICI, SBI, Axis,
              and other RBI-registered partners. Rates and limits vary by bank and profile.
            </p>
          </div>
          <Button
            variant="outline"
            iconName="Building2"
            onClick={() => navigate(`/bank-marketplace?${qs}`)}
            className="shrink-0"
          >
            View all in marketplace
          </Button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl border border-border bg-muted/40 animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && offers.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <Icon name="Building2" size={40} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Partner bank products for {product.label.toLowerCase()} will appear here soon.
            </p>
            <Button onClick={() => navigate(`/bank-marketplace?${qs}`)}>Browse bank marketplace</Button>
          </div>
        )}

        {!loading && !error && offers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <article
                key={`${offer.bankId}-${offer.productId || 'default'}`}
                className="group relative flex flex-col rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 overflow-hidden"
              >
                {offer.isFeatured && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    Popular
                  </span>
                )}
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
                      {offer.logoUrl ? (
                        <Image
                          src={offer.logoUrl}
                          alt={offer.logoAlt || offer.bankName}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <Icon name="Building2" size={28} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-foreground truncate">{offer.bankName}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{offer.productName}</p>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-4 mb-4"
                    style={{ backgroundColor: `${product.color}14` }}
                  >
                    <p className="text-xs font-medium text-muted-foreground mb-1">Interest rate</p>
                    <p className="text-xl font-bold" style={{ color: product.color }}>
                      {offer.interestLabel}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground text-xs">Max amount</p>
                      <p className="font-semibold text-foreground">
                        {formatLoanAmount(offer.maxAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Tenure</p>
                      <p className="font-semibold text-foreground">
                        {offer.maxTenure ? `Up to ${offer.maxTenure} yrs` : 'Flexible'}
                      </p>
                    </div>
                  </div>

                  {offer.features?.length > 0 && (
                    <ul className="space-y-1.5 mb-5 flex-1">
                      {offer.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <Icon
                            name="Check"
                            size={14}
                            className="mt-0.5 shrink-0"
                            style={{ color: product.color }}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex gap-2 mt-auto pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/bank-marketplace?${qs}`)}
                    >
                      Compare
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        navigate(`/customer-assessment-portal?${qs}`, {
                          state: { selectedBank: { id: offer.bankId, name: offer.bankName } },
                        })
                      }
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BankOffersSection;
