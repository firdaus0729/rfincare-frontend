import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { customerJourneyService } from '../../../services/customerJourneyService';
import DocumentPreviewModal from './DocumentPreviewModal';

const REQUIRED_DOCS = [
  { type: 'pan_card', label: 'PAN Card', description: 'Clear photo or PDF of your PAN card', icon: 'CreditCard' },
  { type: 'aadhaar_card', label: 'Aadhaar Card', description: 'Front side of Aadhaar (mask last 4 digits if preferred)', icon: 'Contact' },
  { type: 'income_proof', label: 'Income Proof', description: 'Salary slip, ITR, or last 3 months bank statement', icon: 'FileText' },
];

const DocumentUploadStep = ({ applicationId, uploadedDocs, onUploaded, errors }) => {
  const fileRefs = useRef({});
  const localPreviewUrls = useRef({});
  const [uploading, setUploading] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  const serverDocsSynced = useRef(false);

  useEffect(() => {
    serverDocsSynced.current = false;
  }, [applicationId]);

  useEffect(() => {
    if (!applicationId || serverDocsSynced.current) return;
    let cancelled = false;
    (async () => {
      const { data: docs } = await customerJourneyService.getMyDocuments(applicationId);
      if (cancelled) return;
      serverDocsSynced.current = true;
      if (!docs?.length) return;
      docs.forEach((doc) => {
        const docType = doc.documentType;
        if (!docType) return;
        onUploaded(docType, {
          id: doc.id,
          documentName: doc.documentName,
          documentType: docType,
          mimeType: doc.mimeType,
        });
      });
    })();
    return () => { cancelled = true; };
  }, [applicationId, onUploaded]);

  useEffect(() => () => {
    Object.values(localPreviewUrls.current).forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
  }, []);

  const handleFileSelect = async (docType, event) => {
    const file = event.target.files?.[0];
    if (!file || !applicationId) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setUploadError('Please upload JPG, PNG, or PDF files only.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be under 10 MB.');
      return;
    }

    setUploadError('');
    setUploading(docType);
    const { data, error } = await customerJourneyService.uploadDocument(file, {
      applicationId,
      documentType: docType,
    });
    setUploading(null);

    if (error) {
      setUploadError(error?.response?.data?.error || error?.message || 'Upload failed. Please try again.');
      return;
    }

    if (localPreviewUrls.current[docType]) {
      URL.revokeObjectURL(localPreviewUrls.current[docType]);
    }
    const localPreviewUrl = URL.createObjectURL(file);
    localPreviewUrls.current[docType] = localPreviewUrl;

    onUploaded(docType, {
      id: data?.id,
      documentName: data?.documentName || file.name,
      documentType: docType,
      mimeType: data?.mimeType || file.type,
      localPreviewUrl,
    });
  };

  const openPreview = (doc, label) => {
    setPreviewDoc({ ...doc, label });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 md:p-6 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Upload" size={22} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">Upload Required Documents</h3>
            <p className="text-sm text-muted-foreground">
              Upload clear copies of the documents below. Accepted formats: JPG, PNG, PDF (max 10 MB each).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {REQUIRED_DOCS.map((doc) => {
          const uploaded = uploadedDocs?.[doc.type];
          const isUploading = uploading === doc.type;

          return (
            <div
              key={doc.type}
              className={`feature-card border-2 transition-colors ${
                uploaded ? 'border-success/40 bg-success/5' : errors?.[doc.type] ? 'border-destructive/40' : 'border-border'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={doc.icon} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{doc.label}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{doc.description}</p>
                    {uploaded && (
                      <p className="text-xs text-success mt-2 flex items-center gap-1">
                        <Icon name="CheckCircle2" size={14} />
                        {uploaded.documentName}
                      </p>
                    )}
                    {errors?.[doc.type] && (
                      <p className="text-xs text-destructive mt-1">{errors[doc.type]}</p>
                    )}
                  </div>
                </div>

                <input
                  ref={(el) => { fileRefs.current[doc.type] = el; }}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileSelect(doc.type, e)}
                />
                <div className="flex flex-col sm:flex-row gap-2 sm:w-auto w-full">
                  {uploaded && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      iconName="Eye"
                      onClick={() => openPreview(uploaded, doc.label)}
                      className="sm:flex-1"
                    >
                      View
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant={uploaded ? 'outline' : 'default'}
                    size="sm"
                    loading={isUploading}
                    iconName={uploaded ? 'RefreshCw' : 'Upload'}
                    onClick={() => fileRefs.current[doc.type]?.click()}
                    className="sm:flex-1"
                  >
                    {isUploading ? 'Uploading...' : uploaded ? 'Replace' : 'Upload'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {uploadError && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-3">
          {uploadError}
        </p>
      )}

      <DocumentPreviewModal
        isOpen={Boolean(previewDoc)}
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
};

export default DocumentUploadStep;
