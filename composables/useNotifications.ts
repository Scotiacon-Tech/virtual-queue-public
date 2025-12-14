const tag = 'notify-when-ticket-available';

export const useNotifications = () => {
    const nuxt = useNuxtApp()

    async function available() {
        if (!('serviceWorker' in navigator && "Notification" in window && window.isSecureContext && nuxt.$pwa?.isPWAInstalled)) {
            return false
        }
        const registration = await navigator.serviceWorker.ready;
        return 'periodicSync' in registration;
    }

    async function isEnabled() {
        if (!('serviceWorker' in navigator && "Notification" in window && window.isSecureContext && nuxt.$pwa?.isPWAInstalled)) {
            return false
        }

        const registration = await navigator.serviceWorker.ready;

        if ('periodicSync' in registration) {
            // @ts-ignore Periodic sync is experimental just now
            const tags: string[] = await registration.periodicSync.getTags()
            return tags.includes(tag)
        }

        return false;
    }

    async function enable() {
        if (!('serviceWorker' in navigator && "Notification" in window && window.isSecureContext && nuxt.$pwa?.isPWAInstalled)) {
            return false;
        }

        const registration = await navigator.serviceWorker.ready;
        if (!('periodicSync' in registration)) {
            return false;
        }

        const result = await Notification.requestPermission()
        if (result === "granted") {
            try {
                // @ts-ignore Periodic sync is experimental just now
                await registration.periodicSync.register(
                    tag,
                    {
                        minInterval: 5 * 60 * 1000 // 5 min
                    }
                )
                console.info("registered 'notify-when-ticket-available' periodic sync worker");
            } catch (e) {
                console.error('failed to register periodic sync worker', e);
            }
        }
    }

    async function disable() {
        if (!('serviceWorker' in navigator)) {
            return false;
        }

        const registration = await navigator.serviceWorker.ready;

        if ('periodicSync' in registration) {
            // @ts-ignore Periodic sync is experimental just now
            registration.periodicSync.unregister(tag)
        }
    }


    return {
        available,
        isEnabled,
        enable,
        disable,
    }
}