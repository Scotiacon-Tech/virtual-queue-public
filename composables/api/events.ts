import type {components, operations} from "#nuxt-api-party/queuesBackend";
type ResponseJSON = components['responses']['EventsResponse']['content']['application/json']
type Event = components['schemas']['Event']
type NewEvent = components['requestBodies']['NewEventRequest']['content']['application/json']
type EventOptions = {
    includeInvisible?: boolean;
}

const dayjs = useDayjs()

const transformPage = (res: ResponseJSON) => {
    const totalPages = Math.floor(res.total_items / res.pagination.self.size) + 1
    const currentPage = (res.pagination.self.offset / res.pagination.self.size) + 1
    return {
        data: res.data,
        totalItems: res.total_items,
        totalPages,
        currentPage
    }
}

export const useEventDataPage = (pageOffset: Ref<number>, pageSize: Ref<number>, opts?: EventOptions) => {
    return useQueuesBackendData('/event', {
        watch: [pageOffset, pageSize],
        headers: {
            'Accept': 'application/json',
        },
        query: {
            "page[offset]": (pageOffset.value - 1) * pageSize.value,
            "page[size]": pageSize.value,
            "filter[invisible]": opts?.includeInvisible
        },
        transform: transformPage
    })
}

export const useEventDataUpcoming = (days?: number) => useQueuesBackendData('/event', {
    headers: {
        'Accept': 'application/json',
    },
    query: {
        "page[size]": 3,
        "filter[start_time_gte]": dayjs().startOf('day').toISOString(),
        "filter[start_time_lte]": dayjs().startOf('day').add(days || 3, 'day').toISOString(),
        sort: ['start_time']
    },
    transform: transformPage
})

export const useCreateEvent = (newEvent: NewEvent) => useQueuesBackendData('/event', {
    method: 'put',
    body: newEvent,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})