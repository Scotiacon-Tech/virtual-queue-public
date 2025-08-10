import type {components, operations} from "#nuxt-api-party/queuesBackend";
export type Event = components['schemas']['Event']
export type TicketState = components['schemas']['TicketState']
type ResponseJSON = components['responses']['EventsResponse']['content']['application/json']
type NewEvent = components['requestBodies']['NewEventRequest']['content']['application/json']
export type TicketUpdates = {
    state?: TicketState
}
type GetEventsOptions = {
    includeInvisible?: true;
    nameLike?: string
}
type GetEventOptions = {
    includeQueues?: true
}
type GetTicketByIDOptions = {
    includeQueue?: true
    includeEvent?: true
}
type GetAllOpenTicketsOptions = {
    cache?: false
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

export const fetchEventDataPage = async (pageOffset: number, pageSize: number, opts?: GetEventsOptions) => {
    let res = await $queuesBackend('/event', {
        headers: {
            'Accept': 'application/json',
        },
        query: {
            "page[offset]": (pageOffset - 1) * pageSize,
            "page[size]": pageSize,
            "filter[invisible]": opts?.includeInvisible,
            "filter[name_like]": opts?.nameLike,
        }
    });
    return transformPage(res);
}

export const useEventDataPage = (pageOffset: number, pageSize: number, opts?: GetEventsOptions) => {
    return useQueuesBackendData('/event', {
        headers: {
            'Accept': 'application/json',
        },
        query: {
            "page[offset]": (pageOffset - 1) * pageSize,
            "page[size]": pageSize,
            "filter[invisible]": opts?.includeInvisible,
            "filter[name_like]": opts?.nameLike,
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
        "filter[start_time_lte]": dayjs().startOf('day').add(days || 3, 'day').toISOString(),
        sort: ['end_time']
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

export const useGetEventById = (id: string, opt?: GetEventOptions) => {
    let query: operations['get-event-by-id']['parameters']['query']

    if (opt?.includeQueues) {
        query = {
            ...(query || {}),
            include: [...(query?.include || []), 'queue']
        }
    }

    return useQueuesBackendData('/event/{id}', {
        method: 'get',
        path: {id},
        query
    });
}

export const useGetAllOpenTicketsForEvent = (id: string, opts?: GetAllOpenTicketsOptions) => useQueuesBackendData('/ticket', {
    method: 'get',
    query: {
        "page[size]": -1, // Get all
        "filter[event_id]": id,
        "filter[state]": ['Requested', 'OnHold', 'Active']
    },
    cache: opts?.cache,
    transform: (res) => {
        return {
            data: res.data.map(el => ({
                id: el.id,
                name: el.name,
                state: el.state,
                heldAtPosition: el.held_at_position
            })),
            totalItems: res.total_items
        }
    }
})

export const fetchCreateTicket = (queueId: string) => {
    return $queuesBackend('/ticket', {
        method: 'put',
        body: {queueId}
    })
}

export const fetchGetTicket = (ticketId: string, opts?: GetTicketByIDOptions) => {
    let include: ('event' | 'queue')[] = []
    if (opts?.includeQueue) {
        include.push('queue')
    }
    if (opts?.includeEvent) {
        include.push('event')
    }
    return $queuesBackend("/ticket/{id}", {
        method: 'get',
        path: {id: ticketId},
        query: {
            include: include as Readonly<('event' | 'queue')[]>
        }
    });
}

export const fetchUpdateTicket = (ticketId: string, updates: TicketUpdates) => {
    return $queuesBackend("/ticket/{id}", {
        method: 'patch',
        path: {id: ticketId},
        body: updates
    });
}