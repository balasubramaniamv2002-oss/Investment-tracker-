/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "818ad17f946bc34fc73d2b5c635d9aba"
  }, {
    "url": "pwa-512x512.png",
    "revision": "bf6c7958dc6ff41f60c1bab1d798f530"
  }, {
    "url": "pwa-192x192.png",
    "revision": "bb4a957161de1a4ea5941d786e14f50b"
  }, {
    "url": "index.html",
    "revision": "c85ca08b39877f9edffb0a529cf4f836"
  }, {
    "url": "icon.svg",
    "revision": "049de7b1631ca68f90d18f70816ec672"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "fab855e53ec226c8f50b3e63772a0215"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/index-ha-WD646.js",
    "revision": null
  }, {
    "url": "assets/index-CWXxI3sW.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "fab855e53ec226c8f50b3e63772a0215"
  }, {
    "url": "icon.svg",
    "revision": "049de7b1631ca68f90d18f70816ec672"
  }, {
    "url": "pwa-192x192.png",
    "revision": "bb4a957161de1a4ea5941d786e14f50b"
  }, {
    "url": "pwa-512x512.png",
    "revision": "bf6c7958dc6ff41f60c1bab1d798f530"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "818ad17f946bc34fc73d2b5c635d9aba"
  }, {
    "url": "manifest.webmanifest",
    "revision": "9fb6aedef66c7639acac03fc0b729d9d"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
