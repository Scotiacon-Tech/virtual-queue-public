import {
    getVapidPublicKey,
    subscribeToTicketUpdates,
    unsubscribeToTicketUpdates
} from "~/composables/api/pushNotifications";

// Stolen from https://github.com/mdn/serviceworker-cookbook/blob/master/tools.js#L4
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const useNotifications = () => {
    async function available() {
        if (!('serviceWorker' in navigator && "Notification" in window && window.isSecureContext)) {
            return false
        }
        const registration = await navigator.serviceWorker.ready;
        return 'pushManager' in registration;
    }

    async function isEnabled() {
        if (!('serviceWorker' in navigator && "Notification" in window && window.isSecureContext)) {
            return false
        }

        const registration = await navigator.serviceWorker.ready;

        if ('pushManager' in registration) {
            const subscription = await registration.pushManager.getSubscription();
            return subscription !== null;
        }

        return false;
    }

    async function enable() {
        if (!('serviceWorker' in navigator && "Notification" in window && window.isSecureContext)) {
            return false;
        }

        const registration = await navigator.serviceWorker.ready;
        if (!('pushManager' in registration)) {
            return false;
        }

        const result = await Notification.requestPermission()
        if (result === "granted") {
            try {
                const pkBase64 = await getVapidPublicKey()
                const pk = urlBase64ToUint8Array(pkBase64)
                const subscription = await registration.pushManager.subscribe({
                    applicationServerKey: pk,
                    userVisibleOnly: true,
                })
                /*
                Example subscription:
{
    "endpoint": "https://fcm.googleapis.com/fcm/send/eglI2DUgqq4:APA91bH_-u9WOe5wjvtDPBkCRjWM_0dFKkuZTQHubVvREW6vw3DeIKZKH3T3BzCRIJ4zNtPSiyAv-bFitxZxy3JHXX4T5Aaz6melH71LNl0dqdyiN5I2uQy3THkWFMGCrDbfXEfrbujn",
    "expirationTime": null,
    "keys": {
        "p256dh": "BLp5zlRqb1T0lgxCdUviDB5Rs_P-bhk4bIUWnWfO5FBVRVc7ilEIRLwZLzT_t73xHImmRvBhBRji6-Tm2cy3_50",
        "auth": "c8-YLFXktr5_8o2Xen5l8A"
    }
}
                 */
                if (subscription) {
                    await subscribeToTicketUpdates(subscription)
                    // Send the subscription to your server
                    console.info("subscribed to push notifications");
                } else {
                    console.warn("Failed to subscribe to push notifications");
                }
            } catch (e) {
                console.error('failed to subscribe to push notifications', e);
            }
        }
    }

    async function disable() {
        if (!('serviceWorker' in navigator)) {
            return false;
        }

        const registration = await navigator.serviceWorker.ready;

        if ('pushManager' in registration) {
            const subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
                console.warn("No subscription found to unregister");
                return;
            }
            await unsubscribeToTicketUpdates(subscription)
            await subscription.unsubscribe();
        }
    }


    return {
        available,
        isEnabled,
        enable,
        disable,
    }
}