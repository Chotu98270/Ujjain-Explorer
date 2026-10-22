import { useState, useEffect, useRef, useCallback, memo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer, InfoWindowF } from "@react-google-maps/api";
import { categoryColors } from "../data/tokens";
import { translations } from "../data/translations";

const GOOGLE_LIBRARIES = ["places", "geometry"];

const ujjainMapStyles = [
  { featureType: "poi.attraction", elementType: "labels.icon", stylers: [{ visibility: "on" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#d2e7ec" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#faf6ee" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#fed7aa" }] },
  { featureType: "poi.place_of_worship", elementType: "labels.text.fill", stylers: [{ color: "#9e2a2b" }] }
];

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

  // Update bounds when user drags or zooms
  const handleIdle = useCallback(() => {
    if (!mapRef.current || !onBoundsChange) return;
    const bounds = mapRef.current.getBounds();
    if (bounds) {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      onBoundsChange({
        north: Number(ne.lat().toFixed(5)),
        east: Number(ne.lng().toFixed(5)),
        south: Number(sw.lat().toFixed(5)),
        west: Number(sw.lng().toFixed(5))
      });
    }
  }, [onBoundsChange]);

  // Recenter map when selected place changes
  useEffect(() => {
    if (selectedPlace?.latitude && selectedPlace?.longitude && mapRef.current) {
      mapRef.current.panTo({
        lat: Number(selectedPlace.latitude),
        lng: Number(selectedPlace.longitude)
      });
      setActiveMarker(selectedPlace);
    }
  }, [selectedPlace]);

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

  const createMarkerSvg = (bgColor, emoji, stopNumber) => {
    const isBadge = stopNumber !== null && stopNumber !== undefined;
    const badgeSvg = isBadge
      ? `<circle cx="28" cy="8" r="8" fill="#1B4965" stroke="#ffffff" stroke-width="1.5"/>
         <text x="28" y="11" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">${stopNumber}</text>`
      : "";

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="42" viewBox="0 0 36 42">
        <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 24 18 24s18-10.5 18-24c0-9.94-8.06-18-18-18z" fill="${bgColor}" stroke="#ffffff" stroke-width="2"/>
        <circle cx="18" cy="18" r="14" fill="#ffffff" />
        <text x="18" y="23" font-size="14" text-anchor="middle">${emoji}</text>
        ${badgeSvg}
      </svg>
    `;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  };

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
      {/* User Location Marker */}
      {userLocation?.latitude && userLocation?.longitude && (
        <MarkerF
          position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
          icon={{
            path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
            scale: 8,
            fillColor: "#1B4965",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3
          }}
          title="You are here"
        />
      )}

      {/* Places Markers with Numbered Itinerary Badges */}
      {places
        .filter((p) => p.latitude && p.longitude)
        .map((place) => {
          const stopIndex = stops.findIndex(
            (s) => s.name.toLowerCase() === place.name.toLowerCase()
          );
          const stopNumber = stopIndex !== -1 ? stopIndex + 1 : null;
          const catStyle = categoryColors[place.category] || categoryColors.default;
          const markerIconUrl = createMarkerSvg(catStyle.color, place.emoji || "📍", stopNumber);

          return (
            <MarkerF
              key={place.id || place.osmId || place.name}
              position={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
              icon={{
                url: markerIconUrl,
                scaledSize: new window.google.maps.Size(36, 42),
                anchor: new window.google.maps.Point(18, 42)
              }}
              onClick={() => {
                setActiveMarker(place);
                if (onSelectPlace) onSelectPlace(place);
              }}
            />
          );
        })}

      {/* Info Window on click */}
      {activeMarker && (
        <InfoWindowF
          position={{ lat: Number(activeMarker.latitude), lng: Number(activeMarker.longitude) }}
          onCloseClick={() => setActiveMarker(null)}
        >
          <div style={{ minWidth: 160, padding: 4, fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>{activeMarker.emoji || "📍"}</span>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1412" }}>
                {(userLanguage === "Hindi" || userLanguage === "Marathi" || userLanguage === "Sanskrit") && activeMarker.name_mr
                  ? activeMarker.name_mr
                  : activeMarker.name}
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#6B5B52", marginBottom: 8 }}>
              ⭐ {(Number(activeMarker.rating) || 4.5).toFixed(1)} · {activeMarker.category}
            </div>

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
