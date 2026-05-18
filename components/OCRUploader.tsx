'use client';

import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';

interface OCRUploaderProps {
  onMedicineExtracted: (medicineName: string) => void;
}

export default function OCRUploader({ onMedicineExtracted }: OCRUploaderProps) {
  // STEP 2: State Variables
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // STEP 3: Image Selection Handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }

    // Save the image
    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // STEP 4: OCR Extraction Function
  const extractTextFromImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setProgress(0);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageSrc = event.target?.result as string;

        const worker = await Tesseract.createWorker('eng');

        worker.onProgress = (progress) => {
          setProgress(Math.round(progress.progress * 100));
        };

        const result = await worker.recognize(imageSrc);
        const text = result.data.text;

        setExtractedText(text);

        await worker.terminate();
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error('OCR Error:', error);
      alert('Failed to read text from image');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // STEP 5: Extract Medicine Name from OCR text
  const extractMedicineName = () => {
    if (!extractedText) return;

    const lines = extractedText.split('\n');

    let medicineName = '';
    for (const line of lines) {
      const cleaned = line.trim();
      if (cleaned.length > 2 && cleaned.length < 50) {
        medicineName = cleaned;
        break;
      }
    }

    if (medicineName) {
      onMedicineExtracted(medicineName);
      setSelectedImage(null);
      setPreview('');
      setExtractedText('');
    } else {
      alert('Could not find a medicine name. Please try again.');
    }
  };

  // STEP 6: Reset handler
  const handleReset = () => {
    setSelectedImage(null);
    setPreview('');
    setExtractedText('');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // STEP 7: UI
  return (
    <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📸 OCR Medicine Reader
      </h3>

      {!selectedImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-purple-400 rounded-lg p-8 text-center cursor-pointer hover:bg-purple-100 transition"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <div className="text-4xl mb-3">📷</div>
          <p className="text-gray-700 font-semibold">Click to upload medicine bottle image</p>
          <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <img
              src={preview}
              alt="Selected medicine"
              className="w-full max-h-64 object-contain rounded-lg border border-purple-300"
            />
          </div>

          {loading && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-700">Extracting text...</p>
                <p className="text-sm font-bold text-purple-600">{progress}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-linear-to-r from-purple-600 to-pink-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {extractedText && (
            <div className="mb-6 bg-white p-4 rounded-lg border border-purple-200 max-h-48 overflow-y-auto">
              <p className="text-sm font-semibold text-gray-700 mb-2">Extracted Text:</p>
              <p className="text-gray-700 text-sm whitespace-pre-wrap wrap-break-word">{extractedText}</p>
            </div>
          )}

          <div className="space-y-3">
            {!extractedText ? (
              <button
                onClick={extractTextFromImage}
                disabled={loading}
                className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? '⏳ Extracting...' : '✨ Extract Text from Image'}
              </button>
            ) : (
              <>
                <button
                  onClick={extractMedicineName}
                  className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  ✅ Use as Medicine Name
                </button>
                <button
                  onClick={() => setExtractedText('')}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Extract Again
                </button>
              </>
            )}
            <button
              onClick={handleReset}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded-lg transition"
            >
              Upload Different Image
            </button>
          </div>
        </>
      )}
    </div>
  );
}
