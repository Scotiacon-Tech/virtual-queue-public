import {getUserSession} from "~/node_modules/nuxt-oidc-auth/dist/runtime/server/utils/session";

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('api-party:request:queuesBackend', async (ctx, event) => {
        const s = await getUserSession(event)
        ctx.options.headers.set('Authorization', `Bearer ${s.accessToken}`)
    })
})