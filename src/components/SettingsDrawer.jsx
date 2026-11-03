import { useState } from "react";
import { languageList, translations, getTranslation } from "../data/translations";
import ThemeSwitcher from "./ThemeSwitcher";

// Harmonic Temple Bell Synthesizer (528 Hz sacred love & peace resonance)
const playTempleBellSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Fundamental tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(528, ctx.currentTime);
    gain1.gain.setValueAtTime(0.25, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 3.0);

    // Harmonic overtone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1056, ctx.currentTime);
    gain2.gain.setValueAtTime(0.08, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start();
    osc2.stop(ctx.currentTime + 2.0);
  } catch (err) {
    console.log("Audio not allowed or supported:", err);
  }
};

export default function SettingsDrawer({
  isOpen,
  onClose,
  userLanguage,
  setUserLanguage,
  user,
  onOpenAuth,
  onLogout,
  onNavigateToProfile
}) {
  const [bhasmaAlert, setBhasmaAlert] = useState(() => localStorage.getItem("uj_alert_bhasma") !== "false");
  const [sandhyaAlert, setSandhyaAlert] = useState(() => localStorage.getItem("uj_alert_sandhya") !== "false");
  const [offlineCache, setOfflineCache] = useState(() => localStorage.getItem("uj_offline_cache") === "true");
  const [dataSaver, setDataSaver] = useState(() => localStorage.getItem("uj_data_saver") === "true");
  const [searchLang, setSearchLang] = useState("");
  const [activeSettingsTab, setActiveSettingsTab] = useState("all"); // "all" | "language" | "profile" | "help"
  const [bellRung, setBellRung] = useState(false);
  const [cacheClearedMessage, setCacheClearedMessage] = useState(false);

  const t = getTranslation(userLanguage);
  const isHindi = userLanguage === "Hindi" || userLanguage === "Sanskrit";

  if (!isOpen) return null;

  const handleRingBell = () => {
    playTempleBellSound();
    setBellRung(true);
    setTimeout(() => setBellRung(false), 2500);
  };

  const handleToggleBhasma = () => {
    const val = !bhasmaAlert;
    setBhasmaAlert(val);
    localStorage.setItem("uj_alert_bhasma", String(val));
  };

  const handleToggleSandhya = () => {
    const val = !sandhyaAlert;
    setSandhyaAlert(val);
    localStorage.setItem("uj_alert_sandhya", String(val));
  };

  const handleToggleOffline = () => {
    const val = !offlineCache;
    setOfflineCache(val);
    localStorage.setItem("uj_offline_cache", String(val));
  };

  const handleToggleDataSaver = () => {
    const val = !dataSaver;
    setDataSaver(val);
    localStorage.setItem("uj_data_saver", String(val));
  };

  const handleClearCache = () => {
    localStorage.removeItem("pune_user_places");
    localStorage.removeItem("pune_user_itinerary");
    setCacheClearedMessage(true);
    setTimeout(() => setCacheClearedMessage(false), 3000);
  };

  const filteredLanguages = languageList.filter(l => 
    l.name.toLowerCase().includes(searchLang.toLowerCase()) || 
    l.englishName.toLowerCase().includes(searchLang.toLowerCase()) ||
    l.code.toLowerCase().includes(searchLang.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop with smooth blur */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      {/* Slide-out Drawer Panel */}
      <div 
        className="relative w-full max-w-md h-full flex flex-col z-10 shadow-2xl border-l border-[#2E2E3C] overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #16161D 0%, #101015 100%)",
          color: "var(--text-main, #F5F5F7)",
          fontFamily: "var(--font-body, 'Inter', sans-serif)"
        }}
      >
        {/* Drawer Header */}
        <div 
          className="p-4 border-b border-[#2A2A36] flex items-center justify-between flex-shrink-0"
          style={{ background: "rgba(22, 22, 29, 0.95)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-black text-[#FF9933]">⋮</span>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-[#F5F5F7] tracking-tight">
                {isHindi ? "सेटिंग्स एवं प्रोफाइल मेन्यू" : "Settings & Yatri Profile"}
              </h2>
              <p className="text-[10px] text-[#A1A1AF]">
                {isHindi ? "सम्पूर्ण १५ भाषाएं, प्रोफाइल, थीम व तीर्थ सहायता" : "All 15 Languages, Profile, Theme & Pilgrimage Tools"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#22222B] text-[#A1A1AF] hover:text-white flex items-center justify-center text-sm transition-colors border border-[#2E2E3C]"
            title="Close Menu"
          >
            ✕
          </button>
        </div>

        {/* Quick Section Tabs */}
        <div className="flex border-b border-[#2A2A36] px-3 py-2 bg-[#13131A] gap-1 overflow-x-auto flex-shrink-0">
          {[
            { id: "all", label: isHindi ? "📋 सभी सेटिंग्स" : "📋 All", icon: "" },
            { id: "language", label: isHindi ? "🌐 १५ भाषाएँ" : "🌐 15 Languages", icon: "" },
            { id: "profile", label: isHindi ? "🕉️ प्रोफाइल" : "🕉️ Profile", icon: "" },
            { id: "help", label: isHindi ? "🚨 हेल्पलाइन" : "🚨 Helplines", icon: "" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSettingsTab(tab.id)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeSettingsTab === tab.id
                  ? "bg-[#FF9933] text-[#0E0E10] shadow-sm shadow-[#FF9933]/30"
                  : "bg-[#1E1E26] text-[#A1A1AF] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 scroll-touch">

          {/* ── 1. USER PROFILE CARD ── */}
          {(activeSettingsTab === "all" || activeSettingsTab === "profile") && (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-[#241710] via-[#1E1E26] to-[#16161D] border border-[#FF9933]/30 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-3.5">
                {/* Avatar with sacred halo */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF9933] to-[#D4AF37] p-0.5 shadow-md">
                    <div className="w-full h-full rounded-2xl bg-[#16161D] flex items-center justify-center text-2xl">
                      🕉️
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.2 rounded-full bg-[#10B981] text-white text-[9px] font-bold">
                    LVL 1
                  </span>
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-[#FF9933] font-extrabold flex items-center gap-1">
                    <span>🔱</span>
                    <span>{isHindi ? "महाकाल यात्री" : "Avantika Explorer"}</span>
                  </div>
                  <h3 className="text-base font-bold text-white truncate">
                    {user?.name || (isHindi ? "अतिथि यात्री" : "Guest Yatri")}
                  </h3>
                  <div className="text-xs text-[#A1A1AF] mt-0.5 flex items-center gap-2">
                    <span className="text-[#34D399] font-semibold">✨ 250 XP</span>
                    <span>•</span>
                    <span>🏆 4 Badges</span>
                  </div>
                </div>
              </div>

              {/* Profile Actions */}
              <div className="mt-3 pt-3 border-t border-[#FF9933]/20 flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToProfile) onNavigateToProfile();
                  }}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-[#FF9933]/20 hover:bg-[#FF9933]/30 text-[#FF9933] text-xs font-bold border border-[#FF9933]/40 transition-colors flex items-center justify-center gap-1"
                >
                  <span>🕉️</span>
                  <span>{isHindi ? "पूर्ण प्रोफाइल देखें" : "View Full Profile"}</span>
                </button>

                {user ? (
                  <button
                    onClick={onLogout}
                    className="py-1.5 px-3 rounded-xl bg-[#22222B] text-rose-400 hover:text-rose-300 text-xs font-semibold border border-rose-500/20 transition-colors"
                  >
                    {isHindi ? "लॉग आउट" : "Sign Out"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenAuth) onOpenAuth();
                    }}
                    className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#D4AF37] text-[#0E0E10] text-xs font-bold shadow-sm"
                  >
                    {isHindi ? "लॉग इन" : "Sign In"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── 2. LANGUAGE SELECTOR (ALL 15 LANGUAGES) ── */}
          {(activeSettingsTab === "all" || activeSettingsTab === "language") && (
            <div className="rounded-2xl p-4 bg-[#1A1A22] border border-[#2E2E3C]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#F5F5F7] flex items-center gap-1.5">
                    <span>🌐</span>
                    <span>{isHindi ? "भाषा चयन (All 15 Indian Languages)" : "App Language (15 Indian Languages)"}</span>
                  </h3>
                  <p className="text-[10px] text-[#A1A1AF] mt-0.5">
                    {isHindi ? "अपनी क्षेत्रीय भाषा चुनें — सम्पूर्ण ऐप तत्काल परिवर्तित होगा" : "Select your regional language — changes apply instantly"}
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF9933]/20 text-[#FF9933] font-bold">
                  {userLanguage}
                </span>
              </div>

              {/* Language Search */}
              <div className="my-2.5 relative">
                <input
                  type="text"
                  value={searchLang}
                  onChange={(e) => setSearchLang(e.target.value)}
                  placeholder={isHindi ? "भाषा खोजें (उदा. संस्कृत, বাংলা, தமிழ்)..." : "Search language (Hindi, Tamil, Sanskrit)..."}
                  className="w-full py-1.5 pl-8 pr-3 rounded-xl text-xs bg-[#121217] text-white border border-[#2E2E3C] focus:outline-none focus:border-[#FF9933]"
                />
                <span className="absolute left-2.5 top-2 text-[#A1A1AF] text-xs">🔍</span>
              </div>

              {/* 15 Languages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                {filteredLanguages.map((lang) => {
                  const isSelected = userLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setUserLanguage(lang.code);
                        localStorage.setItem("pune_user_lang", lang.code);
                      }}
                      className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-gradient-to-r from-[#FF9933]/20 to-[#D4AF37]/20 border-[#FF9933] shadow-sm shadow-[#FF9933]/20"
                          : "bg-[#16161D] border-[#2A2A36] hover:border-[#FF9933]/40"
                      }`}
                    >
                      <div className="min-w-0 pr-1">
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>{lang.icon}</span>
                          <span className="truncate">{lang.name}</span>
                        </div>
                        <div className="text-[9px] text-[#A1A1AF] truncate">
                          {lang.englishName}
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-[#34D399] font-bold text-xs">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 3. SACRED CHIMES & SOUNDS ── */}
          {(activeSettingsTab === "all") && (
            <div className="rounded-2xl p-4 bg-[#1A1A22] border border-[#2E2E3C]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#F5F5F7] flex items-center gap-1.5">
                    <span>🪔</span>
                    <span>{isHindi ? "पवित्र मंदिर घंटी एवं ॐ ध्वनि" : "Sacred Temple Bell & Chime"}</span>
                  </h3>
                  <p className="text-[10px] text-[#A1A1AF] mt-0.5">
                    {isHindi ? "५२८ हर्ट्ज़ शुद्ध ध्यान एवं शांति तरंग" : "528 Hz Harmonic Bell for peace & mindfulness"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleRingBell}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border ${
                  bellRung
                    ? "bg-[#D4AF37] text-[#0E0E10] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/40 scale-[0.99]"
                    : "bg-gradient-to-r from-[#2A180E] to-[#1E1E26] text-[#FF9933] border-[#FF9933]/40 hover:border-[#FF9933]"
                }`}
              >
                <span className="text-base">{bellRung ? "🔔" : "🪔"}</span>
                <span>{bellRung ? (isHindi ? "घंटी बज रही है... ॐ नमः शिवाय" : "Resonating Sacred Bell... 🕉️") : (isHindi ? "मंदिर घंटी बजाएं (Ring Bell)" : "Ring Sacred Temple Bell")}</span>
              </button>
            </div>
          )}

          {/* ── 4. PILGRIMAGE ALERTS & AARTI TIMERS ── */}
          {(activeSettingsTab === "all") && (
            <div className="rounded-2xl p-4 bg-[#1A1A22] border border-[#2E2E3C]">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#F5F5F7] flex items-center gap-1.5 mb-1">
                <span>🔔</span>
                <span>{isHindi ? "दैनिक आरती स्मरण (Aarti Alerts)" : "Aarti Reminders & Alerts"}</span>
              </h3>
              <p className="text-[10px] text-[#A1A1AF] mb-3">
                {isHindi ? "महाकाल मंदिर की मुख्य आरतियों के पूर्व सूचना" : "Timely notifications before auspicious rituals"}
              </p>

              <div className="space-y-2.5">
                {/* Bhasma Aarti */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#16161D] border border-[#2A2A36]">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>🔴</span>
                      <span>{isHindi ? "भस्म आरती स्मरण (04:00 AM)" : "Bhasma Aarti (04:00 AM)"}</span>
                    </div>
                    <div className="text-[10px] text-[#A1A1AF]">
                      {isHindi ? "रात 03:00 बजे उठने का अलार्म" : "3:00 AM queue wakeup notice"}
                    </div>
                  </div>
                  <button
                    onClick={handleToggleBhasma}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      bhasmaAlert ? "bg-[#10B981]" : "bg-[#2E2E3C]"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      bhasmaAlert ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                {/* Sandhya Aarti */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#16161D] border border-[#2A2A36]">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>🪔</span>
                      <span>{isHindi ? "संध्या आरती (07:00 PM)" : "Sandhya Aarti (07:00 PM)"}</span>
                    </div>
                    <div className="text-[10px] text-[#A1A1AF]">
                      {isHindi ? "दीपदान एवं आरती सूचना" : "Evening Shipra deepotsav & aarti"}
                    </div>
                  </div>
                  <button
                    onClick={handleToggleSandhya}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      sandhyaAlert ? "bg-[#10B981]" : "bg-[#2E2E3C]"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      sandhyaAlert ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── 5. OFFLINE & DATA SAVER MODES ── */}
          {(activeSettingsTab === "all") && (
            <div className="rounded-2xl p-4 bg-[#1A1A22] border border-[#2E2E3C]">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#F5F5F7] flex items-center gap-1.5 mb-1">
                <span>⚡</span>
                <span>{isHindi ? "ऑफलाइन एवं डेटा बचत मोड" : "Offline & Pilgrimage Data"}</span>
              </h3>
              <p className="text-[10px] text-[#A1A1AF] mb-3">
                {isHindi ? "मंदिर क्षेत्र में कम नेटवर्क होने पर भी जानकारी सुरक्षित रखें" : "Save battery and network when visiting crowded temple zones"}
              </p>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#16161D] border border-[#2A2A36]">
                  <div>
                    <div className="text-xs font-bold text-white">
                      {isHindi ? "ऑफलाइन तीर्थ गाइड (Offline Cache)" : "Offline Pilgrimage Guide"}
                    </div>
                    <div className="text-[10px] text-[#A1A1AF]">
                      {isHindi ? "मंदिर, घाट व योजना बिना इंटरनेट देखें" : "Keep map spots and itinerary available offline"}
                    </div>
                  </div>
                  <button
                    onClick={handleToggleOffline}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      offlineCache ? "bg-[#3B82F6]" : "bg-[#2E2E3C]"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      offlineCache ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#16161D] border border-[#2A2A36]">
                  <div>
                    <div className="text-xs font-bold text-white">
                      {isHindi ? "डेटा एवं बैटरी सेवर (Data Saver)" : "Low Data & Battery Saver"}
                    </div>
                    <div className="text-[10px] text-[#A1A1AF]">
                      {isHindi ? "उच्च गुणवत्ता इमेज सीमित करें" : "Optimizes map tile caching & reduces battery draw"}
                    </div>
                  </div>
                  <button
                    onClick={handleToggleDataSaver}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      dataSaver ? "bg-[#10B981]" : "bg-[#2E2E3C]"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      dataSaver ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── 6. EMERGENCY HELPLINES (ONE-TAP CALLING) ── */}
          {(activeSettingsTab === "all" || activeSettingsTab === "help") && (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-[#241010] to-[#1A1A22] border border-rose-500/30">
              <h3 className="text-xs sm:text-sm font-extrabold text-rose-300 flex items-center gap-1.5 mb-1">
                <span>🚨</span>
                <span>{isHindi ? "उज्जैन आपातकालीन एवं तीर्थ हेल्पलाइन" : "Ujjain Emergency & Pilgrim Helplines"}</span>
              </h3>
              <p className="text-[10px] text-[#A1A1AF] mb-3">
                {isHindi ? "किसी भी समस्या या खोने पर तत्काल सहायता हेतु सीधे डायल करें" : "Instant one-tap assistance from official authorities in Ujjain"}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:+917342550010"
                  className="p-2.5 rounded-xl bg-[#16161D] border border-rose-500/30 hover:border-rose-400 text-left transition-colors"
                >
                  <div className="text-[10px] text-rose-400 font-bold uppercase">🕉️ मंदिर नियंत्रण कक्ष</div>
                  <div className="text-xs font-bold text-white mt-0.5">0734-2550010</div>
                  <div className="text-[9px] text-[#34D399] mt-0.5">कॉल करें →</div>
                </a>

                <a
                  href="tel:112"
                  className="p-2.5 rounded-xl bg-[#16161D] border border-rose-500/30 hover:border-rose-400 text-left transition-colors"
                >
                  <div className="text-[10px] text-rose-400 font-bold uppercase">👮 उज्जैन पुलिस</div>
                  <div className="text-xs font-bold text-white mt-0.5">112 (टोल फ्री)</div>
                  <div className="text-[9px] text-[#34D399] mt-0.5">डायल करें →</div>
                </a>

                <a
                  href="tel:108"
                  className="p-2.5 rounded-xl bg-[#16161D] border border-rose-500/30 hover:border-rose-400 text-left transition-colors"
                >
                  <div className="text-[10px] text-rose-400 font-bold uppercase">🚑 एम्बुलेंस / चिकित्सा</div>
                  <div className="text-xs font-bold text-white mt-0.5">108 (24/7)</div>
                  <div className="text-[9px] text-[#34D399] mt-0.5">डायल करें →</div>
                </a>

                <a
                  href="tel:1363"
                  className="p-2.5 rounded-xl bg-[#16161D] border border-rose-500/30 hover:border-rose-400 text-left transition-colors"
                >
                  <div className="text-[10px] text-rose-400 font-bold uppercase">ℹ️ पर्यटन हेल्पलाइन</div>
                  <div className="text-xs font-bold text-white mt-0.5">1363 (म.प्र.)</div>
                  <div className="text-[9px] text-[#34D399] mt-0.5">डायल करें →</div>
                </a>
              </div>
            </div>
          )}

          {/* ── 7. OFFICIAL LINKS & APP RESET ── */}
          {(activeSettingsTab === "all") && (
            <div className="rounded-2xl p-4 bg-[#1A1A22] border border-[#2E2E3C] space-y-3">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#F5F5F7] flex items-center gap-1.5">
                <span>ℹ️</span>
                <span>{isHindi ? "संसाधन एवं जानकारी" : "Resources & About"}</span>
              </h3>

              <div className="space-y-2">
                <a
                  href="https://shrimahakaleshwar.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#16161D] border border-[#2E2E3C] flex items-center justify-between text-xs text-[#F5F5F7] hover:border-[#FF9933] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>🔱</span>
                    <span>{isHindi ? "महाकाल आधिकारिक लाइव दर्शन" : "Official Mahakal Live Darshan"}</span>
                  </span>
                  <span className="text-[#FF9933] text-xs">↗</span>
                </a>

                <a
                  href="https://github.com/Chotu98270/Ujjain-Explorer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#16161D] border border-[#2E2E3C] flex items-center justify-between text-xs text-[#F5F5F7] hover:border-[#FF9933] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>🐙</span>
                    <span>{isHindi ? "GitHub ओपन-सोर्स रिपॉजिटरी" : "GitHub Repository"}</span>
                  </span>
                  <span className="text-xs text-[#A1A1AF]">v1.0.0 ↗</span>
                </a>

                {/* Reset app cache */}
                <button
                  onClick={handleClearCache}
                  className="w-full p-2.5 rounded-xl bg-[#16161D] border border-[#2E2E3C] hover:border-amber-500/50 flex items-center justify-between text-xs text-[#A1A1AF] hover:text-amber-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>🗑️</span>
                    <span>{isHindi ? "लोकल ऐप कैश साफ़ करें" : "Clear App Local Cache"}</span>
                  </span>
                  <span className="text-[10px] text-amber-400">Reset</span>
                </button>

                {cacheClearedMessage && (
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center">
                    ✓ {isHindi ? "लोकल कैश सफलतापूर्वक साफ़ किया गया!" : "Local cache cleared successfully!"}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#2A2A36] bg-[#121217] flex items-center justify-between text-[11px] text-[#A1A1AF] flex-shrink-0">
          <span>🕉️ Avantika Darshan</span>
          <span>v1.0.0 · Made for Pilgrims</span>
        </div>
      </div>
    </div>
  );
}
