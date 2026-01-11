import type {components} from "#nuxt-api-party/queuesBackend";
import dayjs from "dayjs";

export type Event = components['schemas']['Event']

type EventPageResponseJSON = components['responses']['PaginatedEventsResponse']['content']['application/json']
type TicketPageResponseJSON = components['responses']['PaginatedTicketsResponse']['content']['application/json']
type TicketItemResponseJSON = components['responses']['TicketResponse']['content']['application/json']
type NewEvent = components['requestBodies']['NewEventRequest']['content']['application/json']
type EventUpdate = components['requestBodies']['EventUpdateRequest']['content']['application/json']


export type TicketUpdates = {
    expires?: Date | string
    state?: UpdateTicketState
}
type GetEventsOptions = {
    includeInvisible?: true;
    nameLike?: string
}
type GetTicketsOptions = {
    eventId?: string
    owner?: string
    state?: TicketState[]
    ticketNumber?: string
    badgeIdLike?: string
}
type GetTicketByIDOptions = {
    includeEvent?: true
}
type GetAllOpenTicketsOptions = {
    owner?: string
    cache?: false
}

const transformEventPage = (res: EventPageResponseJSON) => {
    const totalPages = Math.floor(res.total_items / res.pagination.self.size) + 1
    const currentPage = (res.pagination.self.offset / res.pagination.self.size) + 1
    return {
        data: res.data,
        totalItems: res.total_items,
        totalPages,
        currentPage
    }
}

const transformTicketPage = (res: TicketPageResponseJSON) => {
    const totalPages = Math.floor(res.total_items / res.pagination.self.size) + 1
    const currentPage = (res.pagination.self.offset / res.pagination.self.size) + 1
    return {
        data: res.data.map(item => ({
            ...transformTicket(item),
            event: res.related?.event?.find(event => event.id === item.eventId),
        })),
        totalItems: res.total_items,
        totalPages,
        currentPage
    }
}

const transformTicketItem = (res: TicketItemResponseJSON) => {
    return {
        ...transformTicket(res.data),
        event: res.related?.event
    }
}

const transformTicket = (t: components['schemas']['Ticket']) => {
    return {
        ...t,
        stateDescription: ticketStateDescription(t)
    }
}

const ticketStateDescription = (t: components['schemas']['Ticket']) => {
    switch (t.state) {
        case "Active": {
            if (t.expires) {
                const expires = dayjs(t.expires)
                if (dayjs().isSame(expires, 'day')) {
                    return "Active until " + expires.format('LT')
                } else {
                    return "Active until " + expires.format('LLL')
                }
            } else {
                return 'Active'
            }
        }
        case "Expired": {
            if (t.expires) {
                const expires = dayjs(t.expires!)
                if (dayjs().isSame(expires, 'day')) {
                    return "Expired at " + expires.format('LT')
                } else {
                    return "Expired at " + expires.format('LLL')
                }
            } else {
                return 'Expired'
            }
        }
        case "CheckedIn":
            return "Checked In"
        case "OnHold":
            return "On hold"
        case "Consumed":
            return "Used"
        case "Revoked":
            return "Used"
        case "Requested":
            return "Requested";
    }
}

export type TicketPage = ReturnType<typeof transformTicketPage>
export type Ticket = ReturnType<typeof transformTicket>
export type TicketItem = ReturnType<typeof transformTicketItem>
export type TicketRelated = components['schemas']['TicketRelated']
export type TicketState = components['schemas']['TicketState']
export type UpdateTicketState = components['schemas']['UpdateTicketState']

export const fetchEventDataPage = (pageOffset: number, pageSize: number, opts?: GetEventsOptions) =>
    $queuesBackend('/event', {
        headers: {
            'Accept': 'application/json',
        },
        query: {
            "page[offset]": (pageOffset - 1) * pageSize,
            "page[size]": pageSize,
            "filter[invisible]": opts?.includeInvisible,
            "filter[name_like]": opts?.nameLike,
        },
        cache: import.meta.server,
    }).then(transformEventPage)

export const useEventDataPage = (pageOffset: number, pageSize: number, opts?: GetEventsOptions) =>
    useQueuesBackendData('/event', {
        headers: {
            'Accept': 'application/json',
        },
        query: {
            "page[offset]": (pageOffset - 1) * pageSize,
            "page[size]": pageSize,
            "filter[invisible]": opts?.includeInvisible,
            "filter[name_like]": opts?.nameLike,
        },
        cache: import.meta.server,
        transform: transformEventPage
    })

export const useEventDataUpcoming = (start: dayjs.Dayjs, end: dayjs.Dayjs) =>
    useQueuesBackendData('/event', {
        headers: {
            'Accept': 'application/json',
        },
        query: {
            "page[size]": 3,
            "filter[start_time_lte]": start.toISOString(),
            "filter[end_time_gte]": end.toISOString(),
            sort: ['end_time']
        },
        cache: import.meta.server,
        transform: transformEventPage
    })

