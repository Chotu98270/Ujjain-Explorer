import { useState, useMemo } from "react";
import StatusBar from "../components/StatusBar";
import { HOTELS_AND_RESTAURANTS, BUDGET_TIERS, QUALITY_TIERS } from "../data/hotelsAndRestaurantsData";
import { translations } from "../data/translations";

export default function HotelsAndRestaurantsScreen({ userLocation, userLanguage = "English" }) {
  const [selectedType, setSelectedType] = useState("all"); // "all" | "hotel" | "restaurant"
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_TIERS.ALL);
  const [selectedQuality, setSelectedQuality] = useState(QUALITY_TIERS.ALL);
  const [onlyPureVeg, setOnlyPureVeg] = useState(false);
  const [nearMahakalOnly, setNearMahakalOnly] = useState(false);
  const [minRating, setMinRating] = useState(0); // 0 or 4.7
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating"); // "rating" | "price-asc" | "price-desc" | "distance"

  // Booking / Inquiry Modal state
  const [inquiryPlace, setInquiryPlace] = useState(null);
  const [guestCount, setGuestCount] = useState(2);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingToken, setBookingToken] = useState("");

  const t = translations[userLanguage] || translations.English;
  const isHindi = userLanguage === "Hindi" || userLanguage === "Sanskrit";

  // Filtered and sorted listings
  const filteredPlaces = useMemo(() => {
    return HOTELS_AND_RESTAURANTS.filter((item) => {
      // Type filter
      if (selectedType !== "all" && item.type !== selectedType) return false;

      // Budget filter
      if (selectedBudget !== BUDGET_TIERS.ALL && item.budgetTier !== selectedBudget) return false;

      // Quality filter
      if (selectedQuality !== QUALITY_TIERS.ALL && item.qualityTier !== selectedQuality) return false;

      // Pure Veg toggle
      if (onlyPureVeg && !item.pureVeg) return false;

      // Distance toggle (< 2.0 km from Mahakal)
      if (nearMahakalOnly && item.distanceKm > 2.0) return false;

      // Rating toggle
      if (minRating > 0 && item.rating < minRating) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query) || (item.name_hi && item.name_hi.toLowerCase().includes(query));
        const matchAddress = item.address.toLowerCase().includes(query);
        const matchSpecialty = item.specialty && item.specialty.toLowerCase().includes(query);
        const matchAmenities = item.amenities.some(a => a.toLowerCase().includes(query));
        if (!matchName && !matchAddress && !matchSpecialty && !matchAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-asc") return a.pricePerNight - b.pricePerNight;
      if (sortBy === "price-desc") return b.pricePerNight - a.pricePerNight;
      if (sortBy === "distance") return a.distanceKm - b.distanceKm;
      return 0;
    });
  }, [selectedType, selectedBudget, selectedQuality, onlyPureVeg, nearMahakalOnly, minRating, searchQuery, sortBy]);

  const handleOpenInquiry = (place) => {
    setInquiryPlace(place);
    setBookingConfirmed(false);
    setBookingToken("");
  };

  const handleConfirmInquiry = (e) => {
    e.preventDefault();
    const token = "UJ-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    setBookingToken(token);
    setBookingConfirmed(true);
  };

  return (
    <div 
      className="w-full flex-1 overflow-y-auto scroll-touch transition-colors duration-300 pb-24"
      style={{ background: "var(--bg-primary, #0E0E10)", minHeight: "100%" }}
    >
      <StatusBar light={true} />

      {/* Hero Header */}
      <div
        className="w-full border-b"
        style={{
          background: "linear-gradient(135deg, #1C0F08 0%, #17130F 50%, #0E0E10 100%)",
          borderColor: "rgba(255, 153, 51, 0.25)",
          padding: "24px 16px 28px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="max-w-6xl mx-auto px-1 sm:px-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[rgba(255,153,51,0.18)] text-[#FF9933] border border-[rgba(255,153,51,0.3)]">
              🏨 {isHindi ? "उज्जैन निवास एवं खानपान" : "Ujjain Stays & Gourmet Guide"}
            </span>
            <span className="text-xs text-[#34D399] font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse"></span>
              {isHindi ? "सत्यापित गुणवत्ता" : "Verified Quality"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F7] tracking-tight font-heading">
            {isHindi ? "होटल एवं श्रेष्ठ रेस्टोरेंट" : "Top Hotels & Restaurants"}
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AF] mt-1.5 max-w-2xl leading-relaxed">
            {isHindi 
              ? "बजट व गुणवत्ता के आधार पर वर्गीकृत: धर्मशाला, बजट होटल, 5-स्टार रिसॉर्ट्स, प्रसिद्ध मालवी दाल बाफला एवं सात्विक भोजनालय।"
              : "Curated by budget & quality: Pilgrim Dharamshalas, budget stays, 5-star retreats, authentic Malwi Dal Bafla & pure satvik diners."}
          </p>

          {/* Search Box */}
          <div className="mt-4 relative max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? "होटल, दाल बाफला, पोहा, फ्रीगंज या राम घाट खोजें..." : "Search hotels, Dal Bafla, Poha, Ram Ghat, Freeganj..."}
              className="w-full py-2.5 pl-10 pr-10 rounded-xl text-xs sm:text-sm bg-[#1A1A22] text-[#F5F5F7] border border-[#2E2E3C] focus:outline-none focus:border-[#FF9933] transition-colors"
            />
            <span className="absolute left-3.5 top-3 text-[#A1A1AF] text-sm">🔍</span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-[#A1A1AF] hover:text-[#F5F5F7]"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content & Interactive Filters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        
        {/* Category Segment Control (All / Hotels / Restaurants) */}
        <div className="flex gap-2 p-1 rounded-2xl bg-[#1A1A22] border border-[#2A2A36] mb-4 max-w-md">
          <button
            onClick={() => setSelectedType("all")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedType === "all"
                ? "bg-gradient-to-r from-[#FF9933] to-[#D4AF37] text-[#0E0E10] shadow-md shadow-[#FF9933]/20"
                : "text-[#A1A1AF] hover:text-[#F5F5F7]"
            }`}
          >
            <span>🌟</span>
            <span>{isHindi ? "सभी (16)" : "All (16)"}</span>
          </button>
          <button
            onClick={() => setSelectedType("hotel")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedType === "hotel"
                ? "bg-gradient-to-r from-[#FF9933] to-[#D4AF37] text-[#0E0E10] shadow-md shadow-[#FF9933]/20"
                : "text-[#A1A1AF] hover:text-[#F5F5F7]"
            }`}
          >
            <span>🏨</span>
            <span>{isHindi ? "होटल (8)" : "Hotels (8)"}</span>
          </button>
          <button
            onClick={() => setSelectedType("restaurant")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedType === "restaurant"
                ? "bg-gradient-to-r from-[#FF9933] to-[#D4AF37] text-[#0E0E10] shadow-md shadow-[#FF9933]/20"
                : "text-[#A1A1AF] hover:text-[#F5F5F7]"
            }`}
          >
            <span>🍽️</span>
            <span>{isHindi ? "रेस्तरां (8)" : "Food (8)"}</span>
          </button>
        </div>

        {/* Budget Tiers Filters Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#FF9933] uppercase tracking-wider flex items-center gap-1">
              <span>💳</span> {isHindi ? "बजट श्रेणी (Budget Tier)" : "Filter by Budget Tier"}
            </span>
            <span className="text-[11px] text-[#A1A1AF]">
              {selectedType === "hotel" ? "होटल मूल्य प्रति रात्रि" : selectedType === "restaurant" ? "भोजन मूल्य प्रति व्यक्ति" : "किफायती से लक्ज़री"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedBudget(BUDGET_TIERS.ALL)}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                selectedBudget === BUDGET_TIERS.ALL
                  ? "bg-[#FF9933] text-[#0E0E10] border-[#FF9933]"
                  : "bg-[#1E1E26] text-[#A1A1AF] border-[#2E2E3C] hover:border-[#FF9933]/50"
              }`}
            >
              {isHindi ? "सभी बजट" : "All Budgets"}
            </button>
            <button
              onClick={() => setSelectedBudget(BUDGET_TIERS.BUDGET)}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                selectedBudget === BUDGET_TIERS.BUDGET
                  ? "bg-[#10B981] text-white border-[#10B981] shadow-sm shadow-[#10B981]/30"
                  : "bg-[#1E1E26] text-[#34D399] border-[#10B981]/30 hover:bg-[#10B981]/10"
              }`}
            >
              <span>💰</span>
              <span>{isHindi ? "सस्ता व उत्तम (<₹1,500)" : "Budget Friendly (<₹1,500)"}</span>
            </button>
            <button
              onClick={() => setSelectedBudget(BUDGET_TIERS.MID)}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                selectedBudget === BUDGET_TIERS.MID
                  ? "bg-[#3B82F6] text-white border-[#3B82F6] shadow-sm shadow-[#3B82F6]/30"
                  : "bg-[#1E1E26] text-[#60A5FA] border-[#3B82F6]/30 hover:bg-[#3B82F6]/10"
              }`}
            >
              <span>✨</span>
              <span>{isHindi ? "मध्यम वर्ग (₹1,500 – ₹3,500)" : "Mid-Range (₹1,500 – ₹3,500)"}</span>
            </button>
            <button
              onClick={() => setSelectedBudget(BUDGET_TIERS.LUXURY)}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                selectedBudget === BUDGET_TIERS.LUXURY
                  ? "bg-[#D4AF37] text-[#0E0E10] border-[#D4AF37] shadow-sm shadow-[#D4AF37]/30"
                  : "bg-[#1E1E26] text-[#FBBF24] border-[#D4AF37]/30 hover:bg-[#D4AF37]/10"
              }`}
            >
              <span>👑</span>
              <span>{isHindi ? "लक्ज़री व 5-स्टार (₹3,500+)" : "Luxury & 5-Star (₹3,500+)"}</span>
            </button>
          </div>
        </div>

        {/* Quality Tiers & Preference Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#16161D] border border-[#252532] mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#A1A1AF] mr-1">
              {isHindi ? "गुणवत्ता व फ़िल्टर:" : "Quality Filters:"}
            </span>

            {/* Quality Standard */}
            <button
              onClick={() => setSelectedQuality(selectedQuality === QUALITY_TIERS.DIAMOND ? QUALITY_TIERS.ALL : QUALITY_TIERS.DIAMOND)}
              className={`py-1 px-2.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                selectedQuality === QUALITY_TIERS.DIAMOND
                  ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
                  : "bg-[#1E1E26] border-[#2E2E3C] text-[#A1A1AF]"
              }`}
            >
              <span>💎</span>
              <span>{isHindi ? "डायमंड / म.प्र. पर्यटन" : "Diamond / Govt Certified"}</span>
            </button>

            {/* Top Rating */}
            <button
              onClick={() => setMinRating(minRating === 4.7 ? 0 : 4.7)}
              className={`py-1 px-2.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                minRating > 0
                  ? "bg-[#FF9933]/20 border-[#FF9933] text-[#FF9933]"
                  : "bg-[#1E1E26] border-[#2E2E3C] text-[#A1A1AF]"
              }`}
            >
              <span>⭐</span>
              <span>{isHindi ? "4.7+ उच्चतम रेटिंग" : "4.7+ Top Rated"}</span>
            </button>

            {/* Pure Veg */}
            <button
              onClick={() => setOnlyPureVeg(!onlyPureVeg)}
              className={`py-1 px-2.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                onlyPureVeg
                  ? "bg-[#10B981]/20 border-[#10B981] text-[#34D399]"
                  : "bg-[#1E1E26] border-[#2E2E3C] text-[#A1A1AF]"
              }`}
            >
              <span>🌿</span>
              <span>{isHindi ? "100% शुद्ध शाकाहारी" : "100% Pure Veg"}</span>
            </button>

            {/* Mahakal Proximity */}
            <button
              onClick={() => setNearMahakalOnly(!nearMahakalOnly)}
              className={`py-1 px-2.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                nearMahakalOnly
                  ? "bg-[#FF9933]/20 border-[#FF9933] text-[#FF9933]"
                  : "bg-[#1E1E26] border-[#2E2E3C] text-[#A1A1AF]"
              }`}
            >
              <span>🔱</span>
              <span>{isHindi ? "महाकाल के पास (<2 किमी)" : "Near Mahakal (<2 km)"}</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A1A1AF]">{isHindi ? "क्रम:" : "Sort:"}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#1E1E26] border border-[#2E2E3C] text-xs text-[#F5F5F7] rounded-lg py-1 px-2 focus:outline-none focus:border-[#FF9933]"
            >
              <option value="rating">{isHindi ? "रेटिंग (उच्च से निम्न)" : "Top Rated"}</option>
              <option value="price-asc">{isHindi ? "मूल्य (कम से अधिक)" : "Price: Low to High"}</option>
              <option value="price-desc">{isHindi ? "मूल्य (अधिक से कम)" : "Price: High to Low"}</option>
              <option value="distance">{isHindi ? "दूरी (महाकाल के निकटतम)" : "Distance to Mahakal"}</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="text-xs text-[#A1A1AF]">
            {isHindi 
              ? `कुल ${filteredPlaces.length} विकल्प उपलब्ध` 
              : `Showing ${filteredPlaces.length} verified stays & eateries`}
          </div>
          {(selectedBudget !== BUDGET_TIERS.ALL || selectedQuality !== QUALITY_TIERS.ALL || onlyPureVeg || nearMahakalOnly || minRating > 0 || searchQuery) && (
            <button
              onClick={() => {
                setSelectedBudget(BUDGET_TIERS.ALL);
                setSelectedQuality(QUALITY_TIERS.ALL);
                setOnlyPureVeg(false);
                setNearMahakalOnly(false);
                setMinRating(0);
                setSearchQuery("");
              }}
              className="text-xs text-[#FF9933] hover:underline"
            >
              {isHindi ? "फ़िल्टर हटाएं" : "Reset Filters"}
            </button>
          )}
        </div>

        {/* Listings Grid */}
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-16 bg-[#16161D] rounded-2xl border border-[#2A2A36]">
            <span className="text-4xl">🏨</span>
            <div className="text-base font-bold text-[#F5F5F7] mt-3">
              {isHindi ? "कोई परिणाम नहीं मिला" : "No Matching Hotels or Restaurants"}
            </div>
            <div className="text-xs text-[#A1A1AF] mt-1">
              {isHindi ? "कृपया अपने फ़िल्टर बदलकर पुनः प्रयास करें।" : "Try adjusting your budget or quality filters."}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlaces.map((place) => {
              const isHotel = place.type === "hotel";
              return (
                <div
                  key={place.id}
                  className="rounded-2xl border border-[#2A2A36] bg-[#16161D] overflow-hidden shadow-lg hover:border-[#FF9933]/60 transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Image & Badges Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#22222B]">
                    <img
                      src={place.image}
                      alt={place.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.src = isHotel 
                          ? "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                          : "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-black/30 to-black/40"></div>

                    {/* Top Row Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      {/* Budget Badge */}
                      <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md ${
                        place.budgetTier === "budget"
                          ? "bg-[#10B981]/90 text-white"
                          : place.budgetTier === "mid"
                          ? "bg-[#3B82F6]/90 text-white"
                          : "bg-[#D4AF37]/90 text-[#0E0E10]"
                      }`}>
                        {isHindi ? place.budgetLabel_hi : place.budgetLabel}
                      </span>

                      {/* Type and Pure Veg icon */}
                      <div className="flex items-center gap-1.5">
                        {place.pureVeg && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/80 text-white backdrop-blur-md">
                            🌿 Pure Veg
                          </span>
                        )}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-black/60 text-[#F5F5F7] backdrop-blur-md border border-white/10 font-bold">
                          {isHotel ? "🏨 Hotel" : "🍽️ Food"}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Image Overlay Details */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-[#FF9933] uppercase tracking-wider">
                          {isHindi ? place.subType_hi : place.subType}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-md">
                          {isHindi ? (place.name_hi || place.name) : place.name}
                        </h3>
                      </div>
                      
                      {/* Rating pill */}
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/15">
                        <span className="text-[#FF9933] text-xs">⭐</span>
                        <span className="text-xs font-bold text-white">{place.rating}</span>
                        <span className="text-[10px] text-[#A1A1AF]">({place.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Quality & Distance tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        <span className="text-[11px] font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-md border border-[#D4AF37]/25 flex items-center gap-1">
                          <span>🏆</span>
                          <span>{isHindi ? place.qualityBadge_hi : place.qualityBadge}</span>
                        </span>

                        <span className="text-[11px] font-medium text-[#60A5FA] bg-[#3B82F6]/10 px-2.5 py-0.5 rounded-md border border-[#3B82F6]/25 flex items-center gap-1">
                          <span>📍</span>
                          <span>{isHindi ? place.distanceDisplay_hi : place.distanceDisplay}</span>
                        </span>
                      </div>

                      {/* Description / Highlight */}
                      <p className="text-xs text-[#A1A1AF] leading-relaxed mb-3">
                        {isHindi ? place.highlight_hi : place.highlight}
                      </p>

                      {/* Specialty Dish (for Restaurants) or Key Room Perk (for Hotels) */}
                      {place.specialty && (
                        <div className="p-2 rounded-xl bg-[#1E1E26] border border-[#2E2E3C] mb-3 text-xs">
                          <span className="font-bold text-[#FF9933]">{isHindi ? "✨ खास व्यंजन: " : "✨ Signature Dish: "}</span>
                          <span className="text-[#F5F5F7]">{isHindi ? place.specialty_hi : place.specialty}</span>
                        </div>
                      )}

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {place.amenities.slice(0, 4).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-[#22222B] text-[#A1A1AF] border border-[#2E2E3C]"
                          >
                            ✓ {amenity}
                          </span>
                        ))}
                        {place.amenities.length > 4 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-[#A1A1AF]">
                            +{place.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pricing and Action Buttons */}
                    <div className="pt-3 border-t border-[#2A2A36] mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] text-[#A1A1AF]">
                          {isHotel ? (isHindi ? "अनुमानित किराया" : "Tariff from") : (isHindi ? "औसत खर्च" : "Approx cost")}
                        </div>
                        <div className="text-base font-extrabold text-[#34D399]">
                          {place.priceDisplay}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Phone Call */}
                        {place.phone && (
                          <a
                            href={`tel:${place.phone}`}
                            className="p-2 rounded-xl bg-[#22222B] border border-[#2E2E3C] text-xs text-[#F5F5F7] hover:border-[#FF9933] flex items-center justify-center transition-colors"
                            title={isHindi ? "फोन करें" : "Call Phone"}
                          >
                            📞
                          </a>
                        )}

                        {/* Directions / Maps */}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-3 rounded-xl bg-[#22222B] border border-[#2E2E3C] text-xs font-semibold text-[#F5F5F7] hover:border-[#FF9933] flex items-center gap-1 transition-colors"
                        >
                          <span>🗺️</span>
                          <span>{isHindi ? "दिशा" : "Directions"}</span>
                        </a>

                        {/* Inquiry / Booking Button */}
                        <button
                          onClick={() => handleOpenInquiry(place)}
                          className="flex-1 sm:flex-none py-1.5 px-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF9933] to-[#D4AF37] text-[#0E0E10] shadow-sm hover:brightness-110 transition-all flex items-center justify-center gap-1"
                        >
                          <span>🛎️</span>
                          <span>{isHotel ? (isHindi ? "कमरा बुक करें" : "Book Room") : (isHindi ? "टेबल बुक करें" : "Reserve Table")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 🛎️ Interactive Booking & Inquiry Modal */}
      {inquiryPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#16161D] rounded-2xl border border-[#2E2E3C] p-5 shadow-2xl overflow-hidden relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A36] mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#FF9933] uppercase tracking-wider">
                  {inquiryPlace.type === "hotel" ? "🏨 Quick Room Reservation" : "🍽️ Table & Meal Reservation"}
                </span>
                <h3 className="text-base font-bold text-[#F5F5F7]">
                  {isHindi ? (inquiryPlace.name_hi || inquiryPlace.name) : inquiryPlace.name}
                </h3>
              </div>
              <button
                onClick={() => setInquiryPlace(null)}
                className="w-7 h-7 rounded-full bg-[#22222B] text-[#A1A1AF] flex items-center justify-center text-xs hover:text-white"
              >
                ✕
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-[#10B981]/20 border border-[#10B981] text-[#34D399] text-2xl flex items-center justify-center mx-auto mb-3">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-white">
                  {isHindi ? "बुकिंग अनुरोध दर्ज हुआ!" : "Reservation Request Sent!"}
                </h4>
                <p className="text-xs text-[#A1A1AF] mt-1 max-w-xs mx-auto">
                  {isHindi 
                    ? "होटल / रेस्तरां काउंटर द्वारा आपके नंबर पर पुष्टिकरण भेजा जाएगा।"
                    : "The desk will confirm your slot upon arrival or via WhatsApp."}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-[#1E1E26] border border-[#2E2E3C] text-left">
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-[#A1A1AF]">{isHindi ? "बुकिंग टोकन:" : "Token ID:"}</span>
                    <span className="font-mono font-bold text-[#FF9933]">{bookingToken}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-[#A1A1AF]">{isHindi ? "दिनांक:" : "Date:"}</span>
                    <span className="text-[#F5F5F7] font-semibold">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-[#A1A1AF]">{isHindi ? "यात्री संख्या:" : "Guests:"}</span>
                    <span className="text-[#F5F5F7] font-semibold">{guestCount} {isHindi ? "व्यक्ति" : "Persons"}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-[#A1A1AF]">{isHindi ? "स्थान / संपर्क:" : "Location Desk:"}</span>
                    <span className="text-[#34D399] font-semibold">{inquiryPlace.phone}</span>
                  </div>
                </div>

                <button
                  onClick={() => setInquiryPlace(null)}
                  className="mt-5 w-full py-2.5 rounded-xl bg-[#FF9933] text-[#0E0E10] font-bold text-xs"
                >
                  {isHindi ? "पूर्ण करें" : "Done"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmInquiry} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-[#A1A1AF] mb-1 block">
                    {inquiryPlace.type === "hotel" ? (isHindi ? "चेक-इन तिथि:" : "Check-in Date:") : (isHindi ? "भोजन तिथि:" : "Dining Date:")}
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-[#2E2E3C] rounded-xl py-2 px-3 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#FF9933]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#A1A1AF] mb-1 block">
                    {isHindi ? "यात्रियों / अतिथियों की संख्या:" : "Number of Guests:"}
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 4, 6].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setGuestCount(num)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                          guestCount === num
                            ? "bg-[#FF9933] text-[#0E0E10] border-[#FF9933]"
                            : "bg-[#1A1A22] text-[#A1A1AF] border-[#2E2E3C]"
                        }`}
                      >
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#A1A1AF] mb-1 block">
                    {isHindi ? "आपका नाम व फोन नंबर:" : "Contact Person & Phone:"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isHindi ? "उदा. राहुल शर्मा, 98XXXXXXXX" : "e.g. Rahul Sharma, +91 98XXXXXXXX"}
                    className="w-full bg-[#1A1A22] border border-[#2E2E3C] rounded-xl py-2 px-3 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#FF9933]"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-[#1A1A22] border border-[#2A2A36] text-[11px] text-[#A1A1AF]">
                  ℹ️ {inquiryPlace.type === "hotel" 
                    ? (isHindi ? "कमरा आरक्षण निःशुल्क आरंभ होगा। भुगतान होटल चेक-इन पर मान्य है।" : "Room lock is free. Tariff payable at check-in counter.")
                    : (isHindi ? "पारिवारिक टेबल प्राथमिकता से आरक्षित रखी जाएगी।" : "Priority family table reserved for 30 minutes.")}
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setInquiryPlace(null)}
                    className="flex-1 py-2 rounded-xl bg-[#22222B] text-[#A1A1AF] text-xs font-semibold"
                  >
                    {isHindi ? "रद्द करें" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#D4AF37] text-[#0E0E10] text-xs font-bold shadow-md"
                  >
                    {isHindi ? "आरक्षण पुष्टि करें" : "Confirm Booking"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
