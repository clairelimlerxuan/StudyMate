import React, { useState, useEffect, Component} from 'react';
import { useAlert } from 'react-alert';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from 'axios';
import { makeStyles } from "@material-ui/core/styles";
import { Container } from '@material-ui/core';
import { Card } from '@material-ui/core';
import { CardHeader, CardContent } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
    container: {
        display: "block",
        padding:"30px",
        height:"100%",
        justifyContent: 'space-between',
        flexDirection:"row"
    },
    root: {
        width: 1000,
        flexDirection: "column",
        marginBottom: 20,
    },
}));

export default function Timetable(props) {
    const classes = useStyles();
    const [events, setEvents] = useState([]);
    const alert = useAlert();
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        axios
            .get(
                `http://localhost:8000/server/usereventlist/${props.postID}/`
            )
            .then((res) => {
                console.log(res.data);
                setEvents(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className={classes.container}>
        <FullCalendar
        default= 'standard'
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
          events
        ]}
      />
      <Card className = {classes.root} elevation="0">
          <CardHeader title="Add Event">
              
          </CardHeader>
      </Card>
      </div>
    )
  }


