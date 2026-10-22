import { useState, useEffect, useRef, useCallback, memo } from "react";
import { GoogleMap, useJsApiLoader, DirectionsRenderer, InfoWindowF, OverlayViewF, OverlayView } from "@react-google-maps/api";
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
  const [googlePhotos, setGooglePhotos] = useState({});
  const mapRef = useRef(null);

  const defaultCenter = { lat: 23.1828, lng: 75.7682 }; // Shri Mahakaleshwar Jyotirlinga, Ujjain

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Fetch official Google Maps Place Photos using PlacesService
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps?.places || places.length === 0) return;

    try {
      const placesService = new window.google.maps.places.PlacesService(mapRef.current);

      places.slice(0, 12).forEach((place) => {
        if (!place.name || googlePhotos[place.name]) return;

        const request = {
          query: `${place.name} Ujjain`,
          fields: ["name", "photos", "place_id"]
        };

        placesService.findPlaceFromQuery(request, (results, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            results?.[0]?.photos?.length > 0
          ) {
            const photoUrl = results[0].photos[0].getUrl({ maxWidth: 600, maxHeight: 600 });
            if (photoUrl) {
              setGooglePhotos((prev) => ({ ...prev, [place.name]: photoUrl }));
            }
          }
        });
      });
    } catch (err) {
      console.warn("[Google Places Photo] Service fetch:", err.message);
    }
  }, [isLoaded, places]);

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
      {/* User Location Pulse Marker */}
      {userLocation?.latitude && userLocation?.longitude && (
        <OverlayViewF
          position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div style={{ transform: "translate(-50%, -50%)", pointerEvents: "none" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#1B4965", border: "2.5px solid #fff", boxShadow: "0 0 10px rgba(27,73,101,0.7)" }} />
          </div>
        </OverlayViewF>
      )}

      {/* Places Markers with Circular Photo Icons & Numbered Badges */}
      {places
        .filter((p) => p.latitude && p.longitude)
        .map((place) => {
          const stopIndex = stops.findIndex(
            (s) => s.name.toLowerCase() === place.name.toLowerCase()
          );
          const stopNumber = stopIndex !== -1 ? stopIndex + 1 : null;
          const catStyle = categoryColors[place.category] || categoryColors.default;
          const borderColor = catStyle.color || "#D9531E";
          const isSelected = activeMarker?.name?.toLowerCase() === place.name?.toLowerCase();
          const markerPhoto = googlePhotos[place.name] || place.image;

          return (
            <OverlayViewF
              key={place.id || place.osmId || place.name}
              position={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                onClick={() => {
                  setActiveMarker(place);
                  if (onSelectPlace) onSelectPlace(place);
                }}
                title={place.name}
                style={{
                  position: "relative",
                  transform: isSelected ? "translate(-50%, -100%) scale(1.15)" : "translate(-50%, -100%)",
                  cursor: "pointer",
                  userSelect: "none",
                  transition: "transform 0.15s ease",
                  filter: isSelected ? "drop-shadow(0 6px 12px rgba(0,0,0,0.4))" : "drop-shadow(0 3px 6px rgba(0,0,0,0.25))",
                }}
              >
                {/* Circular Photo Avatar */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "#FAF6EE",
                    border: `3px solid ${borderColor}`,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {markerPhoto ? (
                    <img
                      src={markerPhoto}
                      alt={place.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const span = e.currentTarget.nextElementSibling;
                        if (span) span.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <span
                    style={{
                      display: markerPhoto ? "none" : "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                    }}
                  >
                    {place.emoji || "📍"}
                  </span>
                </div>

                {/* Bottom Pointer Caret */}
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: `7px solid ${borderColor}`,
                    margin: "-1px auto 0 auto",
                  }}
                />

                {/* Itinerary Number Badge */}
                {stopNumber !== null && (
                  <div
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      background: "#1B4965",
                      color: "#ffffff",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: "2px solid #ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {stopNumber}
                  </div>
                )}
              </div>
            </OverlayViewF>
          );
        })}

      {/* Info Window on click */}
      {activeMarker && (
        <InfoWindowF
          position={{ lat: Number(activeMarker.latitude), lng: Number(activeMarker.longitude) }}
          onCloseClick={() => setActiveMarker(null)}
          options={{ pixelOffset: new window.google.maps.Size(0, -48) }}
        >
          <div style={{ width: 190, padding: 2, fontFamily: "'Inter', sans-serif" }}>
            {(googlePhotos[activeMarker.name] || activeMarker.image) && (
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
                  src={googlePhotos[activeMarker.name] || activeMarker.image}
                  alt={activeMarker.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
