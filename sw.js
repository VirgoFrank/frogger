// const { response } = require("express")

self.addEventListener("install", (event) =>{
    event.waitUntil(
        caches.open("sw-cache").then((cache)=> {
            return cache.add(["index.html", "forgger.js"])
        })
    )
})

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response)=> {
            return response || fetch(event.request)
        })
    )
})