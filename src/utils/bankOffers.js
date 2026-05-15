import { productMatchesLoanType } from '../constants/loanProducts';

export function parseProductData(product) {
  if (!product?.data) return {};
  if (typeof product.data === 'object') return product.data;
  try {
    return JSON.parse(product.data);
  } catch {
    return {};
  }
}

export function productMatchesBankProduct(product, apiKey) {
  if (!apiKey) return true;
  const data = parseProductData(product);
  const explicit = data.loanType || data.loan_type || data.type || data.productType;
  if (explicit) return productMatchesLoanType(data, apiKey);

  const name = String(product?.name || '').toLowerCase();
  const key = apiKey.replace('_loan', '');
  return name.includes(key) || (key === 'education' && (name.includes('edu') || name.includes('study')));
}

export function buildBankOffers(banks, loanProduct) {
  if (!Array.isArray(banks) || !loanProduct) return [];

  const offers = [];

  for (const bank of banks) {
    const products = (bank.bankProducts || []).filter((p) =>
      productMatchesBankProduct(p, loanProduct.apiKey),
    );

    if (products.length === 0) {
      offers.push({
        bankId: bank.id,
        bankName: bank.name,
        logoUrl: bank.logoUrl,
        logoAlt: bank.logoAlt,
        rating: bank.rating,
        reviewsCount: bank.reviewsCount,
        productId: null,
        productName: `${loanProduct.label} — ${bank.name}`,
        interestMin: null,
        interestMax: null,
        interestLabel: loanProduct.interestRange,
        maxAmount: null,
        maxTenure: null,
        processingFee: null,
        features: loanProduct.features?.slice(0, 3) || [],
        isFeatured: false,
      });
      continue;
    }

    products.forEach((product, index) => {
      const data = parseProductData(product);
      const min = data.interestRateMin ?? data.interest_rate_min;
      const max = data.interestRateMax ?? data.interest_rate_max;
      offers.push({
        bankId: bank.id,
        bankName: bank.name,
        logoUrl: bank.logoUrl,
        logoAlt: bank.logoAlt,
        rating: bank.rating,
        reviewsCount: bank.reviewsCount,
        productId: product.id,
        productName: product.name,
        interestMin: min,
        interestMax: max,
        interestLabel:
          min != null && max != null
            ? `${min}% – ${max}% p.a.`
            : loanProduct.interestRange,
        maxAmount: data.maxLoanAmount ?? data.max_loan_amount,
        maxTenure: data.maxTenureYears ?? data.max_tenure_years,
        processingFee:
          data.processingFeePercentage ?? data.processing_fee_percentage,
        features: Array.isArray(data.features)
          ? data.features.slice(0, 4)
          : loanProduct.features?.slice(0, 3) || [],
        isFeatured: index === 0,
      });
    });
  }

  return offers.sort((a, b) => {
    if (a.interestMin != null && b.interestMin != null) {
      return a.interestMin - b.interestMin;
    }
    return a.bankName.localeCompare(b.bankName);
  });
}

export function formatLoanAmount(value) {
  if (value == null || value === '') return 'On request';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  return `₹${num.toLocaleString('en-IN')}`;
}
