'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Medicine } from '@/lib/supabase';
import { useReminder, triggerTestNotification } from '@/lib/useReminder';

export default function DashboardPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextMedicine, setNextMedicine] = useState<Medicine | null>(null);

  // Use reminder hook
  const reminder = useReminder(medicines);

  // Fetch medicines on component mount
  useEffect(() => {
    fetchMedicines();
  }, []);

  // Update next medicine every minute
  useEffect(() => {
    const interval = setInterval(() => {
      updateNextMedicine();
    }, 60000); // Update every minute

    updateNextMedicine(); // Initial call
    return () => clearInterval(interval);
  }, [medicines]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/medicines');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch medicines');
      }

      setMedicines(data.data || []);
      updateNextMedicine();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateNextMedicine = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Find the next medicine due
    const upcomingMedicines = medicines.filter((med) => med.time >= currentTime);
    setNextMedicine(upcomingMedicines.length > 0 ? upcomingMedicines[0] : null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) {
      return;
    }

    try {
      const response = await fetch('/api/medicines', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete medicine');
      }

      // Refresh medicines list
      fetchMedicines();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete medicine');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-5xl mx-auto mt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-5xl font-bold text-gray-800">📊 Dashboard</h1>
            <p className="text-gray-600 mt-2 text-lg">Manage your daily medicines</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/add-medicine"
              className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-3 rounded-lg transition transform hover:scale-105 shadow-lg"
            >
              ➕ Add Medicine
            </Link>
            <Link
              href="/pharmacy"
              className="bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-6 py-3 rounded-lg transition transform hover:scale-105 shadow-lg"
            >
              📍 Find Pharmacy
            </Link>
          </div>
        </div>

        {/* Next Medicine Alert */}
        {nextMedicine && (
          <div className="mb-8 p-6 bg-linear-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 font-bold text-sm uppercase tracking-wide">⏰ Next Medicine Due:</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {nextMedicine.name}
                </p>
                <p className="text-gray-700 mt-2">
                  <span className="font-bold">Dosage:</span> {nextMedicine.dosage} | <span className="font-bold">Time:</span> {nextMedicine.time}
                </p>
              </div>
              <div className="text-6xl">💊</div>
            </div>
          </div>
        )}

        {/* Notification Status */}
        <div className="mb-8 p-6 bg-linear-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-lg shadow-md">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <p className="text-gray-800 font-bold text-sm uppercase tracking-wide">🔔 Notifications Status</p>
              <p className="text-gray-700 mt-2">
                {reminder.notificationPermission === 'granted'
                  ? '✅ Enabled - You will receive medicine reminders'
                  : reminder.notificationPermission === 'denied'
                  ? '❌ Disabled - Enable in browser settings'
                  : '⚠️ Not determined - Click button to enable'}
              </p>
            </div>
            <button
              onClick={triggerTestNotification}
              className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-3 rounded-lg transition transform hover:scale-105 shadow-lg whitespace-nowrap"
            >
              🔊 Test Notification
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading medicines...</p>
          </div>
        )}

        {/* Medicines List */}
        {!loading && medicines.length > 0 && (
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden border-t-4 border-blue-600">
            <table className="w-full">
              <thead className="bg-linear-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">💊 Medicine Name</th>
                  <th className="px-6 py-4 text-left font-bold">Dosage</th>
                  <th className="px-6 py-4 text-left font-bold">⏰ Time</th>
                  <th className="px-6 py-4 text-center font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine, index) => (
                  <tr
                    key={medicine.id}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-blue-50 transition border-b border-gray-200`}
                  >
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {medicine.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{medicine.dosage}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold">
                        {medicine.time}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(medicine.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100 font-bold px-4 py-2 rounded-lg transition"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && medicines.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-2xl border-t-4 border-blue-600">
            <p className="text-gray-600 text-2xl mb-6 font-semibold">💊 No medicines added yet</p>
            <Link
              href="/add-medicine"
              className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-3 rounded-lg transition transform hover:scale-105 inline-block shadow-lg"
            >
              ➕ Add Your First Medicine
            </Link>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-bold text-lg transition hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
