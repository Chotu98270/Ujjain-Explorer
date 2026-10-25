import { useState, useEffect, useRef } from "react";
import StatusBar from "../components/StatusBar";
import PlaceListItem from "../components/PlaceListItem";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { fetchPlaces, fetchUserStats } from "../data/api";
import { colors } from "../data/tokens";
import { translations } from "../data/translations";

const languageOptions = [
  { code: "English", label: "English" },
  { code: "Marathi", label: "मराठी (Marathi)" },
  { code: "Hindi", label: "हिन्दी (Hindi)" },
  { code: "Gujarati", label: "ગુજરાતી (Gujarati)" },
  { code: "Tamil", label: "தமிழ் (Tamil)" },
  { code: "Telugu", label: "తెలుగు (Telugu)" },
  { code: "Kannada", label: "ಕನ್ನಡ (Kannada)" },
  { code: "Bengali", label: "বাংলা (Bengali)" },
  { code: "Punjabi", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "Malayalam", label: "മലയാളം (Malayalam)" },
  { code: "Odia", label: "ଓଡ଼ିଆ (Odia)" },
  { code: "Urdu", label: "اردو (Urdu)" },
  { code: "Assamese", label: "অસમীয়া (Assamese)" },
  { code: "Maithili", label: "मैथिली (Maithili)" },
  { code: "Sanskrit", label: "संस्कृतम् (Sanskrit)" }
];

