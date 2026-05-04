'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

interface Pharmacy {
  id: string | number;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  distance: number;
}

export default function PharmacyPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey ?? '',
    libraries: ['places'],
  });

  // Automatically get location and fetch pharmacies when page loads
  useEffect(() => {
    getLocationAndFetchPharmacies();
  }, []);

  const getLocationAndFetchPharmacies = () => {
    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchPharmacies(latitude, longitude);
      },
      (err) => {
        setError('Location access denied. Please enable location permission in browser settings.');
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

  const openInGoogleMaps = (pharmacy: Pharmacy) => {
    const mapsUrl = `https://www.google.com/maps/search/pharmacy/@${pharmacy.lat},${pharmacy.lng},15z`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-600">📍 Find Pharmacies</h1>
          <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block">
              <p className="text-lg text-gray-600 mb-4">🔍 Finding nearby pharmacies...</p>
              <div className="flex gap-2 justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-bold">⚠️ Error</p>
            <p>{error}</p>
            <button
              onClick={handleRetry}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold"
            >
              🔄 Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && location && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Google Map */}
            <div className="lg:col-span-2">
              {isLoaded && !loadError ? (
                <GoogleMap
                  mapContainerStyle={{
                    width: '100%',
                    height: '500px',
                    borderRadius: '12px',
                  }}
                  center={location}
                  zoom={13}
                  onClick={() => setSelectedPharmacy(null)}
                >
                  {/* User Location Marker */}
                  <Marker
                    position={location}
                    title="Your Location"
                    icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  />

                  {/* Pharmacy Markers */}
                  {pharmacies.map((pharmacy) => (
                    <Marker
                      key={pharmacy.id}
                      position={{ lat: pharmacy.lat, lng: pharmacy.lng }}
                      title={pharmacy.name}
                      onClick={() => setSelectedPharmacy(pharmacy)}
                      icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                    />
                  ))}

                  {/* Info Window for Selected Pharmacy */}
                  {selectedPharmacy && (
                    <InfoWindow
                      position={{ lat: selectedPharmacy.lat, lng: selectedPharmacy.lng }}
                      onCloseClick={() => setSelectedPharmacy(null)}
                    >
                      <div className="p-3 bg-white rounded-lg max-w-xs">
                        <h3 className="font-bold text-lg text-green-600">{selectedPharmacy.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{selectedPharmacy.address}</p>
                        <p className="text-gray-600 text-sm">📞 {selectedPharmacy.phone}</p>
                        <p className="text-green-600 font-bold mt-2">{selectedPharmacy.distance.toFixed(1)} km away</p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">{loadError ? 'Error loading map' : 'Loading map...'}</p>
                </div>
              )}
            </div>

            {/* Pharmacy List */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                ✅ Found <span className="text-green-600">{pharmacies.length}</span> Pharmacies
              </h2>

              {/* Location Info Card */}
              <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Lat:</span> {location.lat.toFixed(4)}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-bold">Lng:</span> {location.lng.toFixed(4)}
                </p>
                <button
                  onClick={handleRetry}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold text-sm"
                >
                  🔄 Search Again
                </button>
              </div>

              {pharmacies.length === 0 ? (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <p className="text-gray-600 text-lg">😞 No pharmacies found</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pharmacies.map((pharmacy, index) => (
                    <div
                      key={pharmacy.id}
                      onClick={() => setSelectedPharmacy(pharmacy)}
                      className={`p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border-l-4 ${
                        selectedPharmacy?.id === pharmacy.id
                          ? 'bg-green-50 border-green-600'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      <h3 className="font-bold text-green-600">{index + 1}. {pharmacy.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{pharmacy.address}</p>
                      <p className="text-gray-600 text-sm">📞 {pharmacy.phone}</p>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-green-600 font-bold">{pharmacy.distance.toFixed(1)} km</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openInGoogleMaps(pharmacy);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700"
                        >
                          🗺️ Maps
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}