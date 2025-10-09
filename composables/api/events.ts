import type {components} from "#nuxt-api-party/queuesBackend";

export type Event = components['schemas']['Event']

type EventPageResponseJSON = components['responses']['PaginatedEventsResponse']['content']['application/json']
type TicketPageResponseJSON = components['responses']['PaginatedTicketsResponse']['content']['application/json']
type TicketItemResponseJSON = components['responses']['TicketResponse']['content']['application/json']
type NewEvent = components['requestBodies']['NewEventRequest']['content']['application/json']
type EventUpdate = components['requestBodies']['EventUpdateRequest']['content']['application/json']


export type TicketUpdates = {
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
}
type GetTicketByIDOptions = {
    includeEvent?: true
}
type GetAllOpenTicketsOptions = {
    cache?: false
}

const dayjs = useDayjs()

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
            event: res.related?.event?.find(event => event.id === item.eventId)!,
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
    return transformEventPage(res);
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
        transform: transformEventPage
    })
}

export const useEventDataUpcoming = (days?: number) => useQueuesBackendData('/event', {
    headers: {
        'Accept': 'application/json',
    },
    query: {
        "page[size]": 3,
        "filter[start_time_lte]": dayjs().startOf('day').add(days || 3, 'day').toISOString(),
        "filter[end_time_gte]": dayjs().toISOString(),
        sort: ['end_time']
    },
    transform: transformEventPage
})

export const fetchCreateEvent = (newEvent: NewEvent) => $queuesBackend('/event', {
    method: 'put',
    body: newEvent,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

export const fetchUpdateEvent = (id: string, updatedEvent: EventUpdate) => $queuesBackend('/event/{id}', {
    path: {id},
    method: 'patch',
    body: updatedEvent,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

export const useGetEventById = (id: string) => {
    return useQueuesBackendData('/event/{id}', {
        method: 'get',
        path: {id},
    });
}

export const fetchGetAllEvents = () => {
    return $queuesBackend('/event', {
        method: 'get',
        query: {
            "page[size]": -1
        }
    })
}

export const fetchGetEventsByName = (name: string) => {
    return $queuesBackend('/event', {
        method: 'get',
        query: {
            "filter[name_like]": `%${name}%`
        }
    })
}

export const fetchGetEventById = (id: string) => {
    return $queuesBackend('/event/{id}', {
        method: 'get',
        path: {id}
    })
}

export const useGetAllOpenTicketsForEvent = (id: string, opts?: GetAllOpenTicketsOptions) => useQueuesBackendData('/ticket', {
    method: 'get',
    query: {
        "page[size]": -1, // Get all
        "filter[event_id]": id,
        "filter[state]": ['Requested', 'OnHold', 'Active'],
        "filter[owner]": "1234567890", // TODO
        "include": ["event"]
    },
    cache: opts?.cache,
    transform: transformTicketPage
})

export const fetchCreateTicket = (eventId: string) => {
    return $queuesBackend('/ticket', {
        method: 'put',
        body: {eventId}
    })
}

export const useGetTicketById = (ticketId: string, opts?: GetTicketByIDOptions) => {
    let include: ('event')[] = []
    if (opts?.includeEvent) {
        include.push('event')
    }
    return useQueuesBackendData('/ticket/{id}', {
        method: 'get',
        path: {id: ticketId},
        query: {
            include: include as Readonly<('event')[]>
        },
        transform: transformTicketItem
    })
}

export const fetchGetTicket = (ticketId: string, opts?: GetTicketByIDOptions) => {
    let include: ('event')[] = []
    if (opts?.includeEvent) {
        include.push('event')
    }
    return $queuesBackend("/ticket/{id}", {
        method: 'get',
        path: {id: ticketId},
        query: {
            include: include as Readonly<('event')[]>
        }
    }).then(transformTicketItem);
}

export const fetchUpdateTicket = (ticketId: string, updates: TicketUpdates) => {
    return $queuesBackend("/ticket/{id}", {
        method: 'patch',
        path: {id: ticketId},
        body: updates
    }).then(transformTicketItem);
}

export const fetchDeleteTicket = (ticketId: string) => {
    return $queuesBackend("/ticket/{id}", {
        method: 'delete',
        path: {id: ticketId},
    }).then(transformTicketItem);
}

export const fetchReleaseTickets = (eventId: string, amount?: number) => {
    return $queuesBackend('/event/{id}/activate-tickets', {
        method: 'post',
        path: {id: eventId},
        body: {
            amount: amount || 25,
        }
    })
}

export const useGetEventTicketStatistics = (eventId: string) => {
    return useQueuesBackendData('/event/{id}/ticket-stats', {
        method: 'get',
        path: {id: eventId},
    })
}

export const useMyTickets = (page: number) => {
    if (page <= 1) {
        page = 1
    }
    return useQueuesBackendData('/ticket', {
        method: 'get',
        query: {
            "include": ["event"],
            "page[size]": 25,
            "page[offset]": 25 * (page - 1),
            "filter[state]": ["Requested","OnHold","Active","CheckedIn"],
            "filter[owner]": "1234567890" // TODO: Use logged in user
        },
        transform: transformTicketPage
    })
}

export const useMyActiveTickets = (opts?: {pageSize?: number}) => {
    return useQueuesBackendData('/ticket', {
        method: 'get',
        query: {
            "include": ["event"],
            "page[size]": opts?.pageSize || 3,
            "filter[state]": ["Active"],
            "filter[owner]": "1234567890" // TODO: Use logged in user
        },
        transform: transformTicketPage
    })
}


export const fetchTicketDataPage = async (pageOffset: number, pageSize: number, opts?: GetTicketsOptions) => {
    let res = await $queuesBackend('/ticket', {
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
            "filter[event_id]": opts?.eventId
        }
    });
    return transformTicketPage(res);
}