// Helper to scale & optimize user avatar for storage across iOS, Android, and Web
const processImageFile = (file, callback) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 320;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
      callback(dataUrl);
    };
    img.onerror = () => {
      callback(e.target.result);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

export default function ProfileScreen({ onPlaceSelect, userLocation, userLanguage, setUserLanguage, onLogout, onOpenAuth, user }) {
  const token = localStorage.getItem("pune_auth_token");
  const directFileInputRef = useRef(null);
  const [photoToast, setPhotoToast] = useState("");

  // User Personalization State with automatic prop/storage synchronization
  const [userName, setUserName] = useState(() => {
    if (user?.name) return user.name;
    const stored = localStorage.getItem("pune_user_name");
    if (stored) return stored;
    return token ? "Yatri" : (userLanguage === "Hindi" ? "अवन्तिका यात्री" : "Ujjain Yatri");
  });

  const [userBio, setUserBio] = useState(() => {
    return localStorage.getItem("pune_user_bio") || (token ? "Mahakal Pilgrim · Ujjain Explorer" : (userLanguage === "Hindi" ? "महाकाल की नगरी अवन्तिका दर्शन 🕉️" : "Exploring the Sacred City of Mahakal 🕉️"));
  });

  const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem("pune_user_avatar") || null);
  
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [discoveredPlaces, setDiscoveredPlaces] = useState([]);
  const [stats, setStats] = useState({ totalPoints: 0, savedCount: 0, completedStops: 0, discoveredCount: 0 });
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveTab] = useState("bookmarks"); // 'bookmarks', 'discoveries', 'activity'
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isContributorsModalOpen, setIsContributorsModalOpen] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempBio, setTempBio] = useState(userBio);
  const [tempAvatar, setTempAvatar] = useState(userAvatar);
  const [tempLanguage, setTempLanguage] = useState(userLanguage);

  const t = translations[userLanguage] || translations.English;

  // Synchronize state when user prop updates
  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    } else {
      const stored = localStorage.getItem("pune_user_name");
      if (stored) {
        setUserName(stored);
      } else {
        setUserName(userLanguage === "Hindi" ? "अवन्तिका यात्री" : "Ujjain Yatri");
      }
    }

    const storedBio = localStorage.getItem("pune_user_bio");
    if (storedBio) setUserBio(storedBio);

    const storedAvatar = localStorage.getItem("pune_user_avatar");
    if (storedAvatar) setUserAvatar(storedAvatar);
  }, [user, userLanguage]);

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      const authToken = localStorage.getItem("pune_auth_token");
      try {
        const [savedData, discoveredData, statsData] = await Promise.all([
          fetchPlaces({ isSaved: true }),
          fetchPlaces({ isDiscovered: true }),
          authToken ? fetchUserStats().catch(() => ({ totalPoints: 0, savedCount: 0, completedStops: 0, discoveredCount: 0 })) : Promise.resolve({ totalPoints: 0, savedCount: 0, completedStops: 0, discoveredCount: 0 })
        ]);
        setSavedPlaces(savedData || []);
        setDiscoveredPlaces(discoveredData || []);
        setStats(statsData || { totalPoints: 0, savedCount: 0, completedStops: 0, discoveredCount: 0 });
      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [user]);

  const getPunekarLevel = (pts) => {
    if (pts >= 1000) return { title: userLanguage === "Hindi" ? "सिंहस्थ सम्राट" : userLanguage === "Sanskrit" ? "सिंहस्थ चक्रवर्ती" : "SIMHASTHA LEGEND", icon: "👑", rank: 1 };
    if (pts >= 500) return { title: userLanguage === "Hindi" ? "महाकाल सेवक" : userLanguage === "Sanskrit" ? "महाकाल भक्तः" : "MAHAKAL SEVAK", icon: "🔱", rank: 21 };
    if (pts >= 101) return { title: userLanguage === "Hindi" ? "अवन्तिका दर्शनार्थी" : userLanguage === "Sanskrit" ? "अवन्तिका पथिकः" : "AVANTIKA DARSHAK", icon: "🛕", rank: 108 };
    return { title: userLanguage === "Hindi" ? "नविन यात्री" : userLanguage === "Sanskrit" ? "नूतन यात्री" : "NAVIN YATRI", icon: "🌱", rank: 540 };
  };

  const currentLevel = getPunekarLevel(stats.totalPoints);

  const handleSaveProfile = () => {
    setUserName(tempName);
    setUserBio(tempBio);
    setUserAvatar(tempAvatar);
    localStorage.setItem("pune_user_name", tempName);
    localStorage.setItem("pune_user_bio", tempBio);
    if (tempAvatar) {
      localStorage.setItem("pune_user_avatar", tempAvatar);
    } else {
      localStorage.removeItem("pune_user_avatar");
    }
    setUserLanguage(tempLanguage);
    setIsEditModalOpen(false);
  };

  const handleDirectAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, (dataUrl) => {
        setUserAvatar(dataUrl);
        setTempAvatar(dataUrl);
        try {
          localStorage.setItem("pune_user_avatar", dataUrl);
          setPhotoToast(userLanguage === "Hindi" ? "प्रोफ़ाइल फ़ोटो सफलतापूर्वक अपडेट की गई! 📸" : "Profile photo updated successfully! 📸");
          setTimeout(() => setPhotoToast(""), 3000);
        } catch (err) {
          console.warn("Could not save avatar to localStorage:", err);
        }
      });
    }
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation();
    setUserAvatar(null);
    setTempAvatar(null);
    localStorage.removeItem("pune_user_avatar");
    if (directFileInputRef.current) {
      directFileInputRef.current.value = "";
    }
    setPhotoToast(userLanguage === "Hindi" ? "फ़ोटो हटा दी गई" : "Photo removed");
    setTimeout(() => setPhotoToast(""), 2500);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, (dataUrl) => {
        setTempAvatar(dataUrl);
      });
    }
  };

  if (loading) {
    return (
      <div style={{ background: "var(--bg-primary, #0E0E10)", minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--accent-primary, #FF9933)", fontWeight: 700, fontSize: 14 }}>
          {userLanguage === "Marathi" ? "प्रोफाइल लोड होत आहे..." :
           userLanguage === "Hindi" ? "प्रोफ़ाइल लोड हो रही है..." :
           userLanguage === "Gujarati" ? "પ્રોફાઇલ લોડ થઈ રહી છે..." :
           "Loading profile..."}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: "var(--bg-primary, #0E0E10)", 
      height: "100%", 
      overflowY: "auto", 
      paddingBottom: 84, 
      fontFamily: "var(--font-body, 'Mukta', sans-serif)", 
      position: "relative",
      color: "var(--text-main, #F5F5F7)"
    }}>
      <StatusBar light />

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{ 
            background: "var(--bg-surface, #18181D)", 
            width: "100%", 
            maxWidth: 400, 
            borderRadius: 20, 
            padding: 24, 
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            border: "1px solid var(--border-color, rgba(212,175,55,0.3))"
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main, #F5F5F7)", marginBottom: 20 }}>
              {t.editProfileModal}
            </div>
            
            {/* Avatar Edit Section */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
              <label style={{ position: "relative", cursor: "pointer" }}>
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: "50%",
                    background: "var(--bg-card, #22222B)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 40,
                    border: "3.5px solid var(--accent-secondary, #D4AF37)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {tempAvatar ? (
                    <img 
                      src={tempAvatar} 
                      alt="Avatar Preview" 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <div style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 28, height: 28, borderRadius: "50%",
                  background: "var(--accent-primary, #FF9933)", color: "#0E0E10",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, border: "2px solid #fff", fontWeight: 700
                }}>
                  📷
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
              <div style={{ fontSize: 11, color: "var(--text-muted, #A1A1AF)", marginTop: 8 }}>{t.changePhoto}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted, #A1A1AF)", marginBottom: 6 }}>{t.displayName}</div>
              <input 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                style={{ 
                  width: "100%", padding: "12px", borderRadius: 10, 
                  border: "1px solid var(--border-subtle, #2E2E3C)",
                  background: "var(--bg-card, #22222B)", color: "var(--text-main, #F5F5F7)",
                  fontSize: 14, outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted, #A1A1AF)", marginBottom: 6 }}>{t.bio}</div>
              <input 
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                style={{ 
                  width: "100%", padding: "12px", borderRadius: 10, 
                  border: "1px solid var(--border-subtle, #2E2E3C)",
                  background: "var(--bg-card, #22222B)", color: "var(--text-main, #F5F5F7)",
                  fontSize: 14, outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted, #A1A1AF)", marginBottom: 6 }}>{t.language}</div>
              <select
                value={tempLanguage}
                onChange={(e) => setTempLanguage(e.target.value)}
                style={{ 
                  width: "100%", padding: "12px", borderRadius: 10, 
                  border: "1px solid var(--border-subtle, #2E2E3C)",
                  background: "var(--bg-card, #22222B)", color: "var(--text-main, #F5F5F7)",
                  fontSize: 14, outline: "none", cursor: "pointer", boxSizing: "border-box"
                }}
              >
                {languageOptions.map(lang => (
                  <option key={lang.code} value={lang.code} style={{ background: "#18181D", color: "#F5F5F7" }}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                style={{ 
                  flex: 1, padding: "12px", borderRadius: 12, 
                  border: "1px solid var(--border-subtle, #2E2E3C)", 
                  background: "transparent", color: "var(--text-sub, #A1A1AF)",
                  fontWeight: 600, cursor: "pointer" 
                }}
              >
                {t.cancel}
              </button>
              <button 
                onClick={handleSaveProfile}
                style={{ 
                  flex: 1, padding: "12px", borderRadius: 12, border: "none", 
                  background: "var(--cta-bg, linear-gradient(135deg, #FF9933 0%, #D4AF37 100%))", 
                  color: "var(--cta-text, #0E0E10)", fontWeight: 700, cursor: "pointer" 
                }}
              >
                {t.saveChanges}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header Banner */}
      <div
        style={{
          background: "var(--hero-gradient, linear-gradient(145deg, #1C0F08 0%, #0E0E10 100%))",
          borderBottom: "1px solid var(--hero-border, rgba(255,153,51,0.25))",
          padding: "36px 16px 44px",
          position: "relative",
          overflow: "hidden",
        }}
        className="w-full"
      >
        {/* Subtle decorative aura */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute", top: -20, right: -20,
              width: 140, height: 140, borderRadius: "50%",
              background: "rgba(255,153,51,0.12)",
            }}
          />
          <div
            style={{
              position: "absolute", bottom: -30, left: -20,
              width: 120, height: 120, borderRadius: "50%",
              background: "rgba(212,175,55,0.08)",
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Profile Avatar Center with Direct Click-to-Upload */}
          <div style={{ position: "relative", display: "inline-block", margin: "0 auto 8px" }}>
            <label
              htmlFor="direct-profile-avatar-input"
              style={{ cursor: "pointer", display: "block", position: "relative" }}
              title={userLanguage === "Hindi" ? "फ़ोटो अपलोड करने के लिए क्लिक करें" : "Click to upload profile photo"}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: "var(--bg-card, #22222B)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 44,
                  border: "3.5px solid var(--accent-secondary, #D4AF37)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
                  overflow: "hidden",
                  position: "relative",
                  transition: "transform 0.2s ease",
                }}
                className="hover:scale-105"
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={() => setUserAvatar(null)}
                  />
                ) : (
                  <span style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>👤</span>
                )}
              </div>

              {/* Camera Upload Badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--accent-primary, #FF9933)",
                  color: "#0E0E10",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  border: "2.5px solid #18181D",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.45)",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                }}
                className="hover:scale-110"
                title={userLanguage === "Hindi" ? "फ़ोटो बदलें" : "Upload photo"}
              >
                📷
              </div>
            </label>

            <input
              id="direct-profile-avatar-input"
              ref={directFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleDirectAvatarUpload}
              style={{ display: "none" }}
            />
          </div>

          {/* Quick Photo Upload & Remove Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
            <button
              type="button"
              onClick={() => directFileInputRef.current?.click()}
              style={{
                background: "rgba(255, 153, 51, 0.15)",
                border: "1px solid var(--accent-primary, #FF9933)",
                color: "var(--accent-primary, #FF9933)",
                borderRadius: 20,
                padding: "4px 14px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                transition: "all 0.15s ease",
              }}
              className="hover:opacity-90 active:scale-95"
            >
              <span>📷</span>
              <span>{userAvatar ? (userLanguage === "Hindi" ? "फ़ोटो बदलें" : "Change Photo") : (userLanguage === "Hindi" ? "फ़ोटो अपलोड करें" : "Upload Photo")}</span>
            </button>

            {userAvatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                style={{
                  background: "rgba(231, 76, 60, 0.15)",
                  border: "1px solid rgba(231, 76, 60, 0.4)",
                  color: "#E74C3C",
                  borderRadius: 20,
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                className="hover:opacity-90 active:scale-95"
                title="Remove photo"
              >
                ✕ {userLanguage === "Hindi" ? "हटाएं" : "Remove"}
              </button>
            )}
          </div>

          {/* Upload Feedback Toast */}
          {photoToast && (
            <div style={{
              display: "inline-block",
              background: "rgba(46, 204, 113, 0.2)",
              border: "1px solid rgba(46, 204, 113, 0.5)",
              color: "#2ECC71",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 12,
              marginBottom: 8,
              animation: "fadeInBackdrop 0.2s ease-out forwards",
            }}>
              {photoToast}
            </div>
          )}

          {/* High-visibility Username and Bio */}
          <div style={{ 
            fontSize: 22, 
            fontWeight: 800, 
            color: "#FFFFFF", 
            letterSpacing: "0.3px",
            fontFamily: "var(--font-heading, serif)",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)"
          }}>
            {userName}
          </div>
          
          <div style={{ 
            fontSize: 13, 
            color: "rgba(255,255,255,0.85)", 
            marginTop: 4,
            maxWidth: 320,
            marginInline: "auto",
            lineHeight: "18px"
          }}>
            {userBio}
          </div>
          
          {/* Pilgrim Level Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 16,
            background: "var(--cta-bg, linear-gradient(135deg, #FF9933 0%, #D4AF37 100%))",
            padding: "6px 16px",
            borderRadius: 20,
            boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.35)"
          }}>
            <span style={{ fontSize: 14 }}>{currentLevel.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--cta-text, #0E0E10)", letterSpacing: 0.5 }}>
              {t.punekarLevel}: {currentLevel.title}
            </span>
          </div>
        </div>
      </div>

      {/* Stats & Rank Card */}
      <div className="w-full px-4 relative z-20" style={{ marginTop: -22, marginBottom: 20 }}>
        <div 
          className="max-w-4xl mx-auto p-4 rounded-2xl"
          style={{ 
            background: "var(--bg-card, #22222B)", 
            boxShadow: "var(--card-shadow, 0 8px 25px rgba(0,0,0,0.3))",
            border: "1px solid var(--border-color, rgba(212,175,55,0.22))",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16, borderBottom: "1px solid var(--border-subtle, #2E2E3C)", paddingBottom: 16 }}>
            {[
              { label: t.saved, val: stats.savedCount, color: "var(--accent-primary, #FF9933)" },
              { label: t.points, val: stats.totalPoints, color: "var(--accent-secondary, #D4AF37)" },
              { label: t.stops, val: stats.completedStops, color: "#4EA8DE" },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: stat.color }}>{stat.val}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted, #A1A1AF)", textTransform: "uppercase" }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,153,51,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏆</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main, #F5F5F7)" }}>{t.communityRank}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted, #A1A1AF)" }}>
                  {userLanguage === "Marathi" ? `${stats.totalPoints} गुणांवर आधारित` : `Based on ${stats.totalPoints} points`}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--accent-primary, #FF9933)" }}>#{currentLevel.rank} {t.rankInPune}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full border-b border-[var(--border-subtle,#2E2E3C)]">
        <div className="max-w-4xl mx-auto flex gap-5 px-4 overflow-x-auto">
          {[
            { id: "bookmarks", label: t.saved },
            { id: "discoveries", label: t.discoveries },
            { id: "activity", label: t.badges },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                padding: "12px 4px", fontSize: 13, fontWeight: 700, border: "none", background: "none", cursor: "pointer",
                color: activeSubTab === tab.id ? "var(--accent-primary, #FF9933)" : "var(--text-muted, #A1A1AF)",
                borderBottom: activeSubTab === tab.id ? "3px solid var(--accent-primary, #FF9933)" : "3px solid transparent",
                whiteSpace: "nowrap"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 flex-1 min-h-[180px] pt-3">
        {activeSubTab === "bookmarks" && (
          <div>
            {savedPlaces.length === 0 ? (
              <div style={{ padding: "48px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔖</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main, #F5F5F7)" }}>{t.noTreasureMsg}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted, #A1A1AF)", marginTop: 6 }}>{t.saveSpotsMsg}</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 p-2 sm:p-4">
                {savedPlaces.map((place) => (
                  <PlaceListItem key={place.id} place={place} onClick={onPlaceSelect} userLocation={userLocation} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeSubTab === "discoveries" && (
          <div>
            {discoveredPlaces.length === 0 ? (
              <div style={{ padding: "48px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔎</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main, #F5F5F7)" }}>{t.noDiscoveriesMsg}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted, #A1A1AF)", marginTop: 6, padding: "0 40px" }}>
                  {userLanguage === "Hindi" ? "उज्जैन मार्गदर्शिका में योगदान देने के लिए एक्सप्लोर टैब में नए स्थान खोजें!" : userLanguage === "Marathi" ? "पुणे मार्गदर्शिका मध्ये योगदान देण्यासाठी एक्सप्लोर टॅबमध्ये नवीन ठिकाणे शोधा!" : "Search for new places in the Explore tab to contribute to the Ujjain Guide!"}
                </div>
              </div>
            ) : (
              <div className="p-2 sm:p-4">
                <div style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "var(--accent-primary, #FF9933)", background: "rgba(255,153,51,0.12)", borderRadius: 12, marginBottom: 10 }}>
                  {t.contributionsMsg}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {discoveredPlaces.map((place) => (
                    <PlaceListItem key={place.id} place={place} onClick={onPlaceSelect} userLocation={userLocation} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeSubTab === "activity" && (
          <div style={{ padding: "20px 16px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main, #F5F5F7)", marginBottom: 16 }}>{t.earnedBadges}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: "🏰", name: userLanguage === "Hindi" ? "इतिहास प्रेमी" : userLanguage === "Marathi" ? "इतिहास प्रेमी" : "History Buff", active: stats.totalPoints > 200 },
                { icon: "🍽️", name: userLanguage === "Hindi" ? "प्रसाद एवं खानपान" : userLanguage === "Marathi" ? "खवय्ये" : "Foodie", active: stats.totalPoints > 400 },
                { icon: "⛩️", name: userLanguage === "Hindi" ? "महाकाल भक्त" : userLanguage === "Marathi" ? "भक्त" : "Devotee", active: stats.totalPoints > 100 },
                { icon: "🥾", name: userLanguage === "Hindi" ? "घाट पदयात्री" : userLanguage === "Marathi" ? "गिर्यारोहक" : "Trekker", active: stats.totalPoints > 800 },
              ].map(badge => (
                <div key={badge.name} style={{ 
                  background: badge.active ? "var(--bg-card, #22222B)" : "var(--bg-surface, #18181D)", 
                  borderRadius: 12, padding: "12px", border: `1px solid ${badge.active ? "var(--border-color, rgba(212,175,55,0.3))" : "var(--border-subtle, #2E2E3C)"}`,
                  display: "flex", alignItems: "center", gap: 10,
                  opacity: badge.active ? 1 : 0.45
                }}>
                  <div style={{ fontSize: 24, filter: badge.active ? "none" : "grayscale(1)" }}>{badge.icon}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main, #F5F5F7)" }}>{badge.name}</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted, #A1A1AF)" }}>{badge.active ? t.unlocked : t.locked}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ 
              marginTop: 24, padding: "16px", borderRadius: 12, background: "rgba(255,153,51,0.08)",
              border: "1px dashed var(--accent-primary, #FF9933)"
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-primary, #FF9933)" }}>{t.pointsBreakdown}</div>
              <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 6, lineHeight: 1.6 }}>
                • {stats.savedCount} {t.placesSaved} (+{stats.savedCount * 10} {t.points})<br/>
                • {stats.completedStops} {t.stopsCompleted} (+{stats.completedStops * 50} {t.points})<br/>
                • {stats.discoveredCount} {t.newDiscoveries} (+{stats.discoveredCount * 100} {t.points})
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 text-center bg-transparent">
        {token ? (
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button 
              onClick={() => {
                setTempName(userName);
                setTempBio(userBio);
                setTempAvatar(userAvatar);
                setTempLanguage(userLanguage);
                setIsEditModalOpen(true);
              }}
              style={{ 
                background: "var(--bg-card, #22222B)", border: "1px solid var(--border-color, rgba(212,175,55,0.3))", borderRadius: 10,
                padding: "8px 20px", fontSize: 12, fontWeight: 600, color: "var(--text-main, #F5F5F7)", cursor: "pointer"
              }}
            >
              {t.editProfile}
            </button>
            <button 
              onClick={onLogout}
              style={{ 
                background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.4)", borderRadius: 10,
                padding: "8px 20px", fontSize: 12, fontWeight: 600, color: "#E74C3C", cursor: "pointer"
              }}
            >
              {userLanguage === "Marathi" ? "लॉगआउट" : userLanguage === "Hindi" ? "लॉगआउट" : "Logout"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted, #A1A1AF)", maxWidth: 280, margin: "0 auto" }}>
              {userLanguage === "Hindi" 
                ? "अपने दर्शन बिंदु और सहेजे गए पावन स्थल सुरक्षित रखने हेतु लॉगिन करें।"
                : userLanguage === "Marathi" 
                ? "आपले गुण आणि सेव्ह केलेली ठिकाणे सुरक्षित ठेवण्यासाठी लॉगिन करा." 
                : "Log in or register to sync your bookmarks, record visited spots, and earn Yatri XP!"}
            </p>
            {onOpenAuth && (
              <button 
                onClick={onOpenAuth}
                style={{ 
                  background: "var(--cta-bg, linear-gradient(135deg, #FF9933 0%, #D4AF37 100%))", border: "none", borderRadius: 12,
                  padding: "10px 24px", fontSize: 13, fontWeight: 700, color: "var(--cta-text, #0E0E10)", cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(255,153,51,0.25)"
                }}
              >
                {userLanguage === "Hindi" ? "लॉगिन / यात्री पंजीकरण 🚩" : userLanguage === "Marathi" ? "लॉगिन / नोंदणी करा 🚩" : "Log In / Register 🚩"}
              </button>
            )}
          </div>
        )}

        {/* Visual Appearance & Theme Settings */}
        <div style={{ 
          marginTop: 20, 
          padding: "16px 14px", 
          background: "var(--bg-card, #22222B)", 
          borderRadius: 16, 
          border: "1px solid var(--border-color, rgba(212,175,55,0.25))",
          boxShadow: "var(--card-shadow, 0 4px 14px rgba(0,0,0,0.15))",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main, #F5F5F7)" }}>
              {userLanguage === "Hindi" ? "🎨 दृश्य थीम (Sacred Themes)" : "🎨 Visual Appearance & Theme"}
            </div>
            <div style={{ fontSize: 10, color: "var(--accent-primary, #FF9933)", fontWeight: 700 }}>
              {userLanguage === "Hindi" ? "३ सांस्कृतिक शैलियाँ" : "3 Cultural Styles"}
            </div>
          </div>
          <ThemeSwitcher variant="full" userLanguage={userLanguage} />
        </div>

        {/* Version & Contributor Acknowledgements Banner */}
        <div style={{ 
          marginTop: 20, 
          padding: "16px 14px", 
          background: "var(--bg-card, #22222B)", 
          borderRadius: 14, 
          border: "1px solid var(--border-subtle, #2E2E3C)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          textAlign: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ 
              fontSize: 10, 
              fontWeight: 700, 
              padding: "2px 8px", 
              borderRadius: 6, 
              background: "rgba(255,153,51,0.15)", 
              color: "var(--accent-primary, #FF9933)",
              letterSpacing: "0.5px"
            }}>
              {t.versionText || "Release 1.1.0"}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main, #F5F5F7)" }}>
              Ujjain Explorer
            </span>
          </div>

          <p style={{ fontSize: 11, color: "var(--text-muted, #A1A1AF)", margin: "6px 0 10px", lineHeight: 1.4, maxWidth: 300, marginLeft: "auto", marginRight: "auto" }}>
            {t.thankYouContributors}
          </p>

          <button
            onClick={() => setIsContributorsModalOpen(true)}
            style={{
              background: "var(--bg-surface, #18181D)",
              border: "1px solid var(--border-subtle, #2E2E3C)",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--accent-primary, #FF9933)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            🤝 {t.viewContributors}
          </button>
        </div>

        <div style={{ fontSize: 10, color: "var(--text-muted, #A1A1AF)", marginTop: 14 }}>
          {t.memberSince}
        </div>
      </div>

      {/* Contributors & Acknowledgements Modal */}
      {isContributorsModalOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div style={{
            background: "var(--bg-surface, #18181D)", 
            borderRadius: 16, 
            maxWidth: 440, 
            width: "100%",
            maxHeight: "85vh", 
            overflowY: "auto", 
            padding: 24, 
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            border: "1px solid var(--border-color, rgba(212,175,55,0.3))"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ 
                  display: "inline-block", fontSize: 10, fontWeight: 700, 
                  background: "var(--accent-primary, #FF9933)", color: "#0E0E10", 
                  padding: "2px 8px", borderRadius: 4, marginBottom: 6 
                }}>
                  RELEASE v1.1.0
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text-main, #F5F5F7)" }}>
                  {t.contributorsModalTitle}
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-muted, #A1A1AF)" }}>
                  {t.contributorsModalSubtitle}
                </p>
              </div>
              <button
                onClick={() => setIsContributorsModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: 20, color: "var(--text-muted, #A1A1AF)", cursor: "pointer", padding: "4px 8px" }}
              >
                ✕
              </button>
            </div>

            {/* Contributor Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              <div style={{
                padding: "12px 14px", borderRadius: 10, 
                background: "var(--bg-card, #22222B)", 
                border: "1px solid var(--border-subtle, #2E2E3C)",
                display: "flex", alignItems: "center", gap: 12
              }}>
                <div style={{ fontSize: 24 }}>✨</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main, #F5F5F7)" }}>
                    {t.contributorSanika}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted, #A1A1AF)", marginTop: 2 }}>
                    {t.contributorSanikaRole}
                  </div>
                </div>
              </div>

              <div style={{
                padding: "12px 14px", borderRadius: 10, 
                background: "var(--bg-card, #22222B)", 
                border: "1px solid var(--border-subtle, #2E2E3C)",
                display: "flex", alignItems: "center", gap: 12
              }}>
                <div style={{ fontSize: 24 }}>🚩</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main, #F5F5F7)" }}>
                    {t.contributorSourav}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted, #A1A1AF)", marginTop: 2 }}>
                    {t.contributorSouravRole}
                  </div>
                </div>
              </div>

              <div style={{
                padding: "12px 14px", borderRadius: 10, 
                background: "var(--bg-card, #22222B)", 
                border: "1px solid var(--border-subtle, #2E2E3C)",
                display: "flex", alignItems: "center", gap: 12
              }}>
                <div style={{ fontSize: 24 }}>🗺️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main, #F5F5F7)" }}>
                    {t.contributorOsm}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted, #A1A1AF)", marginTop: 2 }}>
                    {t.contributorOsmRole}
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <a
                href="https://github.com/Chotu98270/Ujjain-Explorer"
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1, textAlign: "center", textDecoration: "none",
                  background: "var(--cta-bg, linear-gradient(135deg, #FF9933 0%, #D4AF37 100%))", 
                  color: "var(--cta-text, #0E0E10)", padding: "10px", borderRadius: 10,
                  fontSize: 12, fontWeight: 700, display: "inline-block"
                }}
              >
                🐙 {t.githubRepo}
              </a>
              <button
                onClick={() => setIsContributorsModalOpen(false)}
                style={{
                  padding: "10px 18px", borderRadius: 10, 
                  border: "1px solid var(--border-subtle, #2E2E3C)",
                  background: "var(--bg-card, #22222B)", 
                  color: "var(--text-main, #F5F5F7)", fontSize: 12, fontWeight: 600, cursor: "pointer"
                }}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
