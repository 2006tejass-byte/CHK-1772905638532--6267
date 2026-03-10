import React, { useState, useRef, useCallback } from "react";
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Sun,
  Focus,
  ScanLine,
  X,
} from "lucide-react";
import Webcam from "react-webcam";
import { cn } from "../lib/utils";

interface UploadViewProps {
  onImageSelected: (base64Image: string) => void;
}

export function UploadView({ onImageSelected }: UploadViewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelected(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onImageSelected(imageSrc);
      setShowWebcam(false);
    }
  }, [webcamRef, onImageSelected]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        {!showWebcam ? (
          <div
            className={cn(
              "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-colors duration-200",
              isDragging
                ? "border-emerald-500 bg-emerald-50/50"
                : "border-emerald-200 bg-emerald-50/20",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full mb-6">
              <UploadCloud size={32} />
            </div>

            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Upload or Capture Image
            </h2>
            <p className="text-slate-500 text-sm mb-8 max-w-sm">
              Drag and drop a clear photo of a plant leaf, stem, or fruit.
              Supported formats: JPG, PNG, HEIC.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <ImageIcon size={20} />
                Browse Files
              </button>
              <button
                onClick={() => setShowWebcam(true)}
                className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors shadow-sm"
              >
                <Camera size={20} />
                Take Photo
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video mb-6">
              {/* @ts-ignore */}
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setShowWebcam(false)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <button
              onClick={capturePhoto}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-md flex items-center gap-2"
            >
              <Camera size={20} />
              Capture
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="text-emerald-500 bg-emerald-50 p-2 rounded-lg">
            <Sun size={24} />
          </div>
          <span className="text-sm font-medium text-slate-700">
            Ensure good lighting
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="text-emerald-500 bg-emerald-50 p-2 rounded-lg">
            <Focus size={24} />
          </div>
          <span className="text-sm font-medium text-slate-700">
            Focus on the symptoms
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="text-emerald-500 bg-emerald-50 p-2 rounded-lg">
            <ScanLine size={24} />
          </div>
          <span className="text-sm font-medium text-slate-700">
            Keep leaf flat
          </span>
        </div>
      </div>
    </div>
  );
}
