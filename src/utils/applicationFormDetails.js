const LABELS = {
  title: 'Title',
  firstName: 'First name',
  middleName: 'Middle name',
  lastName: 'Last name',
  dateOfBirth: 'Date of birth',
  gender: 'Gender',
  maritalStatus: 'Marital status',
  email: 'Email',
  phone: 'Phone',
  aadhaar: 'Aadhaar',
  pan: 'PAN',
  addressLine1: 'Address line 1',
  addressLine2: 'Address line 2',
  city: 'City',
  district: 'District',
  state: 'State',
  pinCode: 'PIN code',
  residenceType: 'Residence type',
  yearsAtAddress: 'Years at address',
  monthlyRent: 'Monthly rent',
  employmentType: 'Employment type',
  employerName: 'Employer name',
  jobTitle: 'Job title',
  industry: 'Industry',
  yearsEmployed: 'Years employed',
  annualIncome: 'Annual income',
  monthlyIncome: 'Monthly income',
  employerPhone: 'Employer phone',
  retirementIncome: 'Retirement income',
  loanPurpose: 'Loan purpose',
  loanAmount: 'Loan amount',
  creditScoreRange: 'Credit score range',
  monthlyDebtPayments: 'Monthly debt payments',
  totalAssets: 'Total assets',
  preferredBankName: 'Preferred bank',
};

function formatValue(key, value) {
  if (value == null || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (key.toLowerCase().includes('income') || key === 'loanAmount' || key === 'monthlyRent' || key === 'totalAssets' || key === 'monthlyDebtPayments') {
    const num = Number(String(value).replace(/,/g, ''));
    if (Number.isFinite(num) && num > 0) return `₹${num.toLocaleString('en-IN')}`;
  }
  return String(value);
}

function pickFields(source, keys) {
  return keys
    .filter((key) => source[key] != null && source[key] !== '')
    .map((key) => ({
      key,
      label: LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()),
      value: formatValue(key, source[key]),
    }));
}

function field(data, camel, snake) {
  return data[camel] ?? data[snake];
}

/** Merge application row + nested data JSON into display sections for admin review. */
export function buildApplicationDetailSections(application) {
  const data = application?.data && typeof application.data === 'object' ? application.data : {};
  const fullName = application?.customer?.fullName || application?.customer?.full_name || '';
  const merged = {
    ...data,
    title: field(data, 'title', 'title'),
    firstName: field(data, 'firstName', 'first_name') || fullName.split(' ')[0],
    middleName: field(data, 'middleName', 'middle_name'),
    lastName: field(data, 'lastName', 'last_name') || fullName.split(' ').slice(1).join(' '),
    dateOfBirth: field(data, 'dateOfBirth', 'date_of_birth'),
    gender: field(data, 'gender', 'gender'),
    maritalStatus: field(data, 'maritalStatus', 'marital_status'),
    email: field(data, 'email', 'email') || application?.customer?.email || application?.customerEmail,
    phone: field(data, 'phone', 'phone'),
    aadhaar: field(data, 'aadhaar', 'aadhaar_number') || field(data, 'aadhaarNumber', 'aadhaar_number'),
    pan: field(data, 'pan', 'pan_number') || field(data, 'panNumber', 'pan_number'),
    addressLine1: field(data, 'addressLine1', 'address_line1'),
    addressLine2: field(data, 'addressLine2', 'address_line2'),
    city: field(data, 'city', 'city'),
    district: field(data, 'district', 'district'),
    state: field(data, 'state', 'state'),
    pinCode: field(data, 'pinCode', 'pin_code'),
    residenceType: field(data, 'residenceType', 'residence_type'),
    yearsAtAddress: field(data, 'yearsAtAddress', 'years_at_address'),
    monthlyRent: field(data, 'monthlyRent', 'monthly_rent'),
    employmentType: field(data, 'employmentType', 'employment_type'),
    employerName: field(data, 'employerName', 'employer_name'),
    jobTitle: field(data, 'jobTitle', 'job_title'),
    industry: field(data, 'industry', 'industry'),
    yearsEmployed: field(data, 'yearsEmployed', 'years_employed'),
    annualIncome: field(data, 'annualIncome', 'annual_income'),
    monthlyIncome: field(data, 'monthlyIncome', 'monthly_income'),
    employerPhone: field(data, 'employerPhone', 'employer_phone'),
    retirementIncome: field(data, 'retirementIncome', 'retirement_income'),
    loanAmount:
      field(data, 'loanAmount', 'loan_amount') ??
      field(data, 'requestedLoanAmount', 'requested_loan_amount') ??
      application?.loanAmount,
    loanPurpose:
      field(data, 'loanPurpose', 'loan_purpose') ?? application?.loanType ?? application?.loan_type,
    creditScoreRange: field(data, 'creditScoreRange', 'credit_score_range'),
    monthlyDebtPayments: field(data, 'monthlyDebtPayments', 'monthly_debt_payments'),
    totalAssets: field(data, 'totalAssets', 'total_assets'),
    preferredBankName: field(data, 'preferredBankName', 'preferred_bank_name'),
  };

  return [
    {
      title: 'Personal information',
      icon: 'User',
      fields: pickFields(merged, [
        'title', 'firstName', 'middleName', 'lastName', 'dateOfBirth', 'gender', 'maritalStatus',
        'email', 'phone', 'aadhaar', 'pan',
      ]),
    },
    {
      title: 'Address',
      icon: 'MapPin',
      fields: pickFields(merged, [
        'addressLine1', 'addressLine2', 'city', 'district', 'state', 'pinCode',
        'residenceType', 'yearsAtAddress', 'monthlyRent',
      ]),
    },
    {
      title: 'Employment',
      icon: 'Briefcase',
      fields: pickFields(merged, [
        'employmentType', 'employerName', 'jobTitle', 'industry', 'yearsEmployed',
        'annualIncome', 'monthlyIncome', 'employerPhone', 'retirementIncome',
      ]),
    },
    {
      title: 'Loan & financial',
      icon: 'IndianRupee',
      fields: pickFields(merged, [
        'loanPurpose', 'loanAmount', 'creditScoreRange', 'monthlyDebtPayments', 'totalAssets',
        'preferredBankName',
      ]),
    },
  ].filter((section) => section.fields.length > 0);
}

export function pickCustomerPhotoDocument(documents = []) {
  const priority = ['customer_photo', 'aadhaar_card', 'pan_card'];
  for (const type of priority) {
    const doc = documents.find(
      (d) => d.documentType === type && (d.mimeType || '').startsWith('image/'),
    );
    if (doc) return doc;
  }
  return documents.find((d) => (d.mimeType || '').startsWith('image/')) || null;
}
