import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface CategoryImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (file: File | null) => void;
  disabled?: boolean;
}

export default function CategoryImageUpload({ 
  currentImageUrl, 
  onImageChange, 
  disabled = false 
}: CategoryImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700">Category Image</div>
      
      {/* Image Preview */}
      {previewUrl && (
        <div className="relative w-32 h-32 border border-gray-200 rounded-lg overflow-hidden">
          <img
            src={previewUrl}
            alt="Category preview"
            className="w-full h-full object-cover"
          />
          {!disabled && (
            <button
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Upload Button */}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          disabled={disabled}
          className="w-full"
        >
          {previewUrl ? 'Change Image' : 'Upload Image'}
        </Button>
        
        <p className="text-xs text-gray-500">
          Recommended: 800x600px, max 5MB. Supported formats: JPG, PNG, WebP
        </p>
      </div>
    </div>
  );
}
