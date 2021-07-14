import React, { useState, useEffect, Component} from 'react';
import { useAlert } from 'react-alert';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from 'axios';
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, CssBaseline } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { TextFields } from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    paddingTop: "50px",
    justifyContent:'center',
    flexDirection:'column',
    padding: "20px",
  },
  root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth:600,
      padding:"10px"
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },

  calendar: {
    padding:"20px"
  }
}));

export default function Timetable(props) {
    const classes = useStyles();
    const [events, setEvents] = useState([]);
    const alert = useAlert();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");


    const handleOpen= () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const onTypeChange = (e) => {
      setType(e.target.value);
    };

    const onTitleChange = (e) => {
      setTitle(e.target.value);
    };

    const onDescChange = (e) => {
      setDesc(e.target.value)
    }
    
    const onStartChange = (e) => {
      setStart(e.target.value);
    };
    
    const onEndChange = (e) => {
      setEnd(e.target.value);
    };

    const handleSubmitEvent = (e) => {
      axios
        .post(
        `http://localhost:8000/server/createevent/`,
        {
            userID : props.id,
            title : title,
            description : desc,
            start : start,
            end : end,
        },
        {
            headers: {
                Authorization: "JWT " + localStorage.getItem("token"),
            },
        }
    )
    .then((res) => {
        console.log(res);
        console.log(res.data);
        handleOpen();
        setTitle("");
        setDesc("");
        setStart("");
        setEnd("");
    })
    .catch((err) => {
        if (
            err.response.status === 401 ||
            err.response.status === 404
        ) {
            alert.show("Your session has expired. Please Log In again to answer this question");
        } else {
            console.log(err.response);
            console.log(err.response.data.res);
            alert.show(err.response.data.res);
        }
    });
    }

    useEffect(() => {
        axios
            .get(
                `http://localhost:8000/server/usereventlist/${props.id}/`,
                {
                  headers: {
                      Authorization: `JWT ${localStorage.getItem("token")}`,
                  },
                }  
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
      <React.Fragment>
        <CssBaseline/>
        
      <Container maxWidth="false" className={classes.container}>
        <Button onClick={handleOpen}>
          Add Event
        </Button>
        <Dialog open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className={classes.root}
            >
        <DialogTitle id="alert-dialog-title">Add Event</DialogTitle>
        <DialogContent>
          
          <TextField
              style = {{width: "20ch"}}
              id="outlined-multiline-static"
              select
              variant="outlined"
              placeholder="Event Type"
              value={type}
              onChange={onTypeChange}
              helperText="Event"
              required >
               <MenuItem value="" disabled>
                  Type
              </MenuItem>
              <MenuItem value={"Lesson"}>Lesson</MenuItem>
              <MenuItem value={"Personal Event"}>
                  Personal Event
              </MenuItem>
           </TextField>
           <form className={classes.form} onSubmit={handleSubmitEvent}>
             {type == "Personal Event" &&
             <div>
               <div>
              <TextField
              style = {{width: "30ch"}}
              id="outlined-multiline-static"
              variant="outlined"
              placeholder="Title"
              value={title}
              onChange={onTitleChange}
              helperText="Title"
              required/>
              </div>
              <div>
              <TextField
              style = {{width: "30ch"}}
              id="outlined-multiline-static"
              variant="outlined"
              placeholder="Description"
              value={desc}
              onChange={onDescChange}
              helperText="Description"
              required/>
              </div>
              <div>
              <TextField
                id="datetime-local"
                helperText="Start Time"
                variant="outlined"
                type="datetime-local"
                value={start}
                onChange={onStartChange}
                defaultValue="2017-05-24T10:30"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              </div>
              <div>
              <TextField
                id="datetime-local"
                helperText="End Time"
                variant="outlined"
                type="datetime-local"
                value={end}
                onChange={onEndChange}
                defaultValue="2017-05-24T10:30"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              </div>
              </div>
              }
          </form>
          </DialogContent>
          <DialogActions>
            <Button type="submit" >
              Add
            </Button>
            <Button onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
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
        className={classes.calendar}
      />
      </Container>
      </React.Fragment>
    )
  }


