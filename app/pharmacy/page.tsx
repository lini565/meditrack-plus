'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface Pharmacy {
  id: string | number;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  distance: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export default function PharmacyPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  // Automatically get location and fetch pharmacies when page loads
  useEffect(() => {
    getLocationAndFetchPharmacies();
  }, []);

  const getLocationAndFetchPharmacies = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchPharmacies(latitude, longitude);
      },
      (err) => {
        let errorMsg = 'Unable to access your location.';
        if (err.code === 1) {
          errorMsg = 'Location permission denied. Please enable location access in browser settings.';
        } else if (err.code === 2) {
          errorMsg = 'Location information is unavailable.';
        } else if (err.code === 3) {
          errorMsg = 'Location request timed out. Please try again.';
        }
        setError(errorMsg);
        setLoading(false);
      }
    );
  };

  const fetchPharmacies = async (lat: number, lng: number) => {
    try {
      const response = await fetch('/api/pharmacies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });

      const data = await response.json();
      setPharmacies(data.pharmacies || []);
    } catch (err) {
      setError('Failed to fetch pharmacies');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    getLocationAndFetchPharmacies();
  };

  const openInMaps = (pharmacy: Pharmacy) => {
    const mapsUrl = `https://maps.google.com/?q=${pharmacy.lat},${pharmacy.lng}&z=15`;
    window.open(mapsUrl, '_blank');
  };

  const mapCenter = location ? { lat: location.lat, lng: location.lng } : { lat: 0, lng: 0 };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-600">📍 Find Pharmacies</h1>
        <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Side - Pharmacy List */}
        <div className="w-1/3 bg-white shadow-lg flex flex-col border-r">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold text-green-600">
              Found {pharmacies.length} Pharmacies
            </h2>
            <p className="text-sm text-gray-600">Click to view on map</p>
          </div>

          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600 mb-3">🔍 Finding nearby pharmacies...</p>
                <div className="flex gap-2 justify-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <p className="text-red-600 mb-3">⚠️ {error}</p>
                <button
                  onClick={handleRetry}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold"
                >
                  🔄 Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {pharmacies.length === 0 ? (
                <p className="text-gray-600 text-center py-10">😞 No pharmacies found</p>
              ) : (
                pharmacies.map((pharmacy, index) => (
                  <div
                    key={pharmacy.id}
                    onClick={() => setSelectedPharmacy(pharmacy)}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      selectedPharmacy?.id === pharmacy.id
                        ? 'bg-green-100 border-2 border-green-600'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <h3 className="font-bold text-green-600 text-sm">
                      {index + 1}. {pharmacy.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">{pharmacy.address}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-green-600 font-bold">{pharmacy.distance.toFixed(1)} km</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openInMaps(pharmacy);
                        }}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Maps
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Side - Map */}
        <div className="w-2/3 bg-gray-100">
          {!loading && location && (
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={15}
                options={{
                  streetViewControl: false,
                  fullscreenControl: true,
                }}
              >
                {/* User Location */}
                <Marker
                  position={mapCenter}
                  title="Your Location"
                  icon={{
                    path: 'M12 0C7.58 0 4 3.58 4 8c0 4.89 8 12 8 12s8-7.11 8-12c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z',
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeColor: '#fff',
                    strokeWeight: 2,
                    scale: 1.5,
                  }}
                />

                {/* Pharmacy Markers */}
                {pharmacies.map((pharmacy) => (
                  <Marker
                    key={pharmacy.id}
                    position={{ lat: pharmacy.lat, lng: pharmacy.lng }}
                    title={pharmacy.name}
                    onClick={() => setSelectedPharmacy(pharmacy)}
                    icon={{
                      path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
                      fillColor: selectedPharmacy?.id === pharmacy.id ? '#22c55e' : '#ef4444',
                      fillOpacity: 1,
                      strokeColor: '#fff',
                      strokeWeight: 2,
                      scale: 1.5,
                    }}
                  />
                ))}

                {/* Info Window for Selected Pharmacy */}
                {selectedPharmacy && (
                  <InfoWindow
                    position={{ lat: selectedPharmacy.lat, lng: selectedPharmacy.lng }}
                    onCloseClick={() => setSelectedPharmacy(null)}
                  >
                    <div className="p-2 text-sm">
                      <h4 className="font-bold text-green-600">{selectedPharmacy.name}</h4>
                      <p className="text-gray-600 mt-1">{selectedPharmacy.address}</p>
                      <p className="text-gray-600">📞 {selectedPharmacy.phone}</p>
                      <p className="text-green-600 font-bold mt-2">{selectedPharmacy.distance.toFixed(1)} km away</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          )}
        </div>
      </div>
    </div>
  );
}