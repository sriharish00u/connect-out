/**
 * @file Google Maps JS API lazy loader
 * @description Dynamically loads the Maps JavaScript API script on demand.
 * @service Google Maps Platform (Maps JS API, Geocoding API)
 */

let loadingPromise: Promise<void> | null = null;

/**
 * Loads the Google Maps JS API script. Safe to call multiple times — the
 * script is only appended once and subsequent calls share the same promise.
 */
export function loadGoogleMaps(): Promise<void> {
  if (loadingPromise) return loadingPromise;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    loadingPromise = Promise.reject(new Error("VITE_GOOGLE_MAPS_API_KEY is not set"));
    return loadingPromise;
  }

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__gmapsCallback`;
    script.async = true;
    script.defer = true;

    window.__gmapsCallback = () => {
      resolve();
    };

    script.onerror = () => {
      loadingPromise = null;
      reject(new Error("Failed to load Google Maps JS API"));
    };

    document.head.appendChild(script);
  });

  return loadingPromise;
}
