'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { generateClientDropzoneAccept } from 'uploadthing/client';

export const useUploadThingHook = () => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true);
      // Handle file upload here
      console.log(acceptedFiles);
      // You'll need to implement the actual upload logic here
      return acceptedFiles;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image']),
  });

  return {
    startUpload: onDrop,
    isUploading,
    getRootProps,
    getInputProps,
  };
}; 