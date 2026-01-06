/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { precacheAndRoute } from "workbox-precaching/precacheAndRoute"
import {clientsClaim} from "workbox-core";
import {imageCache, staticResourceCache} from "workbox-recipes";
import {cleanupOutdatedCaches} from "workbox-precaching";
import {setDefaultHandler} from "workbox-routing";
import {NetworkOnly} from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope

// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST)

type Ticket = {
    id: string
}

type GetTicketsResponse = {
    data: Ticket[]
    total_items: number
}

async function sha256(message: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return hash;
}

function arrayBufferToBase64Direct(buffer: ArrayBuffer): string {
    const bytes = Array.from(new Uint8Array(buffer));
    const binary = String.fromCharCode(...bytes)
    return btoa(binary);
}

// Function to call your remote API and check for new data
async function checkForNewDataAndNotify() {
    try {
        const origin = self.location.origin;
        let url = new URL(origin);
        url.pathname = '/api/_proxy/queuesBackend';
        const req = {
            "path": "/ticket",
            "query": {
                "page[size]": 1,
                "filter[owner]": "self",
                "filter[state]": "Active",
            },
            "headers": [["accept", "application/json"]]
        }

        const resp = await fetch(
            url,
            {
                method: "POST",
                body: JSON.stringify(req),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            }
        )
        const respJson: GetTicketsResponse = await resp.json()
        const totalActiveTickets = respJson.total_items
        if (totalActiveTickets > 0) {
            // Generate a hash of the IDs so we can make a new notification when the state changes
            const allIds = respJson.data.map((item) => item.id).sort();
            const hash = await sha256(allIds.join('|'))
            const base64Hash = arrayBufferToBase64Direct(hash)

            // Show the notification using the Notifications API
            let body: string | undefined;
            if (totalActiveTickets == 1) {
                body = `You have 1 ticket ready to use. This ticket will only be valid for 1 hour.`;
            } else {
                body = `You have ${totalActiveTickets} tickets ready to use. These tickets will only be valid for 1 hour.`;
            }

            const tag = `notify-when-ticket-available:${base64Hash}`
            console.log('Generating notification', tag)
            return self.registration.showNotification(
                'Tickets ready to use',
                {
                    body,
                    tag,
                    icon: '/logos/192x192.png',
                }
            );

        }
    } catch (error) {
        // Log the error but ensure the promise resolves/rejects
        console.error('API call failed during periodic sync:', error);
        // You can throw the error to potentially signal the browser to retry later
        throw error;
    }
}
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        // Force the service worker to transition from waiting to activating
        self.skipWaiting();
    }
});

self.addEventListener(
    'periodicsync',
    // @ts-ignore Periodic Sync is experimental
    function (event: ServiceWorkerGlobalScopeEventMap['periodicsync']) {
        if (event.tag === 'notify-when-ticket-available') {
            // event.waitUntil() ensures the Service Worker stays alive until
            // the promise (the API call and notification) is complete.
            event.waitUntil(
                checkForNewDataAndNotify()
            );
        }
    },
);

self.addEventListener('notificationclick', (event) => {
    event.notification.close()

    // Open the URL specified in the notification data
    const urlToOpen = event.notification.data.url || '/'

    event.waitUntil(
        self.clients.openWindow(urlToOpen)
    )
})

self.addEventListener('push', event => {
    const data = event.data?.json();
    if (!data) return;

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            //icon: '/icon.png', // optional
            tag: 'notify-when-ticket-available'
        })
    );
});

setDefaultHandler(new NetworkOnly())
cleanupOutdatedCaches()

staticResourceCache()
imageCache()
clientsClaim()