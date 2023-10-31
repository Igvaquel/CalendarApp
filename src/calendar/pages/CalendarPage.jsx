/* eslint-disable no-unused-vars */
import { useState } from 'react'

import { Calendar } from 'react-big-calendar'
import { addHours } from 'date-fns'

import 'react-big-calendar/lib/css/react-big-calendar.css'

import { localizer } from '../../helpers'
import { getMessagesES } from '../../helpers/getMessages'

import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, Navbar } from "../"
import { useUiStore,useCalendarStore, useAuthStore } from '../../hooks'
import { useEffect } from 'react'



export const CalendarPage = () => {

  const { user } = useAuthStore();
  const { openDateModal } = useUiStore();
  const { events, setActiveEvent, startLoadingEvent } = useCalendarStore();
  const [lastView, setLastView] = useState( localStorage.getItem('lastView') || 'week');

  const eventStyleGetter = ( event, start, end, isSelected ) => {

    const isMyEvent = ( user.payload.uid === event.user._id ) || ( user.payload.uid === event.user.uid );

    console.log(isMyEvent);
    const style = {
      backgroundColor: isMyEvent ? '#347CF7' : '#575d61',
      borderRadius: '0px',
      opacity: 0.9,
      color: 'white'
    }

    return {
      style
    }
  }

  const onDoubleClick = ( event ) => {
    openDateModal();
  }
  const onSelect = ( event ) => {
    setActiveEvent( event );
  }
  const onViewChanged = ( event ) => {
    localStorage.setItem('lastView', event);
    setLastView( event )
  }

  useEffect(() => {
    startLoadingEvent()
  }, [])
  

  return (
    <>
      <Navbar/>

      <Calendar
        localizer={ localizer }
        events={ events }
        defaultView={ lastView }
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc( 100vh - 80px )' }}
        // messages={ getMessagesES() }
        eventPropGetter={ eventStyleGetter }
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={ onDoubleClick }
        onSelectEvent={ onSelect }
        onView={ onViewChanged }
      />

      <CalendarModal/>

      <FabAddNew/>
      <FabDelete/>
      
    </>
  )
}

