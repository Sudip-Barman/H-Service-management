export const DEFAULT_FAVICON = "/favicon.svg";

/**
 * Resolves a logo string (URL, relative path, or Data URL) into a valid favicon URL.
 * Handles relative URLs by prepending origin or backend URL if applicable,
 * and adds cache-busting for non-data URLs.
 */
export const resolveFaviconUrl = (logo, version) => {
  if (!logo || typeof logo !== "string" || !logo.trim()) {
    return DEFAULT_FAVICON;
  }

  const trimmed = logo.trim();

  // Data URLs are already unique content strings, use directly
  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  // Handle relative upload paths from backend
  let fullUrl = trimmed;
  if (trimmed.startsWith("/uploads") || trimmed.startsWith("uploads/")) {
    const backendBase = "http://127.0.0.1:8000";
    fullUrl = `${backendBase}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  } else if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    // Relative to current host
    fullUrl = `${window.location.origin}${trimmed}`;
  }

  // Cache busting for external / static URLs to ensure browser refreshes icon
  const cacheBuster = version ? `v=${encodeURIComponent(version)}` : `t=${Date.now()}`;
  const separator = fullUrl.includes("?") ? "&" : "?";
  return `${fullUrl}${separator}${cacheBuster}`;
};

/**
 * Detects the MIME type for the favicon link based on the URL or Data URL.
 */
export const getFaviconType = (url) => {
  if (!url || url === DEFAULT_FAVICON) {
    return "image/svg+xml";
  }

  if (url.startsWith("data:")) {
    const mimeMatch = url.match(/^data:([^;,]+)/);
    if (mimeMatch && mimeMatch[1]) {
      return mimeMatch[1];
    }
  }

  const cleanUrl = url.split("?")[0].toLowerCase();
  if (cleanUrl.endsWith(".svg")) return "image/svg+xml";
  if (cleanUrl.endsWith(".png")) return "image/png";
  if (cleanUrl.endsWith(".jpg") || cleanUrl.endsWith(".jpeg")) return "image/jpeg";
  if (cleanUrl.endsWith(".webp")) return "image/webp";
  if (cleanUrl.endsWith(".ico")) return "image/x-icon";

  return "image/png";
};

/**
 * Directly applies a given href and MIME type to all favicon link elements in document.head.
 * Replaces the element node to force instant browser redraw across all major browsers.
 */
const applyFaviconLink = (href, type) => {
  try {
    const existingLinks = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    
    // Remove existing link elements to force browser tab redraw
    existingLinks.forEach((el) => el.remove());

    const newLink = document.createElement("link");
    newLink.id = "app-favicon";
    newLink.rel = "icon";
    if (type) {
      newLink.type = type;
    }
    newLink.href = href;
    document.head.appendChild(newLink);
  } catch (err) {
    console.warn("Could not update favicon link element:", err);
  }
};

/**
 * Dynamically updates the browser favicon.
 * Supports Data URLs, external URLs, and relative paths.
 * Gracefully falls back to DEFAULT_FAVICON if the image is missing or fails to load.
 */
export const setBrowserFavicon = (logoUrl, version) => {
  if (typeof document === "undefined") return;

  // 1. If empty or cleared, revert to default favicon immediately
  if (!logoUrl || typeof logoUrl !== "string" || !logoUrl.trim()) {
    applyFaviconLink(DEFAULT_FAVICON, "image/svg+xml");
    return;
  }

  const targetUrl = resolveFaviconUrl(logoUrl, version);
  const targetType = getFaviconType(targetUrl);

  // 2. If it's a Data URL, apply immediately (fast path)
  if (targetUrl.startsWith("data:image/")) {
    applyFaviconLink(targetUrl, targetType);
    return;
  }

  // 3. If target is already the default favicon
  if (targetUrl === DEFAULT_FAVICON) {
    applyFaviconLink(DEFAULT_FAVICON, "image/svg+xml");
    return;
  }

  // 4. For remote or relative URLs, test-load via Image to prevent broken favicons
  try {
    const img = new Image();
    img.onload = () => {
      applyFaviconLink(targetUrl, targetType);
    };
    img.onerror = () => {
      console.warn("Configured logo failed to load as favicon. Falling back to default favicon.");
      applyFaviconLink(DEFAULT_FAVICON, "image/svg+xml");
    };
    img.src = targetUrl;
  } catch (e) {
    applyFaviconLink(DEFAULT_FAVICON, "image/svg+xml");
  }
};
