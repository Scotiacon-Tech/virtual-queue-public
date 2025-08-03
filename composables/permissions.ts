export type AppPermissions = {
    canManageEvents: boolean
    canManageTickets: boolean
}

export const useAppPermissions = () => useState<AppPermissions>(
    'permissions',
    (): AppPermissions => (
        {
            canManageEvents: false,
            canManageTickets: false
        }
    )
);