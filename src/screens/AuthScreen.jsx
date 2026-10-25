import { useState } from "react";
import { loginUser, registerUser } from "../data/api";
import StatusBar from "../components/StatusBar";

const authTranslations = {
  English: {
    login: "Login",
    register: "Register",
    name: "Full Name",
    phone: "Mobile Number",
    email: "Email Address",
    emailOptional: "Email (Optional)",
    identifier: "Mobile Number or Email",
    password: "Password / 4-Digit PIN",
    welcomeBack: "Welcome Back",
    getStarted: "Create Pilgrim Account",
    welcomeSubtitle: "Explore the eternal city of Mahakal & Shipra 🕉️",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    errorOccurred: "An error occurred. Please try again.",
    puneExplorer: "Ujjain Explorer",
    enterName: "Enter your full name",
    enterPhone: "10-digit mobile number",
    enterEmail: "Enter email (optional)",
    enterIdentifier: "Enter 10-digit mobile number or email",
    enterPassword: "Enter password or PIN",
    guestMode: "Continue as Guest",
  },
  Marathi: {
    login: "लॉगिन",
    register: "नोंदणी",
    name: "पूर्ण नाव",
    phone: "मोबाईल नंबर",
    email: "ईमेल पत्ता",
    emailOptional: "ईमेल (पर्यायी)",
    identifier: "मोबाईल नंबर किंवा ईमेल",
    password: "पासवर्ड / ४-अंकी पिन",
    welcomeBack: "पुन्हा आपले स्वागत आहे",
    getStarted: "यात्री खाते तयार करा",
    welcomeSubtitle: "महाकाल नगरी आणि अवन्तिका दर्शनाचा अनुभव घ्या 🕉️",
    dontHaveAccount: "खाते नाही का?",
    alreadyHaveAccount: "आधीच खाते आहे का?",
    errorOccurred: "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
    puneExplorer: "उज्जैन एक्सप्लोरर",
    enterName: "आपले पूर्ण नाव प्रविष्ट करा",
    enterPhone: "१० अंकी मोबाईल नंबर",
    enterEmail: "ईमेल प्रविष्ट करा (पर्यायी)",
    enterIdentifier: "१० अंकी मोबाईल किंवा ईमेल प्रविष्ट करा",
    enterPassword: "पासवर्ड किंवा पिन प्रविष्ट करा",
    guestMode: "अतिथी म्हणून पुढे जा",
  },
  Hindi: {
    login: "लॉगिन",
    register: "रजिस्टर",
    name: "पूरा नाम",
    phone: "मोबाइल नंबर",
    email: "ईमेल पता",
    emailOptional: "ईमेल (वैकल्पिक)",
    identifier: "मोबाइल नंबर या ईमेल",
    password: "पासवर्ड / ४-अंकीय पिन",
    welcomeBack: "स्वागत है",
    getStarted: "यात्री खाता बनाएँ",
    welcomeSubtitle: "महाकाल की पावन नगरी अवन्तिका दर्शन 🕉️",
    dontHaveAccount: "खाता नहीं है?",
    alreadyHaveAccount: "पहले से खाता है?",
    errorOccurred: "कोई त्रुटि हुई। कृपया पुन: प्रयास करें।",
    puneExplorer: "उज्जैन एक्सप्लोरर",
    enterName: "अपना पूरा नाम दर्ज करें",
    enterPhone: "१० अंकों का मोबाइल नंबर",
    enterEmail: "ईमेल दर्ज करें (वैकल्पिक)",
    enterIdentifier: "१० अंकों का मोबाइल या ईमेल दर्ज करें",
    enterPassword: "पासवर्ड या पिन दर्ज करें",
    guestMode: "अतिथि के रूप में जारी रखें",
  },
  Gujarati: {
    login: "લોગિન",
    register: "રજીસ્ટર",
    name: "પૂરું નામ",
    phone: "મોબાઇલ નંબર",
    email: "ઇમેઇલ સરનામું",
    emailOptional: "ઇમેઇલ (વૈકલ્પિક)",
    identifier: "મોબાઇલ નંબર અથવા ઇમેઇલ",
    password: "પાસવર્ડ / ૪-અંકનો પિન",
    welcomeBack: "સ્વાગત છે",
    getStarted: "યાત્રી ખાતું બનાવો",
    welcomeSubtitle: "મહાકાલ નગરી અને અવન્તિકા દર્શન 🕉️",
    dontHaveAccount: "ખાતું નથી?",
    alreadyHaveAccount: "પહેલાથી જ ખાતું છે?",
    errorOccurred: "કોઈ ભૂલ થઈ. કૃપા કરીને ફરી પ્રયાસ કરો.",
    puneExplorer: "ઉજ્જૈન એક્સપ્લોરર",
    enterName: "તમારું પૂરું નામ દાખલ કરો",
    enterPhone: "૧૦ અંકનો મોબાઇલ નંબર",
    enterEmail: "ઇમેઇલ દાખલ કરો (વૈકલ્પિક)",
    enterIdentifier: "૧૦ અંકનો મોબાઇલ અથવા ઇમેઇલ દાખલ કરો",
    enterPassword: "પાસવર્ડ અથવા પિન દાખલ કરો",
    guestMode: "અતિથિ તરીકે ચાલુ રાખો",
  }
};

