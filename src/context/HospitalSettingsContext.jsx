import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api/api";
import { setBrowserFavicon } from "../utils/favicon";

const HospitalSettingsContext = createContext(null);

export const DEFAULT_HOSPITAL_SETTINGS = {
  hospitalName: "CareCore Hospital",
  registrationNumber: "HSP-KOL-2026-0048",
  email: "admin@carecore.com",
  phone: "+91 98765 00000",
  address: "12 Lake View Road, Salt Lake, Kolkata",
  website: "www.carecore.com",
  gstin: "19ABCDE1234F1Z5",
  logo: "",
  timezone: "Asia/Kolkata",
  openingTime: "06:00",
  closingTime: "22:00",
  appointmentDuration: "30",
  currency: "INR",
  emailNotifications: true,
  smsNotifications: true,
  emergencyAlerts: true,
  weeklyReports: false,
  twoFactor: true,
  billingTaxRate: 5,
};

const STORAGE_KEY = "carecore_hospital_settings";

export const HospitalSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        return { ...DEFAULT_HOSPITAL_SETTINGS, ...JSON.parse(cached) };
      }
    } catch (e) {
      console.warn("Failed to parse cached settings:", e);
    }
    return DEFAULT_HOSPITAL_SETTINGS;
  });

  const [loading, setLoading] = useState(true);

  // Sync title with hospital name
  useEffect(() => {
    if (settings.hospitalName) {
      document.title = `${settings.hospitalName} - Hospital Management System`;
    }
  }, [settings.hospitalName]);

  // Sync browser favicon with hospital logo
  useEffect(() => {
    setBrowserFavicon(settings.logo, settings.updatedAt || settings.updated_at);
  }, [settings.logo, settings.updatedAt, settings.updated_at]);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await apiRequest("/api/settings");
      if (data?.settings) {
        setSettings((prev) => {
          const merged = { ...prev, ...data.settings };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    } catch (err) {
      console.error("Failed to load settings from server:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();

    // Listen for cross-tab or cross-component updates
    const handleUpdateEvent = (e) => {
      if (e.detail) {
        setSettings((prev) => ({ ...prev, ...e.detail }));
      }
    };
    window.addEventListener("hospital-settings-updated", handleUpdateEvent);
    return () => window.removeEventListener("hospital-settings-updated", handleUpdateEvent);
  }, [refreshSettings]);

  const updateSettings = async (newSettingsPartial) => {
    const payload = { ...settings, ...newSettingsPartial };
    const res = await apiRequest("/api/settings", {
      method: "PUT",
      body: JSON.stringify({ settings: payload }),
    });

    const updated = res?.settings ? { ...settings, ...res.settings } : payload;
    setSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    // Immediately trigger browser favicon update with timestamp for cache busting
    setBrowserFavicon(updated.logo, Date.now());

    window.dispatchEvent(new CustomEvent("hospital-settings-updated", { detail: updated }));
    return updated;
  };

  return (
    <HospitalSettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        refreshSettings,
      }}
    >
      {children}
    </HospitalSettingsContext.Provider>
  );
};

export const useHospitalSettings = () => {
  const context = useContext(HospitalSettingsContext);
  if (!context) {
    return {
      settings: DEFAULT_HOSPITAL_SETTINGS,
      loading: false,
      updateSettings: async () => {},
      refreshSettings: async () => {},
    };
  }
  return context;
};
