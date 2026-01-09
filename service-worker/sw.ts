/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import {clientsClaim} from "workbox-core";

declare let self: ServiceWorkerGlobalScope

const ACTIVE_TICKETS_V1_NAME = 'ActiveTicketsV1';
type ActiveTicketsV1PushEvent = {
    count: number
};

async function clearNotifications(tag: string) {
    const notifications = await self.registration.getNotifications({tag})
    for (let n of notifications) {
        n.close()
    }
}

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        // Force the service worker to transition from waiting to activating
        event.waitUntil(
            self.skipWaiting()
        );
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close()

    event.waitUntil(
        self.clients.matchAll({
            type: "window"
        }).then(function (clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client && client.url == '/' && 'focus' in client)
                    return client.focus();
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow('/');
            }
        })
    )
})

const notifyWhenTicketActiveTag = 'notify-when-ticket-active';

self.addEventListener('push', event => {
    try {
        const data = event.data?.json();
        if (!data) return;

        if (data.name == ACTIVE_TICKETS_V1_NAME) {
            console.log('Processing active tickets push notification')
            const pushEvent = data.data as ActiveTicketsV1PushEvent;

            if (pushEvent.count == 1) {
                event.waitUntil(
                    self.registration.showNotification(
                        `You have 1 ticket ready to use`,
                        {
                            body: 'This ticket will only be valid for 1 hour.',
                            tag: notifyWhenTicketActiveTag,
                            // @ts-ignore: experimental, not available on firefox and safari
                            renotify: true,
                        }
                    )
                );
            } else if (pushEvent.count > 1) {
                event.waitUntil(
                    self.registration.showNotification(
                        `You have ${pushEvent.count} tickets ready to use`,
                        {
                            body: 'Tickets will only be valid for 1 hour.',
                            tag: notifyWhenTicketActiveTag,
                            // @ts-ignore: experimental, not available on firefox and safari
                            renotify: true
                        }
                    )
                );
            } else {
                event.waitUntil(
                    clearNotifications(notifyWhenTicketActiveTag)
                )
            }
        }
    } catch (e) {
        console.error('Error occurred trying to process push message', e)
    }
});

clientsClaim()