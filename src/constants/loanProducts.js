/**
 * Single source of truth for loan product slugs used in URLs and navigation.
 * slug: URL segment (/products/personal)
 * apiKey: backend / form values (personal_loan)
 */
export const LOAN_PRODUCTS = [
  {
    slug: 'personal',
    apiKey: 'personal_loan',
    label: 'Personal Loan',
    shortLabel: 'Personal',
    icon: 'Wallet',
    description:
      'Flexible financing for weddings, education, medical expenses, or debt consolidation.',
    interestRange: '8.5% - 15.9%',
    features: ['Up to ₹40 Lakhs', 'Terms 1-5 years', 'Quick approval', 'No collateral required'],
    color: 'var(--color-primary)',
  },
  {
    slug: 'home',
    apiKey: 'home_loan',
    label: 'Home Loan',
    shortLabel: 'Home',
    icon: 'Home',
    description: 'Competitive rates for purchase, construction, or balance transfer.',
    interestRange: '6.2% - 9.5%',
    features: ['Up to ₹5 Crore', 'Terms up to 30 years', 'Tax benefits', 'Balance transfer'],
    color: 'var(--color-secondary)',
  },
  {
    slug: 'business',
    apiKey: 'business_loan',
    label: 'Business Loan',
    shortLabel: 'Business',
    icon: 'Briefcase',
    description: 'Working capital, equipment finance, and expansion funding for your business.',
    interestRange: '9.0% - 18.0%',
    features: ['Up to ₹50 Crore', 'Flexible repayment', 'Working capital', 'Equipment finance'],
    color: 'var(--color-accent)',
  },
  {
    slug: 'auto',
    apiKey: 'auto_loan',
    label: 'Auto Loan',
    shortLabel: 'Auto',
    icon: 'Car',
    description: 'Finance for new and used vehicles with competitive rates.',
    interestRange: '5.5% - 12.0%',
    features: ['Up to ₹1 Crore', 'Terms 2-7 years', 'New & used cars', 'Refinancing'],
    color: 'var(--color-conversion)',
  },
  {
    slug: 'education',
    apiKey: 'education_loan',
    label: 'Education Loan',
    shortLabel: 'Education',
    icon: 'GraduationCap',
    description: 'Fund higher education in India or abroad with moratorium options.',
    interestRange: '7.5% - 15.0%',
    features: ['Moratorium period', 'Tax benefits', 'Tuition & living costs', 'Study abroad'],
    color: '#0ea5e9',
  },
];

const slugToProduct = new Map(LOAN_PRODUCTS.map((p) => [p.slug, p]));
const apiKeyToProduct = new Map(LOAN_PRODUCTS.map((p) => [p.apiKey, p]));

export function getLoanProductBySlug(slug) {
  if (!slug) return null;
  const normalized = String(slug).toLowerCase().replace(/-/g, '_');
  return (
    slugToProduct.get(normalized)
    || apiKeyToProduct.get(normalized)
    || apiKeyToProduct.get(`${normalized}_loan`)
    || null
  );
}

export function normalizeLoanApiKey(input) {
  const product = getLoanProductBySlug(input);
  if (product) return product.apiKey;
  const s = String(input || '').toLowerCase();
  if (s.endsWith('_loan')) return s;
  const slugMap = {
    personal: 'personal_loan',
    home: 'home_loan',
    business: 'business_loan',
    auto: 'auto_loan',
    education: 'education_loan',
  };
  if (slugMap[s]) return slugMap[s];
  return s || null;
}

export function productMatchesLoanType(productData, apiKey) {
  if (!apiKey) return true;
  const d = productData || {};
  const candidate =
    d.loanType || d.loan_type || d.type || d.productType || d.product_type || '';
  const normalized = String(candidate).toLowerCase();
  if (!normalized) return true;
  return normalized === apiKey || normalized === apiKey.replace('_loan', '');
}
