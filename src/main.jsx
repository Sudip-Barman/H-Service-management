import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import ScrollToTop from "./components/common/ScrollToTop";
import { HospitalSettingsProvider } from "./context/HospitalSettingsContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <HospitalSettingsProvider>
        <ScrollToTop />
        <App />
      </HospitalSettingsProvider>
    </BrowserRouter>
  </StrictMode>
);