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
      className="w-[160px] sm:w-auto flex-shrink-0 sm:flex-shrink rounded-2xl overflow-hidden border border-[var(--border-color,rgba(212,175,55,0.25))] bg-[var(--bg-card,#22222B)] shadow-[var(--card-shadow,0_4px_14px_rgba(0,0,0,0.12))] cursor-pointer hover:scale-[1.02] transition-transform duration-200"
    >
      {/* Thumbnail */}
      <div
        className="w-full h-[98px] sm:h-[135px] relative overflow-hidden flex items-center justify-center text-4xl"
        style={{
          background: place.bgColor || "var(--bg-elevated, #2A2A36)",
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
            fontSize: 34,
          }}
        >
          {place.emoji || "📍"}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px 12px" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--text-main, #F5F5F7)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {["Hindi", "Marathi", "Sanskrit", "Gujarati"].includes(userLanguage) && place.name_mr ? place.name_mr : place.name}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 3 }}>
          ⭐ {place.rating?.toFixed(1) || "4.8"} · {formatDistance(dynamicDistance)}
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 6,
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 8px",
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
