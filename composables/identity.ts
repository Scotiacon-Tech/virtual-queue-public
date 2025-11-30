

export const useSubject = () => {
    const {user} = useOidcAuth()
    return computed(() => {
        return user.value?.userInfo?.sub as string | undefined
    })
}