export const fetchCreateEvent = (newEvent: NewEvent) =>
    $queuesBackend('/event', {
        method: 'put',
        body: newEvent,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        cache: false,
    })

export const fetchUpdateEvent = (id: string, updatedEvent: EventUpdate) =>
    $queuesBackend('/event/{id}', {
        path: {id},
        method: 'patch',
        body: updatedEvent,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        cache: false,
    })

export const useGetEventById = (id: string) =>
    useQueuesBackendData('/event/{id}', {
        method: 'get',
        path: {id},
        cache: import.meta.server,
    })

export const fetchGetAllEvents = () =>
    $queuesBackend('/event', {
        method: 'get',
        query: {
            "page[size]": -1
        },
        cache: import.meta.server,
    })

export const fetchGetEventsByName = (name: string) =>
    $queuesBackend('/event', {
        method: 'get',
        query: {
            "filter[name_like]": `%${name}%`
        },
        cache: import.meta.server,
    })

export const fetchGetEventById = (id: string) =>
    $queuesBackend('/event/{id}', {
        method: 'get',
        path: {id},
        cache: import.meta.server,
    })

export const useGetAllOpenTicketsForEvent = (id: string, opts?: GetAllOpenTicketsOptions) =>
    useQueuesBackendData('/ticket', {
        method: 'get',
        query: {
            "page[size]": -1, // Get all
            "filter[event_id]": id,
            "filter[state]": ['Requested', 'OnHold', 'Active'],
            "filter[owner]": opts?.owner,
            "include": ["event"]
        },
        cache: import.meta.server,
        transform: transformTicketPage
    })

export const fetchCreateTicket = (eventId: string) =>
    $queuesBackend('/ticket', {
        method: 'put',
        body: {eventId},
        cache: false,
    })

export const useGetTicketById = (ticketId: string, opts?: GetTicketByIDOptions) => {
    const include: ('event')[] = []
    if (opts?.includeEvent) {
        include.push('event')
    }

    return useQueuesBackendData('/ticket/{id}', {
        method: 'get',
        path: {id: ticketId},
        query: {
            include: include as Readonly<('event')[]>
        },
        cache: import.meta.server,
        transform: transformTicketItem
    })
}

export const fetchGetTicket = async (ticketId: string, opts?: GetTicketByIDOptions) => {
    const include: ('event')[] = []
    if (opts?.includeEvent) {
        include.push('event')
    }
    const res = await $queuesBackend("/ticket/{id}", {
        method: 'get',
        path: {id: ticketId},
        query: {
            include: include as Readonly<('event')[]>
        },
        cache: false,
    });
    return transformTicketItem(res);
}

export const fetchUpdateTicket = (ticketId: string, updates: TicketUpdates) =>
    $queuesBackend("/ticket/{id}", {
        method: 'patch',
        path: {id: ticketId},
        body: updates,
        cache: false,
    }).then(transformTicketItem)

export const fetchDeleteTicket = (ticketId: string) =>
    $queuesBackend("/ticket/{id}", {
        method: 'delete',
        path: {id: ticketId},
        cache: false,
    })

export const fetchReleaseTickets = (eventId: string, amount?: number) =>
    $queuesBackend('/event/{id}/activate-tickets', {
        method: 'post',
        path: {id: eventId},
        body: {
            amount: amount || 25,
        },
        cache: false,
    })

export const useGetEventTicketStatistics = (eventId: string) =>
    useQueuesBackendData('/event/{id}/ticket-stats', {
        method: 'get',
        path: {id: eventId},
        cache: import.meta.server,
    })

export const useMyTickets = (subject: string | undefined, page: number) => {
    if (page <= 1) {
        page = 1
    }
    return useQueuesBackendData('/ticket', {
        method: 'get',
        query: {
            "include": ["event"],
            "page[size]": 25,
            "page[offset]": 25 * (page - 1),
            "filter[state]": ["Requested", "OnHold", "Active", "CheckedIn"],
            "filter[owner]": subject
        },
        cache: import.meta.server,
        transform: transformTicketPage
    })
}

export const useMyActiveTickets = (subject: string | undefined, opts?: { pageSize?: number }) =>
    useQueuesBackendData('/ticket', {
        method: 'get',
        query: {
            "include": ["event"],
            "page[size]": opts?.pageSize || 3,
            "filter[state]": ["Active"],
            "filter[owner]": subject
        },
        cache: import.meta.server,
        transform: transformTicketPage
    })


export const fetchTicketDataPage = (pageOffset: number, pageSize: number, opts?: GetTicketsOptions) =>
    $queuesBackend('/ticket', {
        headers: {
            'Accept': 'application/json',
        },
        query: {
            "page[offset]": (pageOffset - 1) * pageSize,
            "page[size]": pageSize,
            "include": ["event"],
            "filter[owner]": opts?.owner,
            "filter[state]": opts?.state,
            "filter[name]": opts?.ticketNumber,
            "filter[event_id]": opts?.eventId,
            "filter[badge_id_like]": opts?.badgeIdLike,
        },
        cache: import.meta.server,
    }).then(transformTicketPage);
