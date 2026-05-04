'use client';

import { useState } from 'react';
import Link from 'next/link';
import OCRUploader from '@/components/OCRUploader';

export default function AddMedicinePage() {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    time: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOCR, setShowOCR] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMedicineExtracted = (medicineName: string) => {
    setFormData((prev) => ({
      ...prev,
      name: medicineName,
    }));
    setShowOCR(false);
    setSuccess('✨ Medicine name extracted from image!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.name || !formData.dosage || !formData.time) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/medicines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add medicine');
      }

      setSuccess('Medicine added successfully!');
      setFormData({ name: '', dosage: '', time: '' });

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto mt-16">
        <div className="bg-white rounded-xl shadow-2xl p-8 border-t-4 border-blue-600">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">💊 Add Medicine</h1>
          <p className="text-gray-600 mb-8">Track your daily medications</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* OCR Uploader */}
          {showOCR && (
            <div className="mb-6">
              <OCRUploader onMedicineExtracted={handleMedicineExtracted} />
              <button
                onClick={() => setShowOCR(false)}
                className="w-full mt-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
              >
                Cancel OCR
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Medicine Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                Medicine Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Aspirin"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400 bg-gray-50 hover:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowOCR(!showOCR)}
                className="mt-2 w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                📸 {showOCR ? 'Hide OCR' : 'Use OCR Camera'}
              </button>
            </div>

            {/* Dosage */}
            <div>
              <label htmlFor="dosage" className="block text-sm font-bold text-gray-700 mb-2">
                Dosage *
              </label>
              <input
                type="text"
                id="dosage"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g., 500mg"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400 bg-gray-50 hover:bg-white transition"
              />
            </div>

            {/* Time */}
            <div>
              <label htmlFor="time" className="block text-sm font-bold text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-gray-50 hover:bg-white transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 shadow-lg mt-6"
            >
              {loading ? 'Adding...' : '✓ Add Medicine'}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center">
            <Link href="/dashboard" className="block text-blue-600 hover:text-blue-800 font-medium">
              View Dashboard
            </Link>
            <Link href="/" className="block text-gray-600 hover:text-gray-800">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
