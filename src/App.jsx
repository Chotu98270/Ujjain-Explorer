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
    <div 
      className="min-h-screen w-full flex flex-col transition-colors duration-300 overflow-x-hidden"
      style={{
        background: "var(--bg-primary, #0E0E10)",
        color: "var(--text-main, #F5F5F7)",
        fontFamily: "var(--font-body, 'Inter', sans-serif)",
      }}
    >
      {/* Full-width edge-to-edge layout: NO black side gaps on Web, native 100% on iOS/Android */}
      <div 
        className="w-full flex-1 flex flex-col relative h-[100dvh] overflow-hidden"
        style={{
          background: "var(--bg-primary, #0E0E10)",
        }}
      >
        {/* Screen Content Container with reliable flex-1, min-h-0 and iOS momentum scrolling */}
        <div className="flex-1 min-h-0 relative flex flex-col overflow-hidden scroll-touch" style={{ background: "var(--bg-primary, #0E0E10)" }}>
          <Suspense fallback={
            <div style={{ background: "var(--bg-primary, #0E0E10)", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ color: "var(--accent-primary, #FF9933)", fontWeight: 700, fontSize: 14 }}>
                🕉️ Loading Ujjain Explorer...
              </div>
            </div>
          }>
            {renderScreen()}
          </Suspense>

          {/* Auth Modal Overlay */}
          {isAuthModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
              <div className="w-full max-w-md">
                <AuthScreen
                  onAuthSuccess={handleAuthSuccess}
                  onClose={() => setIsAuthModalOpen(false)}
                  userLanguage={userLanguage}
                  setUserLanguage={setUserLanguage}
                />
              </div>
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
