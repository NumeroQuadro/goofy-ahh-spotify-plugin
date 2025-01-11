// service-worker.js

// Define widgets
const widgets = [
  {
    tag: "pwamp", // The tag matches the widget's manifest tag
    template: "https://raw.githubusercontent.com/NumeroQuadro/goofy-ahh-spotify-plugin/master/widgets/mini-player-template.json",
    data: "https://raw.githubusercontent.com/NumeroQuadro/goofy-ahh-spotify-plugin/master/widgets/mini-player-data.json",
    type: "application/json",
    update: 86400, // Frequency to update widget data in seconds
    auth: false, // No authentication required
  },
];

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installed.");
  self.skipWaiting(); // Activate immediately
});

// Fetch event (mandatory for widget functionality)
self.addEventListener("fetch", (event) => {
  console.log(`Fetch event: ${event.request.url}`);
});

// Widget registration
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "INIT_WIDGETS") {
    event.waitUntil(
      self.registration.widgets.register(widgets).then(() => {
        console.log("Widgets registered successfully:", widgets);
      })
    );
  }
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
  // Cleanup tasks if necessary
});
