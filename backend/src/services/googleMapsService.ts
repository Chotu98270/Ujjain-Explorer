import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

// Central coordinate for Ujjain (Avantikā)
export const UJJAIN_CENTER = {
  latitude: 23.1828,
  longitude: 75.7682
};

export const isGoogleMapsEnabled = (): boolean => {
  return Boolean(GOOGLE_API_KEY && GOOGLE_API_KEY.startsWith('AIzaSy'));
};

export const mapCategoryEmoji = (category: string): string => {
  switch (category) {
    case 'Heritage': return '🏰';
    case 'Temple': return '⛩️';
    case 'Nature': return '🌿';
    case 'Food': return '🍽️';
    case 'Wellness': return '🧘';
    default: return '📍';
  }
};

const CATEGORY_TYPES: Record<string, string[]> = {
  Heritage: ['historical_landmark', 'tourist_attraction', 'museum'],
  Temple: ['hindu_temple'],
  Nature: ['park', 'national_park'],
  Food: ['restaurant', 'cafe', 'bakery'],
  Wellness: ['spa']
};

export const inferCategoryFromTypes = (types: string[] = []): string => {
  for (const t of types) {
    if (t === 'hindu_temple' || t === 'place_of_worship') return 'Temple';
    if (t === 'historical_landmark' || t === 'museum' || t === 'monument') return 'Heritage';
    if (t === 'park' || t === 'national_park' || t === 'garden') return 'Nature';
    if (t === 'restaurant' || t === 'cafe' || t === 'bakery' || t === 'food') return 'Food';
    if (t === 'spa' || t === 'yoga_studio') return 'Wellness';
  }
  return 'Heritage';
};

/**
 * Normalizes Google Places (New) result into Ujjain Explorer Place model
 */
export const transformGooglePlace = (p: any, forcedCategory?: string): any => {
  if (!p || !p.displayName?.text || !p.location?.latitude || !p.location?.longitude) {
    return null;
  }

  const category = forcedCategory && forcedCategory !== 'All' 
    ? forcedCategory 
    : inferCategoryFromTypes(p.types || []);

  const name = p.displayName.text.trim();
  const address = p.formattedAddress || 'Ujjain, Madhya Pradesh';
  const hours = p.regularOpeningHours?.weekdayDescriptions?.[0] || 'Open Daily';
  const description = p.editorialSummary?.text || `Sacred and historic destination in Ujjain: ${name}.`;

  return {
    osmId: `google:${p.id}`,
    name,
    name_mr: p.displayName.languageCode === 'mr' || p.displayName.languageCode === 'hi' ? name : null,
    emoji: mapCategoryEmoji(category),
    category,
    rating: typeof p.rating === 'number' ? Number(p.rating.toFixed(1)) : 4.5,
    latitude: Number(p.location.latitude),
    longitude: Number(p.location.longitude),
    distance: 'Calculating...',
    entryFee: 'Check locally',
    estYear: '—',
    visitTime: '1-2h',
    hours,
    phone: p.internationalPhoneNumber || p.nationalPhoneNumber || '—',
    address,
    accessible: true,
    guidedTours: false,
    tag: 'Google Verified',
    tagColor: 'orange',
    bgColor: '#FAF6EE',
    description,
    description_mr: null
  };
};

/**
 * Text Search with Places API (New) biased around Ujjain
 */
export const searchGooglePlaces = async (query: string, maxResults: number = 8): Promise<any[]> => {
  if (!isGoogleMapsEnabled()) return [];

  try {
    const payload = {
      textQuery: `${query} Ujjain`,
      locationBias: {
        circle: {
          center: UJJAIN_CENTER,
          radius: 15000.0 // 15 km around Ujjain
        }
      },
      maxResultCount: maxResults
    };

    const response = await axios.post(
      'https://places.googleapis.com/v1/places:searchText',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.types,places.editorialSummary,places.regularOpeningHours,places.internationalPhoneNumber'
        },
        timeout: 4000
      }
    );

    const places = response.data?.places || [];
    return places
      .map((p: any) => transformGooglePlace(p))
      .filter((p: any) => p !== null);
  } catch (error: any) {
    console.error('[Google Places] Text search failed:', error.response?.data || error.message);
    return [];
  }
};

/**
 * Nearby Category Search with Places API (New)
 */
export const fetchGooglePlacesByCategory = async (
  category: string,
  center: { latitude: number; longitude: number } = UJJAIN_CENTER,
  radiusMeters: number = 10000.0,
  maxResults: number = 12
): Promise<any[]> => {
  if (!isGoogleMapsEnabled()) return [];

  const types = CATEGORY_TYPES[category] || ['tourist_attraction', 'historical_landmark'];

  try {
    const payload = {
      includedTypes: types,
      maxResultCount: maxResults,
      locationRestriction: {
        circle: {
          center,
          radius: radiusMeters
        }
      }
    };

    const response = await axios.post(
      'https://places.googleapis.com/v1/places:searchNearby',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.types,places.editorialSummary,places.regularOpeningHours,places.internationalPhoneNumber'
        },
        timeout: 4000
      }
    );

    const places = response.data?.places || [];
    return places
      .map((p: any) => transformGooglePlace(p, category))
      .filter((p: any) => p !== null);
  } catch (error: any) {
    console.error(`[Google Places] Category search for ${category} failed:`, error.response?.data || error.message);
    return [];
  }
};

