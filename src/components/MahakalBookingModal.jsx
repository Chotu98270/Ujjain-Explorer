import { useState, useEffect } from "react";
import { bookMahakalDarshan, fetchMahakalBookings } from "../data/api";

export default function MahakalBookingModal({ isOpen, onClose, initialTab = "bhasma", userLanguage = "English" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState(null);
  const [myBookings, setMyBookings] = useState([]);

  // Form State
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [devoteesCount, setDevoteesCount] = useState(1);
  const [primaryName, setPrimaryName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  
  // Bhasma Aarti specific
  const [bhasmaCategory, setBhasmaCategory] = useState("Nandi Hall");
  const [dressCodeAgreed, setDressCodeAgreed] = useState(false);
  
  // VIP specific
  const [vipSlot, setVipSlot] = useState("Morning Slot (06:00 AM - 12:00 PM)");

  // Sync tab on open
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setConfirmedPass(null);
      loadMyBookings();
    }
  }, [isOpen, initialTab]);

  const loadMyBookings = async () => {
    try {
      const data = await fetchMahakalBookings();
      setMyBookings(data || []);
    } catch (e) {
      // Ignore
    }
  };

  if (!isOpen) return null;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!primaryName.trim() || !phone.trim()) {
      alert("Please provide the primary devotee name and mobile number.");
      return;
    }

    if (activeTab === "bhasma" && !dressCodeAgreed) {
      alert("Please accept the mandatory Vedic dress code guidelines for Bhasma Aarti.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        type: activeTab === "bhasma" ? "bhasma_aarti" : "vip_darshan",
        date: bookingDate,
        slot: activeTab === "bhasma" ? "04:00 AM - 06:00 AM (Reporting: 03:00 AM)" : vipSlot,
        category: activeTab === "bhasma" ? bhasmaCategory : "VIP Sheegra Darshan",
        devoteesCount: Number(devoteesCount),
        primaryDevotee: {
          name: primaryName.trim(),
          phone: phone.trim(),
          aadhaar: aadhaar.trim() || "Aadhaar to be verified at gate",
          age: Number(age) || 30,
          gender,
        },
      };

      const res = await bookMahakalDarshan(payload);
      if (res && res.booking) {
        setConfirmedPass(res.booking);
        loadMyBookings();
      }
    } catch (err) {
      alert("Booking encountered an error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isHindi = userLanguage === "Hindi" || userLanguage === "Sanskrit";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 12px",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          background: "var(--bg-surface, #18181D)",
          border: "1.5px solid rgba(255,153,51,0.35)",
          borderRadius: 24,
          width: "100%",
          maxWidth: 520,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
          overflow: "hidden",
        }}
      >
        {/* Modal Top Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #2A1408 0%, #18181D 100%)",
            borderBottom: "1px solid rgba(255,153,51,0.25)",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(255,153,51,0.2)",
                border: "1px solid var(--accent-primary, #FF9933)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🔱
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-heading)" }}>
                {isHindi ? "श्री महाकाल दर्शन एवं बुकिंग मेन्यू" : "Shri Mahakal Darshan & Booking Menu"}
              </div>
              <div style={{ fontSize: 11, color: "var(--accent-primary, #FF9933)", fontWeight: 600 }}>
                {isHindi ? "द्वादश ज्योतिर्लिंग · उज्जैन अवन्तिका धाम" : "12 Sacred Jyotirlinga · Ujjain Avantika Dham"}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#FFF",
              width: 32,
              height: 32,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div
          style={{
            display: "flex",
            background: "var(--bg-card, #1F1F27)",
            borderBottom: "1px solid var(--border-color, rgba(212,175,55,0.2))",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
          className="scroll-touch"
        >
          {[
            { id: "bhasma", icon: "🕉️", label: isHindi ? "भस्म आरती" : "Bhasma Aarti" },
            { id: "vip", icon: "⚡", label: isHindi ? "VIP दर्शन (₹250)" : "VIP Darshan (₹250)" },
            { id: "aarti", icon: "🪔", label: isHindi ? "आरती समय" : "Aarti Timetable" },
            { id: "rules", icon: "📜", label: isHindi ? "नियम व वेशभूषा" : "Guidelines" },
            { id: "passes", icon: "🎟️", label: `${isHindi ? "पास" : "Passes"} (${myBookings.length})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setConfirmedPass(null); }}
                style={{
                  flex: 1,
                  minWidth: 92,
                  padding: "10px 6px",
                  background: isActive ? "rgba(255,153,51,0.18)" : "transparent",
                  border: "none",
                  borderBottom: isActive ? "3px solid var(--accent-primary, #FF9933)" : "3px solid transparent",
                  color: isActive ? "var(--accent-primary, #FF9933)" : "var(--text-sub, #A1A1AF)",
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontSize: 16 }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div style={{ padding: 18, overflowY: "auto", flex: 1 }}>
          {/* Confirmed Pass Display */}
          {confirmedPass ? (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #1A1208 0%, #2A170A 100%)",
                  border: "2px solid #D4AF37",
                  borderRadius: 20,
                  padding: 20,
                  boxShadow: "0 10px 30px rgba(255,153,51,0.25)",
                  position: "relative",
                  marginBottom: 16,
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(212,175,55,0.4)", paddingBottom: 12, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 10, color: "#D4AF37", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
                      SHRI MAHAKALESHWAR TEMPLE MANAGEMENT COMMITTEE
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-heading)" }}>
                      {confirmedPass.type === "bhasma_aarti" ? "🕉️ BHASMA AARTI PASS" : "⚡ VIP SHEEGRA DARSHAN PASS"}
                    </div>
                  </div>
                  <span style={{ background: "#10B981", color: "#FFF", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6 }}>
                    VERIFIED PASS
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12, marginBottom: 14 }}>
                  <div>
                    <div style={{ color: "var(--text-sub, #A1A1AF)", fontSize: 10 }}>Booking Ref ID</div>
                    <div style={{ fontWeight: 800, color: "var(--accent-primary, #FF9933)", fontSize: 14, letterSpacing: 0.5 }}>
                      {confirmedPass.bookingRef}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-sub, #A1A1AF)", fontSize: 10 }}>Darshan Date</div>
                    <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{confirmedPass.date}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-sub, #A1A1AF)", fontSize: 10 }}>Primary Devotee</div>
                    <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{confirmedPass.primaryDevotee?.name}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-sub, #A1A1AF)", fontSize: 10 }}>Devotees Count</div>
                    <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{confirmedPass.devoteesCount} Devotee(s)</div>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <div style={{ color: "var(--text-sub, #A1A1AF)", fontSize: 10 }}>Entry Gate & Slot</div>
                    <div style={{ fontWeight: 700, color: "#34D399" }}>{confirmedPass.entryGate}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>⏰ {confirmedPass.slot} (Reporting: {confirmedPass.reportingTime})</div>
                  </div>
                </div>

                {/* Simulated Digital Barcode / Token */}
                <div
                  style={{
                    background: "rgba(0,0,0,0.5)",
                    border: "1px dashed rgba(212,175,55,0.4)",
                    borderRadius: 12,
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontFamily: "monospace", fontSize: 12, color: "#D4AF37", letterSpacing: 2 }}>
                    |||| | ||||| |||| || ||||| |||||
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                    Token: #{confirmedPass.id?.slice(-6)}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => alert(`✅ Pass ${confirmedPass.bookingRef} saved to local offline storage! You can access it anytime from 'Passes' tab.`)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 12,
                    border: "none",
                    background: "var(--cta-bg, linear-gradient(135deg, #FF9933 0%, #D4AF37 100%))",
                    color: "#0E0E10",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  📥 Save Digital Pass
                </button>
                <button
                  onClick={() => setConfirmedPass(null)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 12,
                    border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
                    background: "transparent",
                    color: "#FFF",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Book Another
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: BHASMA AARTI BOOKING */}
              {activeTab === "bhasma" && (
                <form onSubmit={handleBookingSubmit}>
                  {/* Info Notice */}
                  <div
                    style={{
                      background: "rgba(255,153,51,0.12)",
                      border: "1px solid rgba(255,153,51,0.3)",
                      borderRadius: 14,
                      padding: "12px 14px",
                      marginBottom: 16,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "var(--accent-primary, #FF9933)" }}>
                      <span>🔴</span>
                      <span>{isHindi ? "श्री महाकाल भस्म आरती दिशानिर्देश (प्रातः 04:00 - 06:00)" : "Bhasma Aarti Darshan Protocol (04:00 AM - 06:00 AM)"}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 4, lineHeight: 1.4 }}>
                      {isHindi 
                        ? "भस्म आरती में प्रवेश हेतु पारंपरिक वैदिक वेशभूषा (पुरुषों हेतु बिना सिला सोला/धोती व महिलाओं हेतु साड़ी) अनिवार्य है। रिपोर्टिंग समय प्रातः 03:00 बजे गेट नंबर 1 पर है।"
                        : "Bhasma Aarti is the world-renowned dawn ritual. Traditional dress code (unstitched Dhoti/Solah for men, Saree for women) is mandatory for Nandi Hall. Reporting is at 03:00 AM at Gate No. 1."}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-sub, #A1A1AF)", marginBottom: 4 }}>
                        {isHindi ? "दर्शन तिथि *" : "Darshan Date *"}
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: 10,
                          background: "var(--bg-card, #22222B)",
                          border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
                          color: "#FFF",
                          fontSize: 12,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-sub, #A1A1AF)", marginBottom: 4 }}>
                        {isHindi ? "हॉल / श्रेणी" : "Darshan Category"}
                      </label>
                      <select
                        value={bhasmaCategory}
                        onChange={(e) => setBhasmaCategory(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: 10,
                          background: "var(--bg-card, #22222B)",
                          border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
                          color: "#FFF",
                          fontSize: 12,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      >
                        <option value="Nandi Hall">Nandi Hall (Front Enclosure)</option>
                        <option value="Barricade Gallery">General Barricade Gallery</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-sub, #A1A1AF)", marginBottom: 4 }}>
                        {isHindi ? "मुख्य यात्री का नाम *" : "Primary Devotee Name *"}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Patel"
                        value={primaryName}
                        onChange={(e) => setPrimaryName(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: 10,
                          background: "var(--bg-card, #22222B)",
                          border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
                          color: "#FFF",
                          fontSize: 12,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-sub, #A1A1AF)", marginBottom: 4 }}>
                        {isHindi ? "यात्री संख्या" : "No. of Devotees"}
                      </label>
                      <select
                        value={devoteesCount}
                        onChange={(e) => setDevoteesCount(Number(e.target.value))}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: 10,
                          background: "var(--bg-card, #22222B)",
                          border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
                          color: "#FFF",
                          fontSize: 12,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>{num} {num === 1 ? "Person" : "Persons"}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-sub, #A1A1AF)", marginBottom: 4 }}>
                        {isHindi ? "मोबाइल नंबर *" : "Mobile Number *"}
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: 10,
                          background: "var(--bg-card, #22222B)",
                          border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
                          color: "#FFF",
                          fontSize: 12,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-sub, #A1A1AF)", marginBottom: 4 }}>
                        {isHindi ? "आधार / पहचान पत्र संख्या" : "Aadhaar / Photo ID"}
                      </label>
                      <input
                        type="text"
                        placeholder="XXXX-XXXX-XXXX"
                        value={aadhaar}
                        onChange={(e) => setAadhaar(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: 10,
                          background: "var(--bg-card, #22222B)",
                          border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
                          color: "#FFF",
                          fontSize: 12,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>

                  {/* Dress Code Mandatory Acknowledgment */}
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      background: "rgba(0,0,0,0.3)",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,153,51,0.2)",
                      cursor: "pointer",
                      fontSize: 11,
                      color: "#FFFFFF",
                      marginBottom: 16,
                      lineHeight: 1.4,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={dressCodeAgreed}
                      onChange={(e) => setDressCodeAgreed(e.target.checked)}
                      style={{ marginTop: 2 }}
                    />
                    <span>
                      {isHindi
                        ? "मैं पुष्टि करता हूँ कि पुरुष केवल बिना सिला सोला/धोती एवं महिलाएं साड़ी पहनकर प्रातः 3:00 बजे गेट नंबर 1 पर उपस्थित होंगी।"
                        : "I agree to comply with the mandatory Vedic dress code (unstitched Dhoti/Solah for men, Saree for women) and report at 3:00 AM at Gate No. 1."}
                    </span>
                  </label>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: 12,
                        border: "none",
                        background: "var(--cta-bg, linear-gradient(135deg, #FF9933 0%, #D4AF37 100%))",
                        color: "#0E0E10",
                        fontWeight: 800,
                        cursor: submitting ? "not-allowed" : "pointer",
                        fontSize: 13,
                        boxShadow: "0 4px 15px rgba(255,153,51,0.3)",
                      }}
                    >
                      {submitting ? "Confirming Slot..." : (isHindi ? "🕉️ भस्म आरती पास जनरेट करें (Free)" : "🕉️ Generate Bhasma Aarti Pass (Free)")}
                    </button>

                    <a
                      href="https://shrimahakaleshwar.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textAlign: "center",
                        fontSize: 11,
                        color: "var(--accent-primary, #FF9933)",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      🌐 {isHindi ? "आधिकारिक मंदिर बोर्ड पोर्टल पर जाएं" : "Official Mahakal Board Portal (shrimahakaleshwar.com)"} ↗
                    </a>
                  </div>
                </form>
              )}

              {/* TAB 2: VIP / SHEEGRA DARSHAN (₹250) */}
              {activeTab === "vip" && (
                <form onSubmit={handleBookingSubmit}>
                  {/* VIP Highlight Box */}
                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(255,153,51,0.12) 100%)",
                      border: "1px solid #D4AF37",
                      borderRadius: 14,
                      padding: "12px 14px",
                      marginBottom: 16,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#D4AF37" }}>
                        ⚡ {isHindi ? "शीघ्र दर्शन (VIP) पास · ₹250 प्रति व्यक्ति" : "VIP Sheegra Darshan · ₹250 per Person"}
                      </div>
                      <span style={{ background: "#FF9933", color: "#000", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 10 }}>
                        GATE NO. 4
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 4, lineHeight: 1.4 }}>
                      {isHindi 
                        ? "लंबी सामान्य कतार को छोड़कर गेट नंबर 4 (बड़ा गणेश मंदिर मार्ग) से सीधे गर्भगृह दर्शन मार्ग में त्वरित प्रवेश। टिकट काउंटर या ऑनलाइन टोकन मान्य।"
                        : "Direct fast-track priority entry via Gate No. 4 (Bada Ganesh side) bypassing general crowd queues. Valid for regular daytime and evening darshan hours."}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-sub, #A1A1AF)", marginBottom: 4 }}>
                        {isHindi ? "दर्शन तिथि *" : "Darshan Date *"}
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: 10,
                          background: "var(--bg-card, #22222B)",
                          border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
                          color: "#FFF",
                          fontSize: 12,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-sub, #A1A1AF)", marginBottom: 4 }}>
                        {isHindi ? "यात्री संख्या *" : "No. of Devotees *"}
                      </label>
                      <select
                        value={devoteesCount}
                        onChange={(e) => setDevoteesCount(Number(e.target.value))}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: 10,
                          background: "var(--bg-card, #22222B)",
                          border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
                          color: "#FFF",
                          fontSize: 12,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>{num} Devotee(s) — ₹{num * 250}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-sub, #A1A1AF)", marginBottom: 4 }}>
                      {isHindi ? "समय स्लॉट चयन *" : "Preferred Time Slot *"}
                    </label>
                    <select
                      value={vipSlot}
                      onChange={(e) => setVipSlot(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: 10,
                        background: "var(--bg-card, #22222B)",
                        border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
                        color: "#FFF",
                        fontSize: 12,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="Morning Slot (06:00 AM - 12:00 PM)">🌅 Morning Slot (06:00 AM - 12:00 PM)</option>
                      <option value="Afternoon Slot (12:00 PM - 04:00 PM)">☀️ Afternoon Slot (12:00 PM - 04:00 PM)</option>
                      <option value="Evening Slot (04:00 PM - 08:30 PM)">🌇 Evening Slot (04:00 PM - 08:30 PM)</option>
                      <option value="Night Slot (08:30 PM - 10:30 PM)">🌙 Night Slot (08:30 PM - 10:30 PM)</option>
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-sub, #A1A1AF)", marginBottom: 4 }}>
                        {isHindi ? "मुख्य यात्री का नाम *" : "Primary Devotee Name *"}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ananya Verma"
                        value={primaryName}
                        onChange={(e) => setPrimaryName(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: 10,
                          background: "var(--bg-card, #22222B)",
                          border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
                          color: "#FFF",
                          fontSize: 12,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-sub, #A1A1AF)", marginBottom: 4 }}>
                        {isHindi ? "मोबाइल नंबर *" : "Mobile Number *"}
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: 10,
                          background: "var(--bg-card, #22222B)",
                          border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
                          color: "#FFF",
                          fontSize: 12,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>

                  {/* Pricing Total Card */}
                  <div
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      borderRadius: 12,
                      padding: "12px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                      border: "1px solid rgba(212,175,55,0.25)",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)" }}>Total Amount ({devoteesCount} × ₹250)</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#34D399" }}>
                        ₹{devoteesCount * 250}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--accent-primary, #FF9933)", fontWeight: 700 }}>
                      Gate No. 4 Priority Lane
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: 12,
                        border: "none",
                        background: "var(--cta-bg, linear-gradient(135deg, #FF9933 0%, #D4AF37 100%))",
                        color: "#0E0E10",
                        fontWeight: 800,
                        cursor: submitting ? "not-allowed" : "pointer",
                        fontSize: 13,
                        boxShadow: "0 4px 15px rgba(255,153,51,0.3)",
                      }}
                    >
                      {submitting ? "Booking Pass..." : (isHindi ? `⚡ ₹${devoteesCount * 250} शीघ्र VIP पास कंफर्म करें` : `⚡ Confirm VIP Pass (₹${devoteesCount * 250})`)}
                    </button>

                    <a
                      href="https://shrimahakaleshwar.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textAlign: "center",
                        fontSize: 11,
                        color: "var(--accent-primary, #FF9933)",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      🌐 {isHindi ? "ऑफिशियल मंदिर ट्रस्ट काउंटर / पेमेंट पोर्टल" : "Temple Trust Official Portal & Counters"} ↗
                    </a>
                  </div>
                </form>
              )}

              {/* TAB 3: DAILY AARTI SCHEDULE */}
              {activeTab === "aarti" && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#FFFFFF", marginBottom: 12, fontFamily: "var(--font-heading)" }}>
                    {isHindi ? "श्री महाकालेश्वर दैनिक ५ आरती समय सारिणी" : "Shri Mahakaleshwar 5 Daily Aarti Timings"}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { name: "Bhasma Aarti (भस्म आरती)", time: "04:00 AM – 06:00 AM", desc: "Supreme sacred ash offering with fresh holy cow-dung ash and live stuti chanting.", icon: "🕉️", gate: "Gate 1 (Advance Booking Mandatory)" },
                      { name: "Dadyodak Aarti (दद्योदक आरती)", time: "07:30 AM – 08:15 AM", desc: "Morning curd, milk & holy water ritual worship.", icon: "🥛", gate: "General & VIP Queue Open" },
                      { name: "Bhog Aarti (भोग आरती)", time: "10:30 AM – 11:15 AM", desc: "Midday royal Rajbhog offering to Baba Mahakal with grand dhol-nagada.", icon: "🍲", gate: "General & VIP Queue Open" },
                      { name: "Sandhya Aarti (संध्या आरती)", time: "07:00 PM – 07:45 PM", desc: "Mesmerizing evening musical aarti with full illumination across Mahakal Lok.", icon: "🪔", gate: "All Gates Open" },
                      { name: "Shayan Aarti (शयन आरती)", time: "10:30 PM – 11:00 PM", desc: "Night resting aarti before temple doors close until the 4 AM Bhasma aarti.", icon: "🌙", gate: "Final Entry: 10:15 PM" },
                    ].map((aarti, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "var(--bg-card, #22222B)",
                          border: "1px solid var(--border-color, rgba(212,175,55,0.2))",
                          borderRadius: 12,
                          padding: "12px 14px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 16 }}>{aarti.icon}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#FFF" }}>{aarti.name}</span>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "var(--accent-primary, #FF9933)" }}>{aarti.time}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 4 }}>
                          {aarti.desc}
                        </div>
                        <div style={{ fontSize: 10, color: "#34D399", marginTop: 4, fontWeight: 600 }}>
                          📍 {aarti.gate}
                        </div>
                      </div>
                    ))}
                  </div>

                  <a
                    href="https://shrimahakaleshwar.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      marginTop: 14,
                      textAlign: "center",
                      padding: "10px",
                      borderRadius: 10,
                      background: "rgba(255,153,51,0.15)",
                      color: "var(--accent-primary, #FF9933)",
                      fontWeight: 700,
                      fontSize: 12,
                      textDecoration: "none",
                      border: "1px solid rgba(255,153,51,0.3)",
                    }}
                  >
                    🔴 {isHindi ? "लाइव महाकाल दर्शन वेबकास्ट देखें" : "Watch Official Live Mahakal Darshan Webcast"} ↗
                  </a>
                </div>
              )}

              {/* TAB 4: TEMPLE RULES & GUIDELINES */}
              {activeTab === "rules" && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#FFFFFF", marginBottom: 12, fontFamily: "var(--font-heading)" }}>
                    {isHindi ? "मंदिर नियम एवं अनिवार्य निर्देश" : "Temple Darshan Guidelines & Rules"}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
                    <div style={{ background: "var(--bg-card, #22222B)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(212,175,55,0.2)" }}>
                      <div style={{ fontWeight: 800, color: "var(--accent-primary, #FF9933)", marginBottom: 4 }}>
                        👗 {isHindi ? "अनिवार्य वेशभूषा (Dress Code)" : "Mandatory Vedic Dress Code"}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", lineHeight: 1.5 }}>
                        • <strong>Men:</strong> Traditional unstitched Dhoti and Solah/Angavastram for Garbhagriha & Jalabhishek. No jeans, t-shirts, or stitched pants inside inner sanctum.<br />
                        • <strong>Women:</strong> Traditional Saree or Salwar Kameez with Dupatta. Western clothes not permitted in sanctum.
                      </div>
                    </div>

                    <div style={{ background: "var(--bg-card, #22222B)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(212,175,55,0.2)" }}>
                      <div style={{ fontWeight: 800, color: "var(--accent-primary, #FF9933)", marginBottom: 4 }}>
                        📱 {isHindi ? "लॉकर एवं इलेक्ट्रॉनिक उपकरण" : "Electronic Devices & Lockers"}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", lineHeight: 1.5 }}>
                        Mobile phones, cameras, leather wallets, and belts must be deposited at the free digital cloakrooms/lockers near Gate 1 and Gate 4 before entering.
                      </div>
                    </div>

                    <div style={{ background: "var(--bg-card, #22222B)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(212,175,55,0.2)" }}>
                      <div style={{ fontWeight: 800, color: "var(--accent-primary, #FF9933)", marginBottom: 4 }}>
                        ♿ {isHindi ? "वरिष्ठ नागरिक एवं दिव्यांग सुविधा" : "Senior Citizens & Divyangjan"}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", lineHeight: 1.5 }}>
                        Free wheelchair assistance, golf carts (battery vehicles), and ramps available at Gate No. 4 for senior yatris and physically challenged devotees.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MY CONFIRMED PASSES */}
              {activeTab === "passes" && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#FFFFFF", marginBottom: 12, fontFamily: "var(--font-heading)" }}>
                    {isHindi ? "आपके डिजिटल महाकाल पास" : "Your Confirmed Mahakal Passes"}
                  </div>

                  {myBookings.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--text-sub, #A1A1AF)" }}>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>🎟️</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#FFF" }}>No passes found</div>
                      <div style={{ fontSize: 11, marginTop: 4 }}>Book your Bhasma Aarti or VIP Darshan to view passes here.</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {myBookings.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => setConfirmedPass(b)}
                          style={{
                            background: "var(--bg-card, #22222B)",
                            border: "1px solid rgba(212,175,55,0.3)",
                            borderRadius: 14,
                            padding: "12px 14px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: "var(--accent-primary, #FF9933)" }}>
                              {b.bookingRef}
                            </span>
                            <span style={{ fontSize: 10, background: "#10B981", color: "#FFF", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
                              {b.status}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#FFF", marginTop: 4 }}>
                            {b.type === "bhasma_aarti" ? "🕉️ Bhasma Aarti Pass" : "⚡ VIP Sheegra Darshan Pass"}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 2 }}>
                            📅 {b.date} · ⏰ {b.slot} · {b.devoteesCount} Devotee(s)
                          </div>
                          <div style={{ fontSize: 10, color: "#34D399", marginTop: 4, fontWeight: 600 }}>
                            📍 {b.entryGate}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
