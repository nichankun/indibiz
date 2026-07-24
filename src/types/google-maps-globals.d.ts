// Deklarasi minimal agar `window.google` bisa dipakai tanpa error TS
// setelah skrip Google Maps JS API dimuat secara dinamis di client.
export {};

declare global {
  interface Window {
    google?: typeof google;
    __onGoogleMapsLoaded?: () => void;
  }
}
