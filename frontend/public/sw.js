const CACHE_NAME = 'freelamz-v1';
const STATIC_ASSETS = [
  '/',
  '/projects',
  '/messages',
  '/manifest.json',
];

// Instalar service worker e fazer cache dos assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activar e limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Estratégia: Network first, cache como fallback
self.addEventListener('fetch', (event) => {
  // Ignora pedidos que não são GET
  if (event.request.method !== 'GET') return;
  
  // Ignora pedidos à API (sempre vai buscar ao servidor)
  if (event.request.url.includes('/api/')) return;
  if (event.request.url.includes('railway.app')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Guarda no cache se for resposta válida
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline: serve do cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Fallback para página principal se offline
          return caches.match('/');
        });
      })
  );
});

// Notificações push
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Freelamz';
  const options = {
    body: data.body || 'Tens uma nova notificação',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});