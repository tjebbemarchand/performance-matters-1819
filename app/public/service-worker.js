'use strict';
const cacheName = 'v1';

const cacheAssets = [
    '/favorites',
    '/offline',
    'css/styles.min.css'
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
    
    e.respondWith(
        fetch(e.request)
        .then(res => {
            const resClone = res.clone();
            caches
                .open(cacheName)
                .then(cache => {
                    cache.put(e.request.url, resClone);
                })
            return res;
        })
        // .catch(err => caches.match(e.request).then(res => res))
        .catch(err => {
            return caches.match(e.request.url).then(res => {
                console.log(res)
                if (res) {
                    return res
                } else {
                    return caches.open(cacheName).then(cache => {
                        // console.log(cache)
                        return cache.match('/offline').then(response => {
                            return response
                        })
                    })
                }
            })

        })
    )
});