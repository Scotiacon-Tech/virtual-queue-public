class PermissionsError extends Error {}

export type AppPermissions = {
    canDoSomething: boolean
    canCreateEvent: boolean
    canViewEvent: boolean
    canViewInvisibleEvent: boolean
    canViewTicketStats: boolean
    canListEvents: boolean
    canListInvisibleEvents: boolean
    canUpdateEvent: boolean
    canDeleteEvent: boolean
    canRequestTicket: boolean
    canViewTicket: boolean
    canListTickets: boolean
    canActivateTicket: boolean
    canCheckInTicket: boolean
    canPlaceTicketOnHold: boolean
    canReleaseHoldOnTicket: boolean
    canRevokeTicket: boolean
    canConsumeTicket: boolean
    canManageEvents: boolean
    canManageTickets: boolean
}
export type AppPermission = keyof AppPermissions

export const useAppPermissions = (init: AppPermissions) => useState<AppPermissions>('permissions', (): AppPermissions => init);

export const fetchPermissions = async (): Promise<AppPermissions> => {
    try {
        const {status, user} = await $queuesBackend('/capabilities', {key: 'app-permissions'})
        const directPermissions = {
            canDoSomething: status.api == "online",
            canCreateEvent: user.allowedActions.includes("event:create"),
            canViewEvent: user.allowedActions.includes("event:view"),
            canViewInvisibleEvent: user.allowedActions.includes("event:view-invisible"),
            canViewTicketStats: user.allowedActions.includes("event:view-ticket-stats"),
            canListEvents: user.allowedActions.includes("event:list"),
            canListInvisibleEvents: user.allowedActions.includes("event:list-invisible"),
            canUpdateEvent: user.allowedActions.includes("event:update"),
            canDeleteEvent: user.allowedActions.includes("event:delete"),
            canRequestTicket: user.allowedActions.includes("ticket:request"),
            canViewTicket: user.allowedActions.includes("ticket:view"),
            canListTickets: user.allowedActions.includes("ticket:list"),
            canActivateTicket: user.allowedActions.includes("ticket:activate"),
            canCheckInTicket: user.allowedActions.includes("ticket:check-in"),
            canPlaceTicketOnHold: user.allowedActions.includes("ticket:place-on-hold"),
            canReleaseHoldOnTicket: user.allowedActions.includes("ticket:release-hold"),
            canRevokeTicket: user.allowedActions.includes("ticket:revoke"),
            canConsumeTicket: user.allowedActions.includes("ticket:consume"),
        }

        return {
            ...directPermissions,
            canManageEvents: [
                    directPermissions.canListEvents,
                    directPermissions.canListInvisibleEvents,
                    directPermissions.canViewEvent,
                    directPermissions.canViewInvisibleEvent,
                ].every(el => el)
                && [
                    directPermissions.canCreateEvent,
                    directPermissions.canUpdateEvent,
                    directPermissions.canDeleteEvent,
                    directPermissions.canViewTicketStats,
                ].some(el => el),
            canManageTickets: [
                directPermissions.canViewTicket,
                directPermissions.canListTickets,
            ].every(el => el) && [
                directPermissions.canActivateTicket,
                directPermissions.canCheckInTicket,
                directPermissions.canConsumeTicket,
                directPermissions.canRevokeTicket,
                directPermissions.canRevokeTicket,
            ].some(el => el),
        }
    } catch (error) {
        return {
            canDoSomething: false,
            canCreateEvent: false,
            canViewEvent: false,
            canViewInvisibleEvent: false,
            canViewTicketStats: false,
            canListEvents: false,
            canListInvisibleEvents: false,
            canUpdateEvent: false,
            canDeleteEvent: false,
            canRequestTicket: false,
            canViewTicket: false,
            canListTickets: false,
            canActivateTicket: false,
            canCheckInTicket: false,
            canPlaceTicketOnHold: false,
            canReleaseHoldOnTicket: false,
            canRevokeTicket: false,
            canConsumeTicket: false,
            canManageEvents: false,
            canManageTickets: false,
        }
    }
}

export const hasAppPermissions = (permissions: AppPermission[]) => {
    const p = useState<AppPermissions>('permissions')
    return permissions.every(key => p.value[key])
}

export const requireAppPermissions = (permissions: AppPermission[]) => {
    if (!hasAppPermissions(permissions)) {
        throw createError({
            fatal: false,
            status: 403,
            statusMessage: "Forbidden",
            name: "Forbidden",
            message: "You are not authorized to view this page",
        })
    }
}
