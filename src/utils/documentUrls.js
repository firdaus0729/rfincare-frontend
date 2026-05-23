import { getApiBaseUrl } from '../lib/runtimeConfig';

/** Public static URL for uploaded files (images served from /uploads). */
export function getDocumentPreviewUrl(doc) {
  if (!doc) return null;
  if (doc.previewUrl) {
    const base = getApiBaseUrl().replace(/\/$/, '');
    return doc.previewUrl.startsWith('http') ? doc.previewUrl : `${base}${doc.previewUrl}`;
  }
  if (doc.filePath) {
    const name = doc.filePath.split(/[/\\]/).pop();
    if (name) {
      const base = getApiBaseUrl().replace(/\/$/, '');
      return `${base}/uploads/${name}`;
    }
  }
  return null;
}

export const DOCUMENT_TYPE_LABELS = {
  customer_photo: 'Customer photo',
  pan_card: 'PAN card',
  aadhaar_card: 'Aadhaar card',
  income_proof: 'Income proof',
  identity_proof: 'Identity proof',
  address_proof: 'Address proof',
  bank_statement: 'Bank statement',
};

export function documentTypeLabel(type) {
  return DOCUMENT_TYPE_LABELS[type] || String(type || 'Document').replace(/_/g, ' ');
}
