'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Camera, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { getFallbackImageUrl } from '@/lib/image-utils';

interface ProviderHeroImageProps {
  providerId: string | number;
  existingImageUrl?: string;
  onImageUpdated?: (imageUrl: string) => void;
}

export function ProviderHeroImage({
  providerId,
  existingImageUrl,
  onImageUpdated,
}: ProviderHeroImageProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  // Reset image error on new preview URL
  React.useEffect(() => {
    if (previewUrl) {
      setImageError(false);
    }
  }, [previewUrl]);

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type", {
          description: "Please select an image file (JPEG, PNG, etc.)",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Image must be less than 5MB",
        });
        return;
      }
      
      setSelectedImage(file);
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
    }
  }, [toast]);

  // Reset the file selection
  const handleCancel = useCallback(() => {
    setSelectedImage(null);
    // Keep the existing image if available
    setPreviewUrl(existingImageUrl || null);
    // Reset progress
    setUploadProgress(0);
  }, [existingImageUrl]);

  // Upload the image
  const handleUpload = useCallback(async () => {
    if (!selectedImage || !providerId) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', selectedImage);
      
      // Fall back to server-side handling which proxies the upload
      console.log('Using server-side upload to avoid CORS issues');
      const uploadResponse = await fetch(`/api/providers/${providerId}/hero-image/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      // Get the response which includes the publicUrl
      const responseData = await uploadResponse.json();
      const { publicUrl } = responseData;
      
      setUploadProgress(100);
      
      // Success! Update the UI
      toast.success("Image uploaded successfully", {
        description: "Your hero image has been updated",
      });
      
      // Update parent component if callback provided
      if (onImageUpdated) {
        onImageUpdated(publicUrl);
      }
      
      // Reset state
      setSelectedImage(null);
      setPreviewUrl(publicUrl);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [providerId, selectedImage, toast, onImageUpdated]);

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="pt-6">
        <div className="mb-4">
          <Label htmlFor="hero-image" className="text-base mb-2 block font-medium">
            Hero Image
          </Label>
          <p className="text-sm text-muted-foreground mb-4">
            This image will be displayed at the top of your provider profile.
            Upload a high-quality image that represents your services.
          </p>
        </div>
        
        {/* Image Preview Area */}
        <div className="relative border border-dashed border-gray-300 rounded-lg mb-4 aspect-[16/9] overflow-hidden bg-gray-50">
          {previewUrl && !imageError ? (
            <div className="relative w-full h-full">
              <Image 
                src={previewUrl} 
                alt="Hero image preview" 
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                unoptimized // Skip the Image Optimization API to avoid caching issues
              />
              {!isUploading && (
                <button 
                  onClick={handleCancel}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-all"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <Camera className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 text-center">
                {imageError 
                  ? "Failed to load image. Please select a new one."
                  : "Upload your hero image by selecting a file or dragging and dropping"
                }
              </p>
            </div>
          )}
          
          {/* Upload Progress Indicator */}
          {isUploading && uploadProgress > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col">
              <Loader2 className="h-8 w-8 text-white animate-spin mb-2" />
              <div className="w-2/3 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-white mt-2 text-sm font-medium">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
        
        {/* File Selection Input */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <Label 
              htmlFor="hero-image" 
              className="cursor-pointer w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <Upload className="h-4 w-4 mr-2" />
              {previewUrl ? 'Change image' : 'Select image'}
            </Label>
            <input
              id="hero-image"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="sr-only"
              disabled={isUploading}
            />
          </div>
          
          {selectedImage && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isUploading}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 sm:flex-none"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}