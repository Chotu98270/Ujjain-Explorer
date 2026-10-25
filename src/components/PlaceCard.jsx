import { memo } from "react";
import { tagColorMap } from "../data/tokens";
import { calculateDistance, formatDistance } from "../utils/location";

const PlaceCard = memo(function PlaceCard({ place, onClick, userLocation, userLanguage }) {
  const tagStyle = tagColorMap[place.tagColor] || tagColorMap.terracotta;

  const dynamicDistance = userLocation
    ? calculateDistance(userLocation.latitude, userLocation.longitude, place.latitude, place.longitude)
    : null;

  return (
    <div
      onClick={() => onClick(place)}
      style={{
        width: 156,
        flexShrink: 0,
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid var(--border-color, #EDE8DF)",
        background: "var(--bg-card, #fff)",
        boxShadow: "var(--card-shadow, 0 4px 14px rgba(0,0,0,0.06))",
        cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: "100%",
          height: 92,
          background: place.bgColor || "var(--bg-elevated, #2A2A36)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {place.image ? (
          <img
            src={place.image}
            alt={place.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const s = e.currentTarget.nextElementSibling;
              if (s) s.style.display = "flex";
            }}
          />
        ) : null}
        <span
          style={{
            display: place.image ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
          }}
        >
          {place.emoji || "📍"}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: "8px 10px 10px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--text-main, #1C1412)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {["Hindi", "Marathi", "Sanskrit", "Gujarati"].includes(userLanguage) && place.name_mr ? place.name_mr : place.name}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-sub, #6B5B52)", marginTop: 2 }}>
          ⭐ {place.rating?.toFixed(1) || "4.8"} · {formatDistance(dynamicDistance)}
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 5,
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 7px",
            borderRadius: 10,
            background: tagStyle.bg,
            color: tagStyle.color,
          }}
        >
          {userLanguage === "Marathi" && place.tag === "Must Visit" ? "भेट दिलीच पाहिजे" : 
           userLanguage === "Marathi" && place.tag === "Iconic" ? "प्रसिद्ध" :
           userLanguage === "Marathi" && place.tag === "Family" ? "कौटुंबिक" :
           userLanguage === "Marathi" && place.tag === "New Discovery" ? "नवीन शोध" :
           userLanguage === "Hindi" && place.tag === "Must Visit" ? "जरूर जाएं" :
           userLanguage === "Hindi" && place.tag === "Iconic" ? "प्रसिद्ध" :
           userLanguage === "Hindi" && place.tag === "Family" ? "पारिवारिक" :
           userLanguage === "Hindi" && place.tag === "New Discovery" ? "नई खोज" :
           userLanguage === "Gujarati" && place.tag === "Must Visit" ? "મુલાકાત લેવા જેવું" :
           userLanguage === "Gujarati" && place.tag === "Iconic" ? "પ્રસિદ્ધ" :
           userLanguage === "Gujarati" && place.tag === "Family" ? "કૌટુંબિક" :
           userLanguage === "Gujarati" && place.tag === "New Discovery" ? "નવી શોધ" :
           place.tag}
        </div>
      </div>
    </div>
  );
});

export default PlaceCard;
