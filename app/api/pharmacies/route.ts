import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache: key -> { ts, data }
const cache = new Map<string, { ts: number; data: any }>();
const CACHE_TTL = 60 * 1000; // 60s cache

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude } = await request.json();

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    const radiusMeters = 5000; // 5km
    const cacheKey = `${latitude.toFixed(5)},${longitude.toFixed(5)},${radiusMeters}`;
    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (cached && now - cached.ts < CACHE_TTL) {
      return NextResponse.json({ pharmacies: cached.data });
    }

    // Query Overpass for pharmacies within 5km
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node(around:${radiusMeters},${latitude},${longitude})[amenity=pharmacy];
        way(around:${radiusMeters},${latitude},${longitude})[amenity=pharmacy];
        relation(around:${radiusMeters},${latitude},${longitude})[amenity=pharmacy];
      );
      out center 20;
    `;

    const resp = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'meditrack-plus/1.0',
      },
      body: new URLSearchParams({ data: overpassQuery }).toString(),
    });

    if (!resp.ok) {
      console.warn('Overpass responded with', resp.status);
      return NextResponse.json({ error: 'Overpass API error' }, { status: 502 });
    }

    const data = await resp.json();
    const elements = data.elements || [];

    const pharmacies = elements
      .map((el: any, i: number) => {
        const lat = el.lat ?? el.center?.lat;
        const lng = el.lon ?? el.center?.lon;
        const tags = el.tags || {};
        const address = tags['addr:full'] || `${tags['addr:street'] || ''} ${tags['addr:city'] || ''}`.trim() || 'Address not available';

        const distance = typeof lat === 'number' && typeof lng === 'number'
          ? calculateDistance(latitude, longitude, lat, lng)
          : 0;

        return {
          id: el.id || i + 1,
          name: tags.name || 'Unknown Pharmacy',
          address,
          phone: tags.phone || tags['contact:phone'] || 'N/A',
          lat,
          lng,
          distance,
        };
      })
      .filter((p: any) => typeof p.lat === 'number' && typeof p.lng === 'number')
      .sort((a: any, b: any) => a.distance - b.distance)
      .slice(0, 20);

    cache.set(cacheKey, { ts: now, data: pharmacies });
    return NextResponse.json({ pharmacies });
  } catch (error) {
    console.error('Pharmacy API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch pharmacies' }, { status: 500 });
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
