import { useState, useEffect, useRef, useCallback, memo } from "react";
import { GoogleMap, useJsApiLoader, DirectionsRenderer, InfoWindowF, MarkerF } from "@react-google-maps/api";
import { categoryColors } from "../data/tokens";

const GOOGLE_LIBRARIES = ["places", "geometry"];

const ujjainMapStyles = [
  { featureType: "poi.attraction", elementType: "labels.icon", stylers: [{ visibility: "on" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#d2e7ec" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#faf6ee" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#fed7aa" }] },
  { featureType: "poi.place_of_worship", elementType: "labels.text.fill", stylers: [{ color: "#9e2a2b" }] }
];

// In-memory cache for generated SVG icons (avoids SVG regeneration on map pans)
const markerIconCache = new Map();

function getMarkerIcon(color, emoji, stopNumber, isSelected) {
  const cacheKey = `${color}_${emoji}_${stopNumber}_${isSelected}`;
  if (markerIconCache.has(cacheKey)) {
    return markerIconCache.get(cacheKey);
  }

  const filterId = `shadow_${cacheKey.replace(/[^a-zA-Z0-9]/g, "_")}`;
  const badge = stopNumber !== null ? `
    <circle cx="28" cy="8" r="7.5" fill="#1B4965" stroke="#FFFFFF" stroke-width="1.5"/>
    <text x="28" y="11" text-anchor="middle" font-size="8.5" font-weight="bold" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${stopNumber}</text>
  ` : "";

  const stroke = isSelected ? `stroke="#FFFFFF" stroke-width="2.5"` : `stroke="#FFFFFF" stroke-width="1.2"`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
    <defs>
      <filter id="${filterId}" x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <path d="M18 43 C18 43 32 27 32 17 A14 14 0 0 0 4 17 C4 27 18 43 18 43 Z" fill="${color}" ${stroke} filter="url(#${filterId})"/>
    <circle cx="18" cy="17" r="10.5" fill="#FFFFFF"/>
    <text x="18" y="22" text-anchor="middle" font-size="12" font-family="'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif">${emoji || "📍"}</text>
    ${badge}
  </svg>`;

  const iconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  markerIconCache.set(cacheKey, iconUrl);
  return iconUrl;
}

export default memo(function GoogleMapView({
  apiKey,
  places = [],
  stops = [],
  selectedPlace,
  onSelectPlace,
  userLocation,
  userLanguage = "Hindi",
  mode = "Walking",
  points = [],
  onRouteCalculated,
  onAddStop,
  onDeleteStop,
  onBoundsChange,
  isMapExpanded
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_LIBRARIES
  });

  const [activeMarker, setActiveMarker] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const mapRef = useRef(null);

  const defaultCenter = { lat: 23.1828, lng: 75.7682 }; // Shri Mahakaleshwar Jyotirlinga, Ujjain

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Update center when selectedPlace changes
  useEffect(() => {
    if (selectedPlace?.latitude && selectedPlace?.longitude && mapRef.current) {
      mapRef.current.panTo({
        lat: Number(selectedPlace.latitude),
        lng: Number(selectedPlace.longitude)
      });
      setActiveMarker(selectedPlace);
    }
  }, [selectedPlace]);

  // Handle bounds change on map pan/zoom
  const handleIdle = useCallback(() => {
    if (!mapRef.current || !onBoundsChange) return;
    const bounds = mapRef.current.getBounds();
    if (bounds) {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      onBoundsChange({
        south: sw.lat(),
        west: sw.lng(),
        north: ne.lat(),
        east: ne.lng()
      });
    }
  }, [onBoundsChange]);

  // Ultra-Fast Google Directions API Routing
  useEffect(() => {
    if (!isLoaded || points.length < 2 || !window.google) {
      setDirectionsResponse(null);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const origin = { lat: points[0][0], lng: points[0][1] };
    const destination = { lat: points[points.length - 1][0], lng: points[points.length - 1][1] };
    
    const waypoints = points.slice(1, -1).map((p) => ({
      location: { lat: p[0], lng: p[1] },
      stopover: true
    }));

    const travelMode = mode === "Walking" 
      ? window.google.maps.TravelMode.WALKING 
      : window.google.maps.TravelMode.DRIVING;

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode,
        optimizeWaypoints: true
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirectionsResponse(result);
          
          let totalDist = 0;
          let totalDur = 0;
          const parsedSteps = [];

          const route = result.routes[0];
          if (route && route.legs) {
            route.legs.forEach((leg) => {
              totalDist += leg.distance?.value || 0;
              totalDur += leg.duration?.value || 0;
              if (leg.steps) {
                leg.steps.forEach((step) => {
                  parsedSteps.push({
                    instruction: step.instructions ? step.instructions.replace(/<[^>]*>?/gm, "") : "Continue",
                    distance: step.distance?.value || 0,
                    duration: step.duration?.value || 0
                  });
                });
              }
            });
          }

          if (mode === "Auto") {
            totalDur = totalDur * 1.25; // Auto-rickshaw traffic offset
          }

          if (onRouteCalculated) {
            onRouteCalculated({
              distanceKm: totalDist / 1000,
              durationSec: totalDur,
              directions: parsedSteps
            });
          }
        } else {
          console.warn("[Google Directions] Route calculation failed:", status);
        }
      }
    );
  }, [points, mode, isLoaded, onRouteCalculated]);

  if (loadError) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#FAF6EE", padding: 20, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#9E2A2B" }}>Failed to load Google Maps</div>
        <div style={{ fontSize: 12, color: "#6B5B52", marginTop: 4 }}>Please verify your API key and network connection.</div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#FAF6EE" }}>
        <div style={{ width: 28, height: 28, border: "3px solid #D9531E", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: "#D9531E" }}>Loading Google Maps...</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={userLocation?.latitude ? { lat: userLocation.latitude, lng: userLocation.longitude } : defaultCenter}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onIdle={handleIdle}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        styles: ujjainMapStyles
      }}
    >
      {/* Native GPU-Accelerated User Location Marker */}
      {userLocation?.latitude && userLocation?.longitude && (
        <MarkerF
          position={{ lat: Number(userLocation.latitude), lng: Number(userLocation.longitude) }}
          title="Your Location"
          zIndex={1000}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#1B4965",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2.5,
          }}
        />
      )}

      {/* GPU-Accelerated Native Google Maps Markers */}
      {places
        .filter((p) => p.latitude && p.longitude)
        .map((place) => {
          const stopIndex = stops.findIndex(
            (s) => s.name.toLowerCase() === place.name.toLowerCase()
          );
          const stopNumber = stopIndex !== -1 ? stopIndex + 1 : null;
          const catStyle = categoryColors[place.category] || categoryColors.default;
          const markerColor = catStyle.color || "#D9531E";
          const isSelected = activeMarker?.name?.toLowerCase() === place.name?.toLowerCase();
          const iconUrl = getMarkerIcon(markerColor, place.emoji, stopNumber, isSelected);

          return (
            <MarkerF
              key={place.id || place.osmId || place.name}
              position={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
              title={place.name}
              zIndex={isSelected ? 999 : (stopNumber !== null ? 500 + stopNumber : 20)}
              onClick={() => {
                setActiveMarker(place);
                if (onSelectPlace) onSelectPlace(place);
              }}
              icon={{
                url: iconUrl,
                scaledSize: isSelected ? new window.google.maps.Size(42, 54) : new window.google.maps.Size(36, 46),
                anchor: isSelected ? new window.google.maps.Point(21, 52) : new window.google.maps.Point(18, 44),
              }}
            />
          );
        })}

      {/* Info Window on click */}
      {activeMarker && (
        <InfoWindowF
          position={{ lat: Number(activeMarker.latitude), lng: Number(activeMarker.longitude) }}
          onCloseClick={() => setActiveMarker(null)}
          options={{ pixelOffset: new window.google.maps.Size(0, -42) }}
        >
          <div style={{ width: 190, padding: 2, fontFamily: "'Inter', sans-serif" }}>
            {activeMarker.image && (
              <div
                style={{
                  width: "100%",
                  height: 95,
                  borderRadius: 8,
                  overflow: "hidden",
                  marginBottom: 8,
                  background: "#FAF6EE",
                }}
              >
                <img
                  src={activeMarker.image}
                  alt={activeMarker.name}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.parentElement.style.display = "none";
                  }}
                />
              </div>
            )}
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>{activeMarker.emoji || "📍"}</span>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1412", lineHeight: 1.2 }}>
                {(userLanguage === "Hindi" || userLanguage === "Marathi" || userLanguage === "Sanskrit") && activeMarker.name_mr
                  ? activeMarker.name_mr
                  : activeMarker.name}
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#6B5B52", marginBottom: 6 }}>
              ⭐ {(Number(activeMarker.rating) || 4.8).toFixed(1)} · {activeMarker.category}
            </div>
            {activeMarker.hours && (
              <div style={{ fontSize: 10, color: "#9E2A2B", marginBottom: 8, fontWeight: 500 }}>
                🕐 {activeMarker.hours}
              </div>
            )}

            {stops.some((s) => s.name.toLowerCase() === activeMarker.name.toLowerCase()) ? (
              <button
                onClick={() => {
                  const s = stops.find((s) => s.name.toLowerCase() === activeMarker.name.toLowerCase());
                  if (s && onDeleteStop) onDeleteStop(s.id);
                  setActiveMarker(null);
                }}
                style={{
                  width: "100%",
                  background: "#FDF2EC",
                  color: "#D9531E",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                ❌ Remove from Itinerary
              </button>
            ) : (
              <button
                onClick={() => {
                  if (onAddStop) onAddStop(activeMarker);
                  setActiveMarker(null);
                }}
                style={{
                  width: "100%",
                  background: "#D9531E",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                📅 Add to Itinerary
              </button>
            )}
          </div>
        </InfoWindowF>
      )}

      {/* Google Directions Polyline */}
      {directionsResponse && (
        <DirectionsRenderer
          directions={directionsResponse}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#D9531E",
              strokeWeight: 5,
              strokeOpacity: 0.85
            }
          }}
        />
      )}
    </GoogleMap>
  );
});