export default function AuthScreen({ onAuthSuccess, userLanguage = "Hindi", setUserLanguage, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = authTranslations[userLanguage] || authTranslations.Hindi;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        if (!identifier.trim()) {
          setError(
            userLanguage === "Hindi" ? "कृपया अपना मोबाइल नंबर या ईमेल दर्ज करें" :
            userLanguage === "Marathi" ? "कृपया आपला मोबाईल किंवा ईमेल प्रविष्ट करा" :
            "Please enter your mobile number or email"
          );
          setLoading(false);
          return;
        }
        if (!password) {
          setError(
            userLanguage === "Hindi" ? "कृपया पासवर्ड या पिन दर्ज करें" :
            userLanguage === "Marathi" ? "कृपया पासवर्ड किंवा पिन प्रविष्ट करा" :
            "Please enter your password or PIN"
          );
          setLoading(false);
          return;
        }

        const data = await loginUser(identifier.trim(), password);
        onAuthSuccess(data.user);
      } else {
        if (!name.trim()) {
          setError(
            userLanguage === "Hindi" ? "कृपया अपना पूरा नाम दर्ज करें" :
            userLanguage === "Marathi" ? "कृपया आपले पूर्ण नाव प्रविष्ट करा" :
            "Please enter your full name"
          );
          setLoading(false);
          return;
        }

        if (!phone.trim() && !email.trim()) {
          setError(
            userLanguage === "Hindi" ? "कृपया मोबाइल नंबर या ईमेल दर्ज करें" :
            userLanguage === "Marathi" ? "कृपया मोबाईल नंबर किंवा ईमेल प्रविष्ट करा" :
            "Please provide a mobile number or email"
          );
          setLoading(false);
          return;
        }

        if (phone.trim() && phone.replace(/[^0-9]/g, "").length < 10) {
          setError(
            userLanguage === "Hindi" ? "कृपया सही १० अंकों का मोबाइल नंबर दर्ज करें" :
            userLanguage === "Marathi" ? "कृपया योग्य १० अंकी मोबाईल नंबर प्रविष्ट करा" :
            "Please enter a valid 10-digit mobile number"
          );
          setLoading(false);
          return;
        }

        if (!password || password.length < 4) {
          setError(
            userLanguage === "Hindi" ? "पासवर्ड/पिन कम से कम ४ अक्षरों का होना चाहिए" :
            userLanguage === "Marathi" ? "पासवर्ड/पिन किमान ४ अक्षरांचा असावा" :
            "Password/PIN must be at least 4 characters"
          );
          setLoading(false);
          return;
        }

        const data = await registerUser({
          name: name.trim(),
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          password
        });
        onAuthSuccess(data.user);
      }
    } catch (err) {
      console.error("[Auth] Error:", err);
      setError(err.message || t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "var(--bg-primary, #0E0E10)",
        minHeight: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "20px 18px",
        position: "relative",
        overflowY: "auto",
        transition: "background 0.3s ease",
      }}
    >
      <StatusBar light={false} />

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: "var(--bg-card, #22222B)",
            border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
            borderRadius: "50%",
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 14,
            color: "var(--text-main, #fff)",
            zIndex: 10,
          }}
          title={t.guestMode}
        >
          ✕
        </button>
      )}

      {/* Language Switcher */}
      {setUserLanguage && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "inline-flex",
            background: "var(--bg-card, #22222B)",
            border: "1px solid var(--border-color, rgba(212,175,55,0.25))",
            borderRadius: 12,
            padding: 3,
            zIndex: 10,
          }}
        >
          {[
            { code: "Hindi", label: "हिन्दी" },
            { code: "English", label: "Eng" },
            { code: "Marathi", label: "मराठी" },
            { code: "Gujarati", label: "ગુજરાતી" }
          ].map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setUserLanguage(lang.code)}
              style={{
                padding: "4px 8px",
                borderRadius: 8,
                border: "none",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                background: userLanguage === lang.code ? "var(--accent-primary, #FF9933)" : "none",
                color: userLanguage === lang.code ? "var(--cta-text, #0E0E10)" : "var(--text-sub, #A1A1AF)",
                transition: "0.2s"
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}

      {/* Header Logo */}
      <div style={{ textAlign: "center", marginBottom: 20, marginTop: 40 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF9933 0%, #D4AF37 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 10px",
            fontSize: 30,
            boxShadow: "0 8px 24px rgba(255,153,51,0.35)",
          }}
        >
          🕉️
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "var(--text-main, #F5F5F7)",
            fontFamily: "var(--font-heading)",
            letterSpacing: 0.5,
          }}
        >
          {t.puneExplorer}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-sub, #A1A1AF)", marginTop: 4 }}>
          {t.welcomeSubtitle}
        </div>
      </div>

      {/* Form Card */}
      <div
        style={{
          background: "var(--bg-surface, #18181D)",
          padding: 20,
          borderRadius: 22,
          border: "1.5px solid var(--border-color, rgba(212,175,55,0.3))",
          boxShadow: "var(--card-shadow, 0 12px 36px rgba(0,0,0,0.6))",
        }}
      >
        {/* Tab switchers */}
        <div style={{ display: "flex", marginBottom: 18, borderBottom: "1.5px solid var(--border-subtle, #2E2E3C)" }}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(""); }}
            style={{
              flex: 1,
              padding: "10px 0",
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: isLogin ? "var(--accent-primary, #FF9933)" : "var(--text-sub, #A1A1AF)",
              borderBottom: isLogin ? "3.5px solid var(--accent-primary, #FF9933)" : "3.5px solid transparent",
              transition: "all 0.2s"
            }}
          >
            {t.login}
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(""); }}
            style={{
              flex: 1,
              padding: "10px 0",
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: !isLogin ? "var(--accent-primary, #FF9933)" : "var(--text-sub, #A1A1AF)",
              borderBottom: !isLogin ? "3.5px solid var(--accent-primary, #FF9933)" : "3.5px solid transparent",
              transition: "all 0.2s"
            }}
          >
            {t.register}
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(233,30,99,0.15)",
              color: "#FF6B8B",
              padding: "10px 12px",
              borderRadius: 12,
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 16,
              border: "1px solid rgba(233,30,99,0.3)",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Registration: Full Name */}
          {!isLogin && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-main, #F5F5F7)", marginBottom: 6 }}>
                {t.name} <span style={{ color: "var(--accent-primary, #FF9933)" }}>*</span>
              </div>
              <input
                type="text"
                placeholder={t.enterName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1.5px solid var(--border-color, rgba(212,175,55,0.3))",
                  fontSize: 14,
                  outline: "none",
                  background: "var(--bg-elevated, #2A2A36)",
                  color: "var(--text-main, #F5F5F7)",
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
              />
            </div>
          )}

          {/* Registration: Mobile Number (Primary for Indian tourists & pilgrims) */}
          {!isLogin ? (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-main, #F5F5F7)", marginBottom: 6 }}>
                📱 {t.phone} <span style={{ color: "var(--accent-primary, #FF9933)" }}>*</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <div
                  style={{
                    padding: "12px 10px",
                    borderRadius: 12,
                    background: "var(--bg-elevated, #2A2A36)",
                    border: "1.5px solid var(--border-color, rgba(212,175,55,0.3))",
                    color: "var(--accent-primary, #FF9933)",
                    fontWeight: 700,
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  placeholder={t.enterPhone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                  autoComplete="tel"
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1.5px solid var(--border-color, rgba(212,175,55,0.3))",
                    fontSize: 14,
                    outline: "none",
                    background: "var(--bg-elevated, #2A2A36)",
                    color: "var(--text-main, #F5F5F7)",
                    fontFamily: "inherit",
                    letterSpacing: 1,
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          ) : null}

          {/* Registration: Email (Optional) */}
          {!isLogin && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-sub, #A1A1AF)", marginBottom: 6 }}>
                ✉️ {t.emailOptional}
              </div>
              <input
                type="email"
                placeholder={t.enterEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid var(--border-subtle, #333)",
                  fontSize: 13,
                  outline: "none",
                  background: "var(--bg-elevated, #2A2A36)",
                  color: "var(--text-main, #F5F5F7)",
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
              />
            </div>
          )}

          {/* Login Mode: Combined Mobile Number or Email */}
          {isLogin && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-main, #F5F5F7)", marginBottom: 6 }}>
                📱 / ✉️ {t.identifier}
              </div>
              <input
                type="text"
                placeholder={t.enterIdentifier}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1.5px solid var(--border-color, rgba(212,175,55,0.3))",
                  fontSize: 14,
                  outline: "none",
                  background: "var(--bg-elevated, #2A2A36)",
                  color: "var(--text-main, #F5F5F7)",
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
              />
            </div>
          )}

          {/* Password / 4-Digit PIN */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-main, #F5F5F7)", marginBottom: 6 }}>
              🔒 {t.password}
            </div>
            <input
              type="password"
              placeholder={t.enterPassword}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1.5px solid var(--border-color, rgba(212,175,55,0.3))",
                fontSize: 14,
                outline: "none",
                background: "var(--bg-elevated, #2A2A36)",
                color: "var(--text-main, #F5F5F7)",
                fontFamily: "inherit",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 14,
              border: "none",
              background: "var(--cta-bg, linear-gradient(135deg, #FF9933 0%, #D4AF37 100%))",
              color: "var(--cta-text, #0E0E10)",
              fontWeight: 800,
              cursor: loading ? "wait" : "pointer",
              fontSize: 14,
              marginTop: 8,
              boxShadow: "0 6px 18px rgba(255,153,51,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              letterSpacing: 0.5
            }}
          >
            {loading ? (
              <span style={{ fontSize: 13 }}>⌛ कृपया प्रतीक्षा करें...</span>
            ) : (
              isLogin ? `🚀 ${t.login}` : `✨ ${t.register}`
            )}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-primary, #FF9933)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            {isLogin ? t.dontHaveAccount + " " + t.register : t.alreadyHaveAccount + " " + t.login}
          </button>
        </div>
      </div>
    </div>
  );
}
