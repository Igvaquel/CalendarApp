
export const event = [
    {
        id: '1',
        title: 'Boss birthday',
        notes: 'Buy cake for the party',
        start: new Date( '2023-11-3 13:00:00'),
        end: new Date( '2023-11-3 15:00:00') ,
    },
    {
        id: '2',
        title: 'Melisa birthday',
        notes: 'Buy cake for the party',
        start: new Date( '2023-11-4 13:00:00'),
        end: new Date( '2023-11-4 15:00:00') ,
    }

]

export const initialState= {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
}

export const calendarWithEventsState= {
    isLoadingEvents: false,
    events: [ ...event ],
    activeEvent: null
}

export const calendarWithActiveEventsState= {
    isLoadingEvents: false,
    events: [ ...event ],
    activeEvent: { ...event[0] }
}