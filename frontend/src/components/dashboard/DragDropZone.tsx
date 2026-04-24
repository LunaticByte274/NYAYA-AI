"use client";

import React, { useState, useCallback, useRef, memo } from "react";
import { UploadCloud, FileCheck, AlertCircle, FileType } from "lucide-react";

/**
 * ==========================================================================
 * NYAYA AI - DRAG & DROP ZONE (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Secure File Ingestion & Tensor Mounting
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Vertical Rhythm Tightened: Dynamically scaled min-height and margins to prevent layout squishing.
 * 2. Extension Parsing Shield: Prevented '.undefined' bugs for extensionless Unix files.
 * 3. OS Drop Effect: Enforced dropEffect='copy' to bypass strict OS security cursors.
 * 4. React.memo() Isolation: Prevents UI stuttering during parent re-renders.
 * 5. GPU Acceleration: 'transform-gpu' applied to drag/drop scale physics.
 * 6. Stale Error Flushing: Instantly clears previous errors on new drag enter.
 * 7. Tabular-nums: Applied to file size calculation to prevent layout jitter.
 * 8. Deep Accessibility (A11y): Fully keyboard navigable with proper ARIA roles.
 * 9. Explicit DevTools Binding: Added displayName for precise profiling.
 * ==========================================================================
 */

// Enterprise-grade conditional styling utility (Inlined for standalone reliability)
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface DragDropZoneProps {
  onFileDrop: (file: File) => void;
  accept?: string;
  currentFile: File | null;
}

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const DragDropZone = memo(function DragDropZone({ 
  onFileDrop, 
  accept = ".csv", 
  currentFile 
}: DragDropZoneProps) {
  
  // --- STATE & REFS ---
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- VALIDATION ENGINE ---
  const validateAndProcessFile = useCallback((file: File) => {
    setLocalError(null);

    // 1. Strict Size Validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setLocalError(`Payload rejected: Exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    // 2. Extension Validation (Strict Parity Check with Unix Shield)
    if (accept && accept !== "*") {
      const fileNameParts = file.name.split('.');
      
      // Shield: Only pop an extension if a dot actually exists in the filename
      // If length is 1, the file has no extension (e.g. raw unix binary)
      if (fileNameParts.length <= 1) {
        setLocalError(`Invalid format. Expected: ${accept.toUpperCase()}`);
        return;
      }
      
      const fileExtension = `.${fileNameParts.pop()?.toLowerCase()}`;
      const acceptedExtensions = accept.split(',').map(ext => ext.trim().toLowerCase());
      
      // If accept contains strict extensions (e.g., '.csv'), enforce exact match
      if (acceptedExtensions.some(ext => ext.startsWith('.')) && !acceptedExtensions.includes(fileExtension)) {
        setLocalError(`Invalid format. Expected: ${accept.toUpperCase()}`);
        return;
      }
    }

    // Handshake Successful: Pass to Parent
    onFileDrop(file);
  }, [accept, onFileDrop]);

  // --- HARDWARE-ACCELERATED DRAG HANDLERS ---
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalError(null); // Instantly flush stale errors on new interaction
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // OS Shield: Explicitly tell the OS we are copying, not moving, the file
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Pass the first file exactly as it was dropped
      validateAndProcessFile(e.dataTransfer.files[0] as File);
      e.dataTransfer.clearData();
    }
  }, [validateAndProcessFile]);

  // --- INTERACTION HANDLERS (A11Y SAFE) ---
  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0] as File);
    }
    // Reset input value to allow re-uploading the exact same file if deleted
    if (inputRef.current) inputRef.current.value = '';
  }, [validateAndProcessFile]);

  // --- RENDER UTILS ---
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full flex flex-col gap-3 md:gap-4 min-h-0 shrink-0 flex-1">
      <div 
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter} 
        onDragLeave={handleDragLeave} 
        onDragOver={handleDragOver} 
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${accept} file. Maximum size ${MAX_FILE_SIZE_MB} megabytes.`}
        className={cn(
          "relative w-full flex-1 min-h-[130px] sm:min-h-[160px] xl:min-h-[190px] rounded-[24px] md:rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500 cursor-pointer overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 transform-gpu will-change-transform",
          isDragging 
            ? "border-indigo-500 bg-indigo-500/10 scale-[0.98] shadow-[inset_0_0_30px_rgba(79,70,229,0.2)]" 
            : currentFile
              ? "border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]"
              : "border-white/10 bg-black/40 hover:border-indigo-500/50 hover:bg-indigo-500/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
        )}
      >
        {/* Hidden Secure File Input - A11y locked */}
        <input 
          type="file" 
          accept={accept} 
          ref={inputRef}
          onChange={handleChange} 
          className="hidden" 
          aria-hidden="true"
          tabIndex={-1}
        />
        
        {/* Ambient Drag Glow Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none transition-opacity duration-500 transform-gpu",
          isDragging ? "opacity-100" : "opacity-0"
        )} aria-hidden="true" />
        
        <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none px-4 py-4 md:py-6 text-center w-full h-full">
          
          {/* Dynamic Target Icon - Rescaled for Vertical Rhythm */}
          <div className={cn(
            "w-12 h-12 md:w-14 md:h-14 rounded-[16px] md:rounded-[20px] flex items-center justify-center mb-3 md:mb-4 transition-all duration-500 border shadow-2xl transform-gpu",
            isDragging ? "bg-indigo-500/20 border-indigo-500/50 scale-110 text-indigo-400" 
            : currentFile ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            : "bg-white/5 border-white/10 text-slate-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 group-hover:text-indigo-400 group-hover:scale-110"
          )}>
            {currentFile ? <FileCheck className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" /> : <UploadCloud className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />}
          </div>
          
          {/* Contextual Typography */}
          {currentFile ? (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center w-full">
              <p className="text-sm md:text-base lg:text-lg font-black text-emerald-400 uppercase tracking-widest mb-2 line-clamp-1 max-w-[90%] break-all">
                {currentFile.name}
              </p>
              <div className="flex items-center gap-3 text-[10px] text-emerald-500/70 font-mono font-bold uppercase tracking-widest tabular-nums">
                <span className="flex items-center gap-1.5"><FileType className="w-3 h-3" aria-hidden="true" /> {currentFile.name.split('.').pop() || 'FILE'}</span>
                <span className="opacity-50">•</span>
                <span>{formatFileSize(currentFile.size)}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center transition-opacity duration-300">
              <p className="text-xs md:text-sm lg:text-base font-black text-white uppercase tracking-[0.2em] mb-1 transition-colors group-hover:text-indigo-100 drop-shadow-md">
                {isDragging ? "Release to Inject" : `Inject ${accept.toUpperCase()} Dataset`}
              </p>
              <p className="text-[9px] md:text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] transition-colors group-hover:text-slate-400">
                Drag & Drop or Click to Browse
              </p>
              <div className="mt-3 px-3 py-1 bg-[#020205] rounded-lg border border-white/10 text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-widest shadow-inner tabular-nums">
                Max Payload: {MAX_FILE_SIZE_MB}MB
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Local Strict Validation Error Banner */}
      {localError && (
        <div 
          role="alert" 
          className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 animate-in fade-in slide-in-from-top-2 duration-300 shadow-inner shrink-0"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-relaxed break-words">{localError}</p>
        </div>
      )}
    </div>
  );
});

// Explicit DevTools Binding
DragDropZone.displayName = "DragDropZone";