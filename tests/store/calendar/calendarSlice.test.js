import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventsState, calendarWithEventsState, event, initialState } from "../../fixtures/calendarState";

describe('prueba en calendarSlice', () => { 
    
    test('debe de regresar el estado por defecto', () => { 
        const state = calendarSlice.getInitialState();
        expect(state).toEqual( initialState )
    })

    test('onSetActiveEvent debe de regresar el evento activo', () => { 
        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( event[0] ) );
        expect(state.activeEvent).toEqual( event[0] )
    }) 

    test('onAddNewEvent debe de agregar el evento', () => { 
        const newEvent = {
            id: '3',
            title: 'Juan birthday',
            notes: 'Buy cake for the party',
            start: new Date( '2023-11-5 13:00:00'),
            end: new Date( '2023-11-5 15:00:00') ,
        }
        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) );
        expect(state.events).toEqual( [ ...event, newEvent ] )
    }) 

    test('onUpdateEvent debe de actualizar el evento', () => { 
        const updatedEvent = {
            id: '1',
            title: 'Boss birthday',
            notes: 'Buy cake for the party 2',
            start: new Date( '2023-11-3 13:00:00'),
            end: new Date( '2023-11-3 15:00:00') ,
        }
        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ) );
        expect(state.events).toContain( updatedEvent )
    }) 

    test('onDeleteEvent debe de eliminar el evento activo', () => { 
        
        const state = calendarSlice.reducer( calendarWithActiveEventsState, onDeleteEvent( ) );
        expect(state.activeEvent).toBe( null )
        expect(state.events).not.toContain( event[0] )

    })


    test('onLoadEvents debe de establecer los eventos', () => { 
        
        const state = calendarSlice.reducer( initialState, onLoadEvents( event ) );

        expect(state.events).toEqual( event );
        expect(state.isLoadingEvents).toBeFalsy( );

        const newState = calendarSlice.reducer( initialState, onLoadEvents( event ) );
        expect( state.events.length).toBe( event.length )


    })

    test('onLogoutCalendar debe de limpiar el estado', () => { 
        
        const state = calendarSlice.reducer( calendarWithActiveEventsState, onLogoutCalendar() );
        expect(state).toEqual( initialState )
    })

})