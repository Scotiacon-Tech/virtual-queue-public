function arrayBufferToURLBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';

    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]!);
    }

    return window.btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function toApiBody(subscription : PushSubscription) {
    const p256dh = subscription.getKey('p256dh')
    const auth = subscription.getKey('auth')
    if (!p256dh || !auth) {
        throw new Error('Unable to connect to Push Subscription')
    }
    return {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: {
            p256dh: arrayBufferToURLBase64(p256dh),
            auth: arrayBufferToURLBase64(auth)
        }
    }
}

export const getVapidPublicKey = () => {
    return $queuesBackend('/.vapid/public-key')
}


export const subscribeToTicketUpdates = (subscription : PushSubscription) => {
    return $queuesBackend('/push-subscriptions', {
        method: 'post',
        body: toApiBody(subscription),
    })
}

export const unsubscribeToTicketUpdates = (subscription : PushSubscription) => {
   return $queuesBackend('/push-subscriptions', {
        method: 'delete',
        body: toApiBody(subscription),
    })
}