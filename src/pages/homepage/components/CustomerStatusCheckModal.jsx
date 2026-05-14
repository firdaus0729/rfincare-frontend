import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CustomerStatusCheckModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    applicationNumber: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/customer-dashboard');
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scale-in">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">Check Application Status</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Application Number"
            type="text"
            placeholder="Enter your application number"
            value={formData?.applicationNumber}
            onChange={(e) => setFormData({ ...formData, applicationNumber: e?.target?.value })}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={formData?.email}
            onChange={(e) => setFormData({ ...formData, email: e?.target?.value })}
            required
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="flex-1"
              iconName="Search"
              iconPosition="left"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Check Status'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Don't have an application yet?
            </p>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => {
                onClose();
                navigate('/customer-assessment-portal');
              }}
            >
              Apply Now
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerStatusCheckModal;