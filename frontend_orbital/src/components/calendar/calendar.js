import React, {Component} from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from "@fullcalendar/timegrid";

export default class DemoApp extends React.Component {
  render() {
    return (
      <FullCalendar
        plugins={[ dayGridPlugin, 
          timeGridPlugin ,interactionPlugin, 
          listPlugin ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        events= {[
          {
            title: 'Meeting',
            start: '2021-07-12T14:30:00',
            end: '2021-07-12T15:30:00',
            extendedProps: {
              department: 'BioChemistry'
            },
            description: 'Lecture'
          },
        ]}
      />
    )
  }
}