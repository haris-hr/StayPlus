"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Upload, Link as LinkIcon, X, Image as ImageIcon, Maximize2, Minimize2 } from "lucide-react";
import { Input } from "./Input";

type ObjectFit = "cover" | "contain";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
  placeholder?: string;
  previewHeight?: string;
  previewOverlay?: React.ReactNode;
  className?: string;
  /** Default object-fit mode for the preview */
  defaultObjectFit?: ObjectFit;
  /** Show toggle to switch between cover/contain */
  showFitToggle?: boolean;
}

const ImageUpload = ({
  value,
  onChange,
  label,
  hint,
  placeholder = "https://images.unsplash.com/...",
  previewHeight = "h-40",
  previewOverlay,
  className,
  defaultObjectFit = "cover",
  showFitToggle = true,
}: ImageUploadProps) => {
  const [mode, setMode] = useState<"url" | "upload">(() =>
    value?.startsWith("data:") ? "upload" : "url"
  );
  const [isDragging, setIsDragging] = useState(false);
  const [objectFit, setObjectFit] = useState<ObjectFit>(defaultObjectFit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If the controlled value changes to/from a data URL, keep the UI mode in sync.
  useEffect(() => {
    if (!value) return;
    if (value.startsWith("data:") && mode !== "upload") setMode("upload");
    if (!value.startsWith("data:") && mode !== "url") setMode("url");
  }, [value, mode]);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Convert to base64 for preview (in production, you'd upload to a server/cloud storage)
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
        setMode("upload");
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleObjectFit = () => {
    setObjectFit((prev) => (prev === "cover" ? "contain" : "cover"));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      {/* Mode Toggle */}
      <div className="flex gap-1 p-1 bg-surface-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            mode === "url"
              ? "bg-white text-foreground shadow-sm"
              : "text-foreground/60 hover:text-foreground"
          )}
        >
          <LinkIcon className="w-4 h-4" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            mode === "upload"
              ? "bg-white text-foreground shadow-sm"
              : "text-foreground/60 hover:text-foreground"
          )}
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>

      {/* URL Input */}
      {mode === "url" && (
        <Input
          value={value?.startsWith("data:") ? "" : value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}

      {/* File Upload */}
      {mode === "upload" && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary-500 bg-primary-50"
              : "border-surface-300 hover:border-surface-400 hover:bg-surface-50"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <Upload
            className={cn(
              "w-8 h-8 mx-auto mb-2",
              isDragging ? "text-primary-500" : "text-foreground/40"
            )}
          />
          <p className="text-sm text-foreground/70">
            <span className="font-medium text-primary-600">Click to upload</span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-foreground/50 mt-1">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      )}

      {hint && <p className="text-xs text-foreground/50">{hint}</p>}

      {/* Preview */}
      {value && (
        <div 
          className={cn(
            "relative rounded-xl overflow-hidden",
            objectFit === "contain" ? "bg-surface-900" : "bg-surface-100",
            previewHeight
          )}
        >
          <Image
            src={value}
            alt="Preview"
            fill
            className={cn(
              objectFit === "cover" ? "object-cover" : "object-contain"
            )}
            onError={() => {
              // Handle broken images gracefully
            }}
          />
          {/* Only show overlay when using cover mode */}
          {objectFit === "cover" && previewOverlay}
          
          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex gap-1.5">
            {showFitToggle && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleObjectFit();
                }}
                className="p-1.5 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                aria-label={objectFit === "cover" ? "Show full image" : "Fill preview"}
                title={objectFit === "cover" ? "Show full image" : "Fill preview"}
              >
                {objectFit === "cover" ? (
                  <Minimize2 className="w-4 h-4 text-white" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-white" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="p-1.5 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!value && mode === "url" && (
        <div className={cn("flex items-center justify-center bg-surface-50 rounded-xl border-2 border-dashed border-surface-200", previewHeight)}>
          <div className="text-center text-foreground/40">
            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No image</p>
          </div>
        </div>
      )}
    </div>
  );
};

export { ImageUpload };
