
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFile(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string);
        onImageUpload(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mt-2">
      <AnimatePresence mode="wait">
        {previewImage ? (
          <motion.div 
            className="relative w-full rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="aspect-square w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-lg overflow-hidden">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 rounded-full w-6 h-6"
              onClick={clearImage}
            >
              <X className="w-3 h-3" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className={`glass flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed 
              ${isDragging ? 'border-primary' : 'border-border'} 
              cursor-pointer transition-all`}
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center p-4 text-center">
              <div className={`mb-2 rounded-full p-3 ${isDragging ? 'bg-primary/20' : 'bg-secondary'}`}>
                {isDragging ? (
                  <Upload className="w-5 h-5 text-primary animate-pulse" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm font-medium mb-1">
                {isDragging ? 'Solte a imagem aqui' : 'Arraste uma imagem ou clique para fazer upload'}
              </p>
              <p className="text-xs text-muted-foreground">
                Suporta JPG, PNG ou GIF
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileInput}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
