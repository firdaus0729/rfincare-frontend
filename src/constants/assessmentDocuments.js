export const APPLICANT_DOCUMENTS = [
  {
    type: 'customer_photo',
    label: 'Customer photo',
    description: 'Recent passport-size photo (JPG or PNG, face clearly visible)',
    icon: 'User',
  },
  {
    type: 'pan_card',
    label: 'PAN Card',
    description: 'Clear photo or PDF of PAN card',
    icon: 'CreditCard',
  },
  {
    type: 'aadhaar_card',
    label: 'Aadhaar Card',
    description: 'Front side of Aadhaar (mask last 4 digits if preferred)',
    icon: 'Contact',
  },
  {
    type: 'income_proof',
    label: 'Income Proof',
    description: 'Salary slip, ITR, or last 3 months bank statement',
    icon: 'FileText',
  },
];

export const CO_APPLICANT_DOC_PREFIX = 'co_applicant_';

export function coApplicantDocType(baseType) {
  return `${CO_APPLICANT_DOC_PREFIX}${baseType}`;
}

export function requiresCoApplicant(employmentType) {
  return employmentType === 'retired';
}

export function normalizeDynamicDocumentRequirements(requirements = []) {
  if (!Array.isArray(requirements) || !requirements.length) return APPLICANT_DOCUMENTS;
  return requirements.map((item, index) => ({
    type: item.documentType,
    label: item.title || item.documentType,
    description: item.subtitle || '',
    icon: item.icon || 'FileText',
    allowedFileTypes: item.allowedFileTypes || [],
    sortOrder: Number(item.sortOrder ?? index),
    isRequired: item.isRequired !== false,
  }));
}

/** All document type keys required for the current applicant profile. */
export function getRequiredDocumentTypes(employmentType, requirements = APPLICANT_DOCUMENTS) {
  const base = requirements.filter((d) => d.isRequired !== false).map((d) => d.type);
  if (!requiresCoApplicant(employmentType)) return base;
  return [...base, ...base.map(coApplicantDocType)];
}
