// public/sw.js

self.addEventListener("install", (event) => {
    self.skipWaiting();
  });
  
  self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());
  });
  
  // ─── Push natif ───────────────────────────────────────────────
  self.addEventListener("push", (event) => {
    if (!event.data) return;
  
    const data = event.data.json();
    const { title, body, link, icon } = data;
  
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: icon || "/icon-192.png",
        badge: "/icon-192.png",
        data: { link },
        vibrate: [200, 100, 200],
      })
    );
  });
  
  // ─── Clic sur la notification OS ──────────────────────────────
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
  
    const link = event.notification.data?.link || "/";
  
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          // Si l'app est déjà ouverte → focus + navigate
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && "focus" in client) {
              client.focus();
              client.navigate(link);
              return;
            }
          }
          // Sinon → ouvre un nouvel onglet
          if (clients.openWindow) {
            return clients.openWindow(link);
          }
        })
    );
  });