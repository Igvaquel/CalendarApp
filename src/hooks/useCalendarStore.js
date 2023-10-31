import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {

    const dispatch = useDispatch();

    const { events, activeEvent } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) )
    }

    const startSavingEvent = async( calendarEvent ) =>{

        try {
            if( calendarEvent.id ) {
                //Actualizado
                await calendarApi.post(`events/${ calendarEvent.id }`, calendarEvent);
                dispatch( onUpdateEvent( { ...calendarEvent, user } ) );
                return;
            }
    
            //Creado
            const { data } = await calendarApi.post('/events', calendarEvent);
            dispatch( onAddNewEvent({ ...calendarEvent, id: data.event.id, user }))
        } catch (error) {
            console.log(error);
            Swal.fire('Error saving', error.response.data?.msg, 'error');
        }

        
    }

    const startDeletingEvent = async() => {

        try {
            await calendarApi.delete(`events/${ activeEvent.id }`);
            dispatch( onDeleteEvent() );
            return;
        } catch (error) {
            console.log(error);
            Swal.fire('Error deleting', error.response.data?.msg, 'error');
        }
    }

    const startLoadingEvent = async() => {
        
        try {
            const { data } = await calendarApi.get('events')
            const events = convertEventsToDateEvents( data.events );
            dispatch( onLoadEvents( events ) )

        } catch (error) {
            console.log('Error loading events');
            console.log(error);
        }
    }


    return{
        //Properties
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        //Methods
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvent
    }
}
