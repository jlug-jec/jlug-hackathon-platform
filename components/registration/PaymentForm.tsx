"use client";
import { useEffect, useState } from 'react';
import { toast } from "sonner";
import { uploadToCloudinary } from '@/lib/cloudinary';

interface PaymentFormProps {
  data: any;
  onChange: (data: any) => void;
  onValidityChange: (isValid: boolean) => void;
}

export function PaymentForm({ data, onChange, onValidityChange }: PaymentFormProps) {
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    onValidityChange(!!data.paymentScreenshot);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onValidityChange(false);
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      onChange({ paymentScreenshot: url });
      onValidityChange(true);
      toast.success('Screenshot uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      onValidityChange(false);
      toast.error('Failed to upload screenshot');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white text-xl font-semibold mb-4">Registration Fee: ₹300</h3>
        <img
          src="/qr-code-placeholder.png"
          alt="Payment QR Code"
          className="mx-auto w-48 h-48 bg-white/10 rounded-lg mb-4"
        />
        <p className="text-white text-sm mb-2">Scan the QR code to make the payment</p>
        <div className="bg-white/5 rounded-lg p-3 mb-4 mx-auto max-w-xs">
          <p className="text-white/90 text-sm font-medium">Amount to Pay: ₹300</p>
          <p className="text-white/70 text-xs mt-1">Please pay the exact amount</p>
        </div>
        <p className="text-yellow-400 text-sm mb-6 italic">
          Note: Additional charges may apply for food and refreshments on the Hackathon day.
        </p>
      </div>
      <div>
        <label className="block text-white text-sm font-medium mb-2">Upload Payment Screenshot</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-white/10 file:text-white hover:file:bg-white/20"
        />
        {isUploading && (
          <p className="text-white text-sm mt-2">Uploading screenshot...</p>
        )}
        {data.paymentScreenshot && (
          <div className="mt-4">
            <p className="text-green-400 text-sm">Screenshot uploaded successfully!</p>
            <img 
              src={data.paymentScreenshot} 
              alt="Payment Screenshot" 
              className="mt-2 max-w-xs rounded-lg border border-white/10"
            />
          </div>
        )}
      </div>
    </div>
  );
}