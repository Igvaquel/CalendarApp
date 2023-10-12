/* eslint-disable no-unused-vars */
import { useState } from 'react'

import { Calendar } from 'react-big-calendar'
import { addHours } from 'date-fns'

import 'react-big-calendar/lib/css/react-big-calendar.css'

import { localizer } from '../../helpers'
import { getMessagesES } from '../../helpers/getMessages'

import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, Navbar } from "../"
import { useUiStore,useCalendarStore } from '../../hooks'



export const CalendarPage = () => {

  const { openDateModal } = useUiStore();
  const { events, setActiveEvent } = useCalendarStore();
  const [lastView, setLastView] = useState( localStorage.getItem('lastView') || 'week');

  const eventStyleGetter = ( event, start, end, isSelected ) => {}

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

