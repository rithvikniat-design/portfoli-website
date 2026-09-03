"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      setProgress(0);
      setError("");

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((p) => Math.min(p + 10, 90));
        }, 200);

        const res = await fetch("/api/media", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        setProgress(100);

        if (!res.ok) {
          throw new Error("Upload failed");
        }

        const media = await res.json();
        onChange(media.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div>
      <label className="admin-label">{label}</label>

      {value ? (
        <div className="relative group w-full max-w-xs">
          <div className="aspect-[2/3] rounded-lg overflow-hidden bg-charcoal-800 border border-charcoal-600">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-charcoal-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <button
                type="button"
                className="px-3 py-1.5 bg-charcoal-700 text-white text-xs rounded-lg hover:bg-charcoal-600 transition-colors"
              >
                Replace
              </button>
            </div>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="px-3 py-1.5 bg-red-600/80 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-gold-400 bg-gold-400/5"
              : "border-charcoal-600 hover:border-charcoal-500 bg-charcoal-800/50"
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={24} className="animate-spin text-gold-400" />
              <div className="w-48 bg-charcoal-700 rounded-full h-1.5">
                <div
                  className="bg-gold-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-charcoal-400">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {isDragActive ? (
                <Upload size={24} className="text-gold-400" />
              ) : (
                <ImageIcon size={24} className="text-charcoal-500" />
              )}
              <div>
                <p className="text-sm text-charcoal-300">
                  {isDragActive
                    ? "Drop image here"
                    : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-charcoal-500 mt-1">
                  PNG, JPG, WebP up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
    </div>
  );
}
