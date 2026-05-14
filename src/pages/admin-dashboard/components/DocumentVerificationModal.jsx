import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';


const DocumentVerificationModal = ({ application, isOpen, onClose, onApprove, onReject }) => {
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const documents = [
    { id: 1, name: 'Aadhaar Card', status: 'verified', uploadedAt: '2026-02-10' },
    { id: 2, name: 'PAN Card', status: 'verified', uploadedAt: '2026-02-10' },
    { id: 3, name: 'Income Proof', status: 'pending', uploadedAt: '2026-02-12' },
    { id: 4, name: 'Bank Statement', status: 'verified', uploadedAt: '2026-02-11' },
    { id: 5, name: 'Address Proof', status: 'pending', uploadedAt: '2026-02-13' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      verified: { bg: 'bg-success/10', text: 'text-success', icon: 'CheckCircle' },
      pending: { bg: 'bg-warning/10', text: 'text-warning', icon: 'Clock' },
      rejected: { bg: 'bg-destructive/10', text: 'text-destructive', icon: 'XCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold ${config?.bg} ${config?.text}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const handleApprove = () => {
    onApprove(application?.id, reviewNotes);
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason?.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    onReject(application?.id, rejectionReason);
    onClose();
  };

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-border p-4 md:p-6 flex items-center justify-between sticky top-0 bg-card z-10">
          <div className="flex items-center space-x-4">
            <Image
              src={application?.customerImage}
              alt={application?.customerImageAlt}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-foreground">{application?.customerName}</h2>
              <p className="text-sm text-muted-foreground">{application?.id}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Application Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Loan Type</p>
              <p className="text-sm font-semibold text-foreground">{application?.loanType}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-sm font-semibold text-foreground">${application?.amount?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bank</p>
              <p className="text-sm font-semibold text-foreground">{application?.bankName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-semibold text-foreground">{application?.date}</p>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Documents</h3>
            <div className="space-y-3">
              {documents?.map((doc) => (
                <div key={doc?.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="FileText" size={20} color="var(--color-primary)" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{doc?.name}</p>
                      <p className="text-xs text-muted-foreground">Uploaded: {doc?.uploadedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(doc?.status)}
                    <Button variant="ghost" size="sm" iconName="Eye">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Notes */}
          {!showRejectForm ? (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Review Notes (Optional)</label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="Add any notes about this application..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Rejection Reason *</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="Provide a detailed reason for rejection..."
                required
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-border">
            {!showRejectForm ? (
              <>
                <Button variant="outline" fullWidth onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  fullWidth 
                  iconName="X"
                  onClick={() => setShowRejectForm(true)}
                >
                  Reject Application
                </Button>
                <Button 
                  variant="success" 
                  fullWidth 
                  iconName="Check"
                  onClick={handleApprove}
                >
                  Approve Application
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason('');
                  }}
                >
                  Back
                </Button>
                <Button 
                  variant="destructive" 
                  fullWidth 
                  iconName="X"
                  onClick={handleReject}
                >
                  Confirm Rejection
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentVerificationModal;
