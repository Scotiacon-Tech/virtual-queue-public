export async function getCapabilities() {
    return await $queuesBackend(
        '/capabilities',
        {
            key: 'app-permissions',
        })
}