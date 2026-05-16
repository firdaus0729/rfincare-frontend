import React, { useRef, useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const ConsentSignatureForm = ({ formData, errors, onChange, onSignatureChange }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onSignatureChange(dataUrl);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    onSignatureChange('');
  };

  const fullName = [formData?.firstName, formData?.middleName, formData?.lastName].filter(Boolean).join(' ');

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="p-4 md:p-6 bg-muted rounded-lg border border-border">
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon name="PenLine" size={20} className="text-primary" />
          Final Consent &amp; Signature
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          By signing below, I, <strong className="text-foreground">{fullName || 'the applicant'}</strong>, confirm that
          all information provided in this assessment is true and complete, and I authorize Rfincare and partner
          lenders to process my pre-qualification request.
        </p>

        <Checkbox
          label="I confirm this is my electronic signature and I agree to submit my application"
          description="Your signature has the same legal effect as a handwritten signature for this pre-qualification"
          checked={formData?.consentSignatureAgreed}
          onChange={(e) => onChange('consentSignatureAgreed', e?.target?.checked)}
          error={errors?.consentSignatureAgreed}
          required
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Draw your signature below <span className="text-destructive">*</span>
          </label>
          <button
            type="button"
            onClick={clearSignature}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <Icon name="Eraser" size={14} />
            Clear
          </button>
        </div>
        <div
          className={`relative rounded-lg border-2 bg-white overflow-hidden ${
            errors?.customerSignature ? 'border-destructive' : 'border-border'
          }`}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-40 md:h-48 touch-none cursor-crosshair"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
          {!formData?.customerSignature && (
            <p className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground pointer-events-none">
              Sign here with mouse or finger
            </p>
          )}
        </div>
        {errors?.customerSignature && (
          <p className="text-xs text-destructive">{errors.customerSignature}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-muted-foreground">
            Clicking &quot;Submit Application&quot; will finalize your pre-qualification assessment. You can track
            status and upload additional documents from your customer dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentSignatureForm;
