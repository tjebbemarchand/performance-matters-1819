// 'use strict';
const cacheName = 'v1';

const cacheAssets = [
    '/favorites',
    '/detailpage',
    'css/styles.css'
];

// Call Install Event
self.addEventListener('install', function(e) {
    console.log('Service Worker: Installed');

    e.waitUntil(
        caches
            .open(cacheName)
            .then(function(cache) {
                console.log('Service Worker: Caching files');
                cache.addAll(cacheAssets);
            })
            .then(function() {
                self.skipWaiting();
            })
    );
});

// Call Activate Event
self.addEventListener('activate', function(e) {
    console.log('Service Worker: Activated');

    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cache) {
                    if(cache !== cacheName) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});

// Call Fetch Event
self.addEventListener('fetch', function(e) {
    console.log('Service Worker: Fetching');

    e.respondWith(fetch(e.request)
        .catch(function() {
            return caches.match(e.request)
                .then(function(response) {
                    if(response) {
                        return response;
                    } else {
                        return new Response('Failed');
                    }
                })  
        })
    )
});











// // // // Set a name for the current cache
// // // const cacheName = 'v1';

// // // // Default files to always cache
// // // const cacheFiles = [
// // //     '/favorites'
// // // ];

// // self.addEventListener('install', function (e) {
// //     console.log('[ServiceWorker] Installed');

// //     // // e.waitUntil Delays the event until the Promise is resolved
// //     // e.waitUntil(

// //     //     // Open the cache
// //     //     caches.open(cacheName).then(function (cache) {

// //     //         // Add all the default files to the cache
            
// //     //         console.log('[ServiceWorker] Caching cacheFiles');
        
// //     //         return cache.addAll(cacheFiles);
// //     //     }).then(function() {
// //     //         self.skipWaiting();
// //     //     })
// //     // );
// // });

// // self.addEventListener('activate', function (e) {
// //     console.log('[ServiceWorker] Activated');

// //     // e.waitUntil(

// //     //     // Get all the cache keys (cacheName)
// //     //     caches.keys().then(function (cacheNames) {
// //     //         return Promise.all(cacheNames.map(function (thisCacheName) {

// //     //             // If a cached item is saved under a previous cacheName
// //     //             if (thisCacheName !== cacheName) {

// //     //                 // Delete that cached file
// //     //                 console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
// //     //                 return caches.delete(thisCacheName);
// //     //             }
// //     //         }));
// //     //     })
// //     // );
// // });

// // self.addEventListener('fetch', function (e) {
// //     console.log('fetch');
// // });















// // self.addEventListener('install', (event) => {
// //     console.log('installing service workers', event);
// //     event.waitUntil(self.skipWaiting())
// // });

// // self.addEventListener('activate', (event) => {
// //     console.log('activation service worker', event);
// // });

// // self.addEventListener('fetch', (event) => {
// //     console.log('fetch event', event);
// //     if (isHtmlGetRequest(event.request)) {
// //         event.respondWith(fetch(event.request))
// //             .then(response => {
// //                 return caches.open('html-cache').then(cache => {
// //                     return cache.put(event.request.url, response.clone()).then(() => {
// //                         return response
// //                     })
// //                 })
// //             })
// //             .catch(err => {
// //                 return caches.open('html-cache').then(cache => {
// //                     return caches.match(event.request.url).then(response => {
// //                         console.log(response)
// //                         // return response
// //                         if (response) {
// //                             return response
// //                         } else {
// //                             return caches.open('core-cache').then(cache => {
// //                                 // console.log(cache)
// //                                 return cache.match('/offline').then(response => {
// //                                     return response
// //                                 })
// //                             })
// //                         }
// //                     })
// //                 })
// //                 // return caches.open('core-cache').then(cache => {
// //                 //     // console.log(cache)
// //                 //     return cache.match('/offline').then(response => {
// //                 //         return response
// //                 //     })
// //                 //     // kijk of je een object hebt die matchet met je url??
// //                 // })
// //             })
// //     }
// // });

// // function isHtmlGetRequest(request) {
// //     return request.method === 'GET' && coreCaches.includes(getPathName(request.url));
// // }