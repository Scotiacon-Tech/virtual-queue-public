export const usePagination = (key?: string) => {
    const route = useRoute();

    const pageParam = route.params[key || "page"]

    let page = ref(1)
    if (typeof pageParam === "string") {
        page.value = parseInt(pageParam, 10)
    } else if (Array.isArray(pageParam) && pageParam.length > 0) {
        if (pageParam[0]) {
            page.value = parseInt(pageParam[0], 10)
        }
    }
    if (page.value < 1) {
        page.value = 1
    }
    return page;
}