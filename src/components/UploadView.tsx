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
import { motion, AnimatePresence } from "motion/react";


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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-zinc-800 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {!showWebcam ? (
          <div
            className={cn(
              "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all duration-500 relative z-10",
              isDragging
                ? "border-emerald-500 bg-emerald-500/10 scale-[0.98] shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                : "border-emerald-500/20 bg-emerald-500/5",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="bg-emerald-500/20 text-emerald-400 p-5 rounded-2xl mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              <UploadCloud size={40} />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Upload or <span className="text-emerald-500">Capture</span>
            </h1>
            
            <p className="text-zinc-400 text-sm mb-8 max-w-sm leading-relaxed">
              Drag and drop a clear photo of a plant leaf, stem, or fruit.
              <span className="block mt-1 text-zinc-500 italic">Supported: JPG, PNG, HEIC</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
              >
                <ImageIcon size={20} />
                Browse Files
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowWebcam(true)}
                className="flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-200 px-8 py-4 rounded-2xl font-bold transition-all"
              >
                <Camera size={20} />
                Take Photo
              </motion.button>
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center relative z-10"
          >
            <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video mb-6 border border-zinc-800 shadow-2xl">
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
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={capturePhoto}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-full font-bold transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2"
            >
              <Camera size={24} />
              Capture Photo
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Sun, text: "Ensure good lighting" },
          { icon: Focus, text: "Focus on symptoms" },
          { icon: ScanLine, text: "Keep leaf flat" }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="bg-zinc-900/40 backdrop-blur-sm p-4 rounded-2xl border border-zinc-800/50 shadow-sm flex items-center gap-4 group hover:border-emerald-500/30 transition-colors"
          >
            <div className="text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
              <item.icon size={22} />
            </div>
            <span className="text-sm font-semibold text-zinc-300">
              {item.text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
