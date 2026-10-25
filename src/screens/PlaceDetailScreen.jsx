import { useState } from "react";
import StatusBar from "../components/StatusBar";
import { addStopToItinerary, toggleSavePlace, fetchItinerary } from "../data/api";
import { calculateDistance, formatDistance } from "../utils/location";
import { translations } from "../data/translations";

export default function PlaceDetailScreen({ place, onBack, userLocation, userLanguage, onOpenAuth, user }) {
  const [isSaved, setIsSaved] = useState(place?.isSaved || false);
  const [selectedPhoto, setSelectedPhoto] = useState(place?.image || place?.photos?.[0] || null);

  if (!place) return null;

  const t = translations[userLanguage] || translations.English;

  const dynamicDistance = userLocation
    ? calculateDistance(userLocation.latitude, userLocation.longitude, place.latitude, place.longitude)
    : null;

  const handleToggleSave = async () => {
    const token = localStorage.getItem("pune_auth_token");
    if (!token) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    try {
      const updated = await toggleSavePlace(place.id, !isSaved);
      setIsSaved(updated.isSaved);
    } catch (error) {
      console.error("Failed to toggle save:", error);
    }
  };

  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToItinerary = async () => {
    const token = localStorage.getItem("pune_auth_token");
    if (!token) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (isAdding) return;
    setIsAdding(true);
    try {
      // 1. Fetch current itinerary to find the real ID for "Day 1"
      let day1Id = null;
      try {
        const itinerary = await fetchItinerary();
        const day1 = Array.isArray(itinerary) ? itinerary.find(d => d.day === 1) : null;
        if (day1) day1Id = day1.id;
      } catch (e) {
        console.warn("Could not fetch itinerary day1, backend fallback will handle it:", e);
      }

      // 2. Add the stop using the dynamic ID or fallback
      await addStopToItinerary({
        itineraryDayId: day1Id,
        name: place.name,
        name_mr: place.name_mr || place.name,
        time: "TBD",
        desc: place.description || "",
        desc_mr: place.description_mr || place.description || "",
        dotColor: "#D9531E",
        tags: [{ label: place.category || "Heritage", type: (place.category || "heritage").toLowerCase() }]
      });

      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 3000);
    } catch (error) {
      console.error("Failed to add to itinerary:", error);
      alert(userLanguage === "Marathi" ? "सहलीत जोडण्यात अडचण आली." : "Failed to add to itinerary. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const photosList = Array.isArray(place.photos) && place.photos.length > 0 
    ? place.photos 
    : place.image ? [place.image] : [];

  return (
    <div style={{ background: "var(--bg-primary, #0E0E10)", height: "100%", overflowY: "auto", transition: "background 0.3s ease" }}>
      <StatusBar light />

      {/* Hero Banner with Photo */}
      <div
        style={{
          height: 240,
          background: selectedPhoto ? "#1C1412" : "linear-gradient(160deg, #D9531E 0%, #9E2A2B 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {selectedPhoto ? (
          <img
            src={selectedPhoto}
            alt={place.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.92)",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span style={{ fontSize: 64 }}>{place.emoji}</span>
        )}

        {/* Gradient overlays for button contrast */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 70,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Category Pill on Image */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 14,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            color: "#FAF6EE",
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 5,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <span>{place.emoji}</span>
          <span>{place.category}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            width: 36,
            height: 36,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 12,
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          }}
        >
          ←
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleToggleSave}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 12,
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          }}
        >
          {isSaved ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Photo Gallery Thumbnails (Clickable) */}
      {photosList.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "10px 16px",
            background: "#fff",
            borderBottom: "1px solid #EDE8DF",
            overflowX: "auto",
          }}
        >
          {photosList.map((photoUrl, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(photoUrl)}
              style={{
                width: 58,
                height: 48,
                borderRadius: 8,
                overflow: "hidden",
                flexShrink: 0,
                cursor: "pointer",
                border: selectedPhoto === photoUrl ? "2.5px solid #D9531E" : "1px solid #EDE8DF",
                boxShadow: selectedPhoto === photoUrl ? "0 2px 6px rgba(217,83,30,0.3)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <img
                src={photoUrl}
                alt={`Photo ${idx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Main Content Body */}
      <div style={{ padding: 16 }}>
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-main, #F5F5F7)", fontFamily: "var(--font-heading)" }}>
              {["Hindi", "Marathi", "Sanskrit", "Gujarati"].includes(userLanguage) && place.name_mr
                ? place.name_mr
                : place.name}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-sub, #A1A1AF)", marginTop: 4 }}>
              📍 {place.address} · {formatDistance(dynamicDistance)}
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,153,51,0.18)",
              color: "var(--accent-primary, #FF9933)",
              border: "1px solid rgba(255,153,51,0.3)",
              padding: "5px 10px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {place.rating?.toFixed(1) || "4.8"} ⭐
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "16px 0" }}>
          {[
            { val: place.estYear, lbl: t.estYear },
            { val: place.entryFee, lbl: t.entryFee },
            { val: place.visitTime, lbl: t.visitTime },
          ].map((s) => (
            <div
              key={s.lbl}
              style={{
                background: "var(--bg-card, #22222B)",
                border: "1px solid var(--border-color, rgba(212,175,55,0.25))",
                borderRadius: 12,
                padding: "10px 8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main, #F5F5F7)" }}>{s.val}</div>
              <div style={{ fontSize: 10, color: "var(--text-sub, #A1A1AF)", marginTop: 2 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Darshan & Aarti Timings Card */}
        {place.darshanTimings && (
          <div
            style={{
              background: "#FDF2EC",
              border: "1px solid #F5D5C6",
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#D9531E", marginBottom: 6 }}>
              <span>🕉️</span>
              <span>{userLanguage === "Hindi" || userLanguage === "Sanskrit" ? "आरती एवं दर्शन समय" : "Aarti & Darshan Timings"}</span>
            </div>
            <div style={{ fontSize: 12, color: "#4A3228", lineHeight: 1.5 }}>
              {place.darshanTimings}
            </div>
          </div>
        )}

        {/* Dress Code & Guidelines Card */}
        {place.dressCode && (
          <div
            style={{
              background: "#FAF0EC",
              border: "1px solid #EED4C8",
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#9E2A2B", marginBottom: 6 }}>
              <span>👗</span>
              <span>{userLanguage === "Hindi" || userLanguage === "Sanskrit" ? "वेशभूषा व नियम" : "Dress Code & Guidelines"}</span>
            </div>
            <div style={{ fontSize: 12, color: "#4A3228", lineHeight: 1.5 }}>
              {place.dressCode}
            </div>
          </div>
        )}

        {/* Significance & Legend Card */}
        {place.significance && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #EDE8DF",
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#1B4965", marginBottom: 6 }}>
              <span>✨</span>
              <span>{userLanguage === "Hindi" || userLanguage === "Sanskrit" ? "धार्मिक व पौराणिक महत्व" : "Spiritual Significance"}</span>
            </div>
            <div style={{ fontSize: 12, color: "#4A3E39", lineHeight: 1.6 }}>
              {place.significance}
            </div>
          </div>
        )}

        {/* Sacred Rituals */}
        {place.rituals && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #EDE8DF",
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#C88617", marginBottom: 6 }}>
              <span>🪔</span>
              <span>{userLanguage === "Hindi" || userLanguage === "Sanskrit" ? "पूजा व धार्मिक अनुष्ठान" : "Sacred Rituals & Offerings"}</span>
            </div>
            <div style={{ fontSize: 12, color: "#4A3E39", lineHeight: 1.6 }}>
              {place.rituals}
            </div>
          </div>
        )}

        {/* About / Description */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1412", marginBottom: 6 }}>{t.about}</div>
        <div style={{ fontSize: 12, color: "#6B5B52", lineHeight: 1.6, marginBottom: 12 }}>
          {(userLanguage === "Marathi" || userLanguage === "Hindi") && place.description_mr
            ? place.description_mr
            : place.description}
        </div>

        {/* Best Time to Visit */}
        {place.bestTimeToVisit && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              background: "#F5F3ED",
              borderRadius: 10,
              fontSize: 12,
              color: "#3D3680",
              marginBottom: 12,
            }}
          >
            <span>🌅</span>
            <div>
              <strong>{userLanguage === "Hindi" ? "दर्शन का सर्वोत्तम समय:" : "Best Time to Visit:"} </strong>
              {place.bestTimeToVisit}
            </div>
          </div>
        )}

        {/* Info rows */}
        <InfoRow icon="🕐" text={place.hours} />
        {place.phone && place.phone !== "—" && (
          <a href={`tel:${place.phone}`} style={{ textDecoration: "none" }}>
            <InfoRow icon="📞" text={place.phone} />
          </a>
        )}
        {place.accessible && <InfoRow icon="♿" text={t.info.accessible} />}
        {place.guidedTours && <InfoRow icon="🎙️" text={t.info.guided} />}

        {/* Quick Actions (Directions, Share, Save) */}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <div
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  place.name + " " + place.address + " Ujjain"
                )}`,
                "_blank"
              )
            }
            style={{
              flex: 1,
              background: "#fff",
              border: "1px solid #EDE8DF",
              borderRadius: 12,
              padding: 10,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 20 }}>🗺️</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#1C1412", marginTop: 3 }}>
              {t.directions}
            </div>
          </div>

          <div
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: place.name,
                    text: `Visit ${place.name} in Avantikā (Ujjain)!`,
                    url: window.location.href,
                  })
                  .catch(console.error);
              } else {
                navigator.clipboard?.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            style={{
              flex: 1,
              background: "#fff",
              border: "1px solid #EDE8DF",
              borderRadius: 12,
              padding: 10,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 20 }}>📤</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#1C1412", marginTop: 3 }}>
              {t.share}
            </div>
          </div>

          <div
            onClick={handleToggleSave}
            style={{
              flex: 1,
              background: "#fff",
              border: "1px solid #EDE8DF",
              borderRadius: 12,
              padding: 10,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 20 }}>🔖</div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: isSaved ? "#D9531E" : "#1C1412",
                marginTop: 3,
              }}
            >
              {isSaved ? t.saved : t.save}
            </div>
          </div>
        </div>

        {/* Add to Itinerary CTA */}
        <button
          onClick={handleAddToItinerary}
          disabled={isAdding}
          style={{
            width: "100%",
            background: isAdded ? "#15803D" : isAdding ? "#1B4965" : "var(--cta-bg, linear-gradient(135deg, #FF9933 0%, #D4AF37 100%))",
            color: isAdded || isAdding ? "#FFFFFF" : "var(--cta-text, #0E0E10)",
            border: "none",
            borderRadius: 14,
            padding: 14,
            fontSize: 14,
            fontWeight: 700,
            textAlign: "center",
            marginTop: 16,
            cursor: isAdding ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            boxShadow: "var(--card-shadow, 0 4px 16px rgba(0,0,0,0.4))",
            transition: "all 0.2s ease",
          }}
        >
          {isAdded ? (
            userLanguage === "Marathi" || userLanguage === "Hindi"
              ? "✓ सहलीमध्ये समाविष्ट केले!"
              : "✓ Added to Day 1 Itinerary!"
          ) : isAdding ? (
            "Adding..."
          ) : (
            `📅 ${t.addToPlan}`
          )}
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 0",
        borderTop: "1px solid #EDE8DF",
        fontSize: 12,
        color: "#6B5B52",
      }}
    >
      <span style={{ fontSize: 16, color: "#D9531E" }}>{icon}</span>
      {text}
    </div>
  );
}
