const CACHE_NAME = 'agenda-v2'; // Mudamos para v2 para forçar a atualização
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  // Adicione aqui seus arquivos .css ou .js se existirem, ex:
  // 'style.css',
  // 'script.js'
];

// Instala e guarda no cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Força o novo SW a assumir o controle imediatamente
});

// Limpa caches antigos (importante para remover o erro 404 da v1)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  console.log('Service Worker v2 Ativado e Cache Limpo');
});

// Intercepta as chamadas de rede
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Se tiver no cache, usa. Se não, busca na rede.
      return response || fetch(e.request);
    })
  );
});
