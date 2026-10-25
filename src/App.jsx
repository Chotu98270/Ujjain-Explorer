import { useState, useEffect, lazy, Suspense } from "react";
import HomeScreen from "./screens/HomeScreen";
import BottomNav from "./components/BottomNav";
import AuthScreen from "./screens/AuthScreen";
import { ThemeProvider } from "./context/ThemeContext";
import { useUserLocation } from "./hooks/useUserLocation";
import { logoutUser, fetchWeather, toggleWeather } from "./data/api";

const ExploreScreen = lazy(() => import("./screens/ExploreScreen"));
const MapScreen = lazy(() => import("./screens/MapScreen"));
const PlanScreen = lazy(() => import("./screens/PlanScreen"));
const ProfileScreen = lazy(() => import("./screens/ProfileScreen"));
const PlaceDetailScreen = lazy(() => import("./screens/PlaceDetailScreen"));

function MainApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [exploreParams, setExploreParams] = useState({});
  const { location: userLocation } = useUserLocation();
  const [userLanguage, setUserLanguage] = useState(() => localStorage.getItem("pune_user_lang") || "English");
  const [weatherData, setWeatherData] = useState({ weather: "Sunny", temp: 32 });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("pune_auth_token");
    const name = localStorage.getItem("pune_user_name") || "Explorer";
    return token ? { name, token } : null;
  });

  useEffect(() => {
    localStorage.setItem("pune_user_lang", userLanguage);
  }, [userLanguage]);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await fetchWeather();
        setWeatherData(data);
      } catch (err) {
        console.error("Failed to load initial weather:", err);
      }
    };
    loadWeather();
  }, []);

  const handleWeatherToggle = async () => {
    try {
      const data = await toggleWeather();
      setWeatherData(data);
    } catch (err) {
      console.error("Failed to toggle weather status:", err);
    }
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setActiveTab("detail");
  };

  const handleBack = () => {
    setSelectedPlace(null);
    setActiveTab("explore");
  };

  const handleSearchClick = (params = {}) => {
    setExploreParams(params);
    setActiveTab("explore");
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setActiveTab("home");
  };

  const handleOpenAuth = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser({
      name: userData?.name || localStorage.getItem("pune_user_name") || "Explorer",
      email: userData?.email,
      token: localStorage.getItem("pune_auth_token")
    });
    setIsAuthModalOpen(false);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onPlaceSelect={handlePlaceSelect} onSearchClick={handleSearchClick} userLocation={userLocation} userLanguage={userLanguage} weatherData={weatherData} onWeatherToggle={handleWeatherToggle} />;
      case "explore":
        return <ExploreScreen onPlaceSelect={handlePlaceSelect} initialParams={exploreParams} userLocation={userLocation} userLanguage={userLanguage} />;
      case "map":
        return <MapScreen userLocation={userLocation} userLanguage={userLanguage} weatherData={weatherData} />;
      case "plan":
        return <PlanScreen userLocation={userLocation} userLanguage={userLanguage} weatherData={weatherData} onWeatherToggle={handleWeatherToggle} onOpenAuth={handleOpenAuth} user={user} />;
      case "profile":
        return <ProfileScreen onPlaceSelect={handlePlaceSelect} userLocation={userLocation} userLanguage={userLanguage} setUserLanguage={setUserLanguage} onLogout={handleLogout} onOpenAuth={handleOpenAuth} user={user} />;
      case "detail":
        return <PlaceDetailScreen place={selectedPlace} onBack={handleBack} userLocation={userLocation} userLanguage={userLanguage} onOpenAuth={handleOpenAuth} user={user} />;
      default:
        return <HomeScreen onPlaceSelect={handlePlaceSelect} onSearchClick={handleSearchClick} userLocation={userLocation} userLanguage={userLanguage} weatherData={weatherData} onWeatherToggle={handleWeatherToggle} />;
    }
  };

  return (
    <div className="flex justify-center items-stretch sm:items-start min-h-screen bg-black sm:bg-[#08080A] sm:py-6 transition-colors duration-300">
      <div
        className="relative overflow-hidden flex flex-col w-full h-[100dvh] sm:h-auto sm:w-[390px] sm:min-h-[820px] sm:rounded-[44px] sm:border-2 transition-all duration-300"
        style={{
          background: "var(--bg-primary, #0E0E10)",
          borderColor: "var(--border-color, rgba(212,175,55,0.3))",
          boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
          fontFamily: "var(--font-body, 'Inter', sans-serif)",
        }}
      >
        {/* Decorative Notch */}
        <div
          className="mx-auto z-10 hidden sm:block"
          style={{
            width: 130,
            height: 26,
            background: "#050505",
            borderRadius: "0 0 16px 16px",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "none"
          }}
        />

        {/* Screen Content Container */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "var(--bg-primary, #0E0E10)" }}>
          <Suspense fallback={
            <div style={{ background: "var(--bg-primary, #0E0E10)", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ color: "var(--accent-primary, #FF9933)", fontWeight: 700, fontSize: 13 }}>
                🕉️ Loading Ujjain Explorer...
              </div>
            </div>
          }>
            {renderScreen()}
          </Suspense>

          {/* Auth Modal Overlay */}
          {isAuthModalOpen && (
            <div className="absolute inset-0 z-50" style={{ background: "var(--bg-surface, #18181D)" }}>
              <AuthScreen
                onAuthSuccess={handleAuthSuccess}
                onClose={() => setIsAuthModalOpen(false)}
                userLanguage={userLanguage}
                setUserLanguage={setUserLanguage}
              />
            </div>
          )}
        </div>

        {/* Bottom nav — hidden on detail screen */}
        {activeTab !== "detail" && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} userLanguage={userLanguage} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