/**
 * Viewport / Bounds search with Places API (New)
 */
export const fetchGooglePlacesInBounds = async (
  bounds: { south: number; west: number; north: number; east: number },
  category?: string
): Promise<any[]> => {
  if (!isGoogleMapsEnabled()) return [];

  // Center of bounds
  const centerLat = (bounds.south + bounds.north) / 2;
  const centerLng = (bounds.west + bounds.east) / 2;

  // Approximate radius in meters from center to corner
  const latDiff = Math.abs(bounds.north - bounds.south) * 111000;
  const lngDiff = Math.abs(bounds.east - bounds.west) * 111000 * Math.cos((centerLat * Math.PI) / 180);
  const radiusMeters = Math.min(Math.max(Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) / 2, 1000), 20000);

  if (category && category !== 'All') {
    return fetchGooglePlacesByCategory(category, { latitude: centerLat, longitude: centerLng }, radiusMeters, 15);
  }

  try {
    const payload = {
      textQuery: 'top attractions temples heritage in Ujjain',
      locationRestriction: {
        rectangle: {
          low: { latitude: bounds.south, longitude: bounds.west },
          high: { latitude: bounds.north, longitude: bounds.east }
        }
      },
      maxResultCount: 15
    };

    const response = await axios.post(
      'https://places.googleapis.com/v1/places:searchText',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.types,places.editorialSummary,places.regularOpeningHours,places.internationalPhoneNumber'
        },
        timeout: 4000
      }
    );

    const places = response.data?.places || [];
    return places
      .map((p: any) => transformGooglePlace(p))
      .filter((p: any) => p !== null);
  } catch (error: any) {
    console.error('[Google Places] Bounds search failed:', error.response?.data || error.message);
    return [];
  }
};

/**
 * High-Speed Waypoint Route Optimization with Google Routes API
 */
export const optimizeWaypointsWithGoogle = async (
  coordinates: Array<{ lat: number; lon: number }>,
  travelMode: 'DRIVE' | 'WALK' | 'TWO_WHEELER' = 'DRIVE'
): Promise<{ order: number[]; distanceMeters: number; durationSeconds: number } | null> => {
  if (!isGoogleMapsEnabled() || coordinates.length <= 1) {
    return {
      order: coordinates.map((_, i) => i),
      distanceMeters: 0,
      durationSeconds: 0
    };
  }

  if (coordinates.length === 2) {
    return {
      order: [0, 1],
      distanceMeters: 0,
      durationSeconds: 0
    };
  }

  try {
    const origin = {
      location: {
        latLng: {
          latitude: coordinates[0].lat,
          longitude: coordinates[0].lon
        }
      }
    };

    const destination = {
      location: {
        latLng: {
          latitude: coordinates[coordinates.length - 1].lat,
          longitude: coordinates[coordinates.length - 1].lon
        }
      }
    };

    const intermediates = coordinates.slice(1, -1).map(c => ({
      location: {
        latLng: {
          latitude: c.lat,
          longitude: c.lon
        }
      }
    }));

    const payload = {
      origin,
      destination,
      intermediates,
      optimizeWaypointOrder: true,
      travelMode
    };

    const response = await axios.post(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'routes.optimizedIntermediateWaypointIndex,routes.duration,routes.distanceMeters'
        },
        timeout: 5000
      }
    );

    const route = response.data?.routes?.[0];
    if (!route) {
      return null;
    }

    let intermediateOrder: number[] = [];
    if (
      Array.isArray(route.optimizedIntermediateWaypointIndex) &&
      route.optimizedIntermediateWaypointIndex.length > 0 &&
      route.optimizedIntermediateWaypointIndex.every((idx: number) => idx >= 0)
    ) {
      intermediateOrder = route.optimizedIntermediateWaypointIndex;
    } else {
      intermediateOrder = intermediates.map((_, i) => i);
    }
    
    // Map intermediate indices back to overall coordinate indices
    const finalOrder = [
      0,
      ...intermediateOrder.map(idx => idx + 1),
      coordinates.length - 1
    ];

    const durationSeconds = route.duration ? parseInt(route.duration.replace('s', ''), 10) : 0;
    const distanceMeters = route.distanceMeters || 0;

    return {
      order: finalOrder,
      distanceMeters,
      durationSeconds
    };
  } catch (error: any) {
    console.error('[Google Routes] Optimization failed:', error.response?.data || error.message);
    return null;
  }
};
