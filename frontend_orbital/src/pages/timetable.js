import React, { useState, useEffect, Component} from 'react';
import { useAlert } from 'react-alert';
import FullCalendar, { constrainPoint } from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from 'axios';
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, CssBaseline, Typography, Grid } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { TextFields } from '@material-ui/icons';
import { FadeLoader } from 'react-spinners';
import CloseIcon from '@material-ui/icons/Close';
import { AppBar } from '@material-ui/core';
import { Toolbar, Divider } from '@material-ui/core';
import { Slide } from '@material-ui/core';
import { css } from "@emotion/react";
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import { set } from 'react-hook-form';


const override = css`
  display: flex;
  margin: 0 auto;
  border-color: red;
  align-text: center;
`;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const useStyles = makeStyles((theme) => ({
  mainContainer : {
    display: "flex",
    justifyContent:'center',
    flexDirection:'row',
  },
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
  },

  dialogTitle : {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },

  calendar: {
    padding:"20px",
    display:"flex",
    height:"auto",
  },

  appBar: {
    position: 'relative',
  },

  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

export default function Timetable(props) {
    const [id, setID] = useState(props.id);
    const classes = useStyles();
    const [events, setEvents] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [schedLessons, setSchedLessons] = useState([]);
    const [event, setEvent] = useState({});
    const [eventDetail, setEventDetail] = useState({});
    const alert = useAlert();
    const [open, setOpen] = useState(false);
    const [detail, setDetail] = useState(false);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [titleEdit, setTitleEdit] = useState("");
    const [descEdit, setDescEdit] = useState("");
    const [startEdit, setStartEdit] = useState("");
    const [endEdit, setEndEdit] = useState("");
    const [eventID, setEventID] = useState("");
    const [lessonDetail, setLessonDetail] = useState("");
    const [modules, setModules] = useState([]);
    const [lessonID, setLessonID] = useState("");
    const [moduleID, setModuleID] = useState("");
    const [editEventOpen, setEditEventOpen] = useState(false);
    const [deleteOpen, setDelete] = useState(false);

  const getModules = () => {
      axios
      .get("http://localhost:8000/server/modulelist/")
      .then((res) => {
          setModules(res.data);
          setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const handleDeleteOpen = () => {
    setDelete(true);
  };

  const handleDeleteClose = () => {
    setDelete(false);
  };

  const handleOpen= () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setType("")
  };

  const handleEditEventOpen = () => {
    setEditEventOpen(true);
    setTitleEdit(event.title);
    const s = event.startStr;
    const startReal = s.split("+")[0];
    setStartEdit(startReal);
    const d = event.endStr;
    const endReal = d.split("+")[0];
    setEndEdit(endReal);
    setDescEdit(eventDetail.description)
  }

  const handleEditEventClose = () => {
    setEditEventOpen(false);
    setTitleEdit("");
    setStartEdit("");
    setEndEdit("");
    setDescEdit("");
  }

  const handleDetailOpen= (arg) => {
    setDetail(true);
    setEvent(arg.event);
    setEventDetail(arg.event.extendedProps);
    setEventID(arg.event.extendedProps.eventID);
    console.log(arg.event.extendedProps)
  };

  const handleDetailClose = () => {
    setDetail(false);
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

  const onTitleEditChange = (e) => {
    e.preventDefault();
    setTitleEdit(e.target.value);
  };

  const onDescEditChange = (e) => {
    e.preventDefault();
    setDescEdit(e.target.value)
  }
  
  const onStartEditChange = (e) => {
    e.preventDefault();
    setStartEdit(e.target.value);
  };
  
  const onEndEditChange = (e) => {
    e.preventDefault();
    setEndEdit(e.target.value);
  };

  const onLessonIDChange = (e) => {
    e.preventDefault();
    setLessonID(e.target.value);
  };

  const getModuleLesson = (moduleid) => {
    axios
      .get(
      `http://localhost:8000/server/getmodulelessons/${moduleid}`,
      {
          headers: {
              Authorization: "JWT " + localStorage.getItem("token"),
          },
      }
  )
  .then((res) => {
      console.log(res);
      console.log(res.data);
      setLessons(res.data);
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
  


  const handleSubmitEvent = (e) => {
    e.preventDefault();
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
      setType("");
      setTitle("");
      setDesc("");
      setStart("");
      setEnd("");
      getEvents();
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
  
  const handleEditEvent = (e) => {
    e.preventDefault();
    axios
      .post(
      `http://localhost:8000/server/editevent/`,
      {
          userID : props.id,
          title : titleEdit,
          description : descEdit,
          start : startEdit,
          end : endEdit,
          eventID : eventID,
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
      console.log(res.status)
      setTitleEdit("");
      setDescEdit("");
      setStartEdit("");
      setEndEdit("");
      getEvents();
      if (res.status == 200) {
        handleEditEventClose();
      }
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

  const handleDeleteEvent = (e, eventid) => {
    e.preventDefault();
    axios
    .delete(`http://localhost:8000/server/deleteevent/${eventid}/${props.id}/`,
    {
        headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
        },
    })//delete post
    .then(res => {
        console.log(res);
        getEvents();  
        if (res.status == 200) {
          handleDetailClose();
        }
    })
    .catch(err => {
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
  };

const getScheduleLessons = () => {
    axios.get(`http://localhost:8000/server/userclasslist/${props.id}/`,
    {
      headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
  .then(res =>{
    console.log(res.data);
    setSchedLessons(res.data);
    setLoading(false);
  })
  .catch((err) => {
    if (
      err.status === 401 
  ) {
      alert.show("Your session has expired. Please Log In again to answer this question");
  } else if (err.status === 404) {
    alert.show("Sorry, we have trouble in retrieveing your timetable");
  }
    else {
    console.log(err)
  }
})
}

const getEvents = () => {
  axios.all([
    axios.get(`http://localhost:8000/server/usereventlist/${props.id}/`,
    {
      headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    }),
    axios.get(`http://localhost:8000/server/userclasslist/${props.id}/`,
    {
      headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
  ])
  .then(resArr =>{
    const data = [];
    resArr.map(res=> data.push(...res.data));
    console.log(data);
    setEvents(data);
    setLoading(false);
  })
  .catch((err) => {
    if (err.response.status ===  401 || err.response.status === 404) {
      alert.show("Your session has expired. Please login again to see your schedule")
    } else {
      console.log(err);
    }
  })
}
  
  const handleSubmitScheduleLesson = (e) => {
    e.preventDefault();
    axios
      .post(
      `http://localhost:8000/server/createschedulelesson/`,
      {
          userID : props.id,
          lessonID : lessonID,
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
      handleClose();
      setModuleID("");
      setLessonID("");
      getEvents();
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
  getModules();
  axios.all([
    axios.get(`http://localhost:8000/server/usereventlist/${props.id}/`,
    {
      headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    }),
    axios.get(`http://localhost:8000/server/userclasslist/${props.id}/`,
    {
      headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
  ])
  .then(resArr =>{
    const data = [];
    resArr.map(res=> data.push(...res.data));
    console.log(data);
    setEvents(data);
    setLoading(false);
  })
  .catch((err) => {
    if (
      err.status === 401 
  ) {
      alert.show("Your session has expired. Please Log In again to answer this question");
  } else if (err.status === 404) {
    alert.show("Sorry, we have trouble in retrieveing your timetable");
  }
    else {
    console.log(err)
  }
})
}, []);

  const handleDeleteSchedLesson = (e, lessonid) => {
    e.preventDefault();
    axios
    .delete(`http://localhost:8000/server/deleteschedulelesson/${lessonid}/${props.id}/`,
    {
        headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
        },
    })//delete post
    .then(res => {
        console.log(res);
        getEvents();  
        if (res.status == 200) {
          handleDeleteClose();
        }
    })
    .catch(err => {
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
  };



    return (
      <React.Fragment>
        <CssBaseline/>
        <Container maxWidth="false" className={classes.mainContainer}>
      <Container maxWidth="false" className={classes.container}>
        <Button onClick={handleOpen}>
          Add Event
        </Button>
        <h1>{events.slice(1).eventID}</h1>
        <Dialog open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className={classes.root}
            style={{padding:'15px'}}
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
                
                  {type == "Lesson" &&
                  <form className={classes.form} onSubmit={handleSubmitScheduleLesson}>
                    <div>
                      <div>
                      <Autocomplete
                        id="controllable-states-demo"
                        options={modules}
                        onChange = {(event,newValue) => {
                            setModuleID(newValue.moduleCode);
                            getModuleLesson(newValue.moduleCode);
                        }}
                        placeholder="Module"
                        getOptionLabel={option => option.moduleCode}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Module" variant="outlined" />}
                    />
                    </div>
                    <div>
                    <Autocomplete
                      id="controllable-states-demo"
                      options={lessons}
                      onChange = {(event,newValue) => {
                        console.log(newValue)
                        setLessonID(newValue.lessonID);
                      }}
                      onInputChange={(event, newInputValue) => {
                        setLessonDetail(newInputValue);
                      }}
                      getOptionLabel={option => (option.lessonType + " " + option.classNo + " " + option.day + "," + (option.startTime).slice(0,5) + 
                      "-" + (option.endTime).slice(0,5))}
                      style={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Class" variant="outlined" />}
                  />
                    </div>
                  </div>
                  <DialogActions>
                  <Button type="submit" disabled={((type == "Lesson" ? (moduleID == "" && lessonID == "") :
                  (title == "" 
                  || (start == "" || (desc == "" || end == ""))))) ? true : false}>
                    Add
                  </Button>
                  <Button onClick={handleClose}>
                    Close
                  </Button>
              </DialogActions>
                  </form>
                  }
                    {type == "Personal Event" &&
                    <form className={classes.form} onSubmit={handleSubmitEvent}>
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
                      defaultValue="2017-05-24T10:30:00"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
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
                      defaultValue="2017-05-24T10:30:00"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                    />
                    </div>
                  </div>
                  <DialogActions>
                  <Button type="submit" disabled={((type == "Lesson" ? (moduleID == "" && lessonID == "") :
                  (title == "" 
                  || (start == "" || (desc == "" || end == ""))))) ? true : false}>
                    Add
                  </Button>
                  <Button onClick={handleClose}>
                    Close
                  </Button>
              </DialogActions>
                  </form>
                  }
          </DialogContent>
        </Dialog>
        <main>    
          {loading ? (
              <div className={classes.loading}>
                  <FadeLoader
                      loading={loading}
                      color="#a1887f"
                      css={override}
                      size={150}
                  />
              </div>
              ) : (
                <div>
        <FullCalendar
        default= 'standard'
        plugins={[ dayGridPlugin, 
          timeGridPlugin ,interactionPlugin, 
          listPlugin ]}
        initialView="dayGridMonth"
        dayMaxEventRows={true}
        views={{
          dayGridMonth: {
            dayMaxEventRows: 4
          },
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        eventClick={(arg) => handleDetailOpen(arg)}
        events= {events}
      />
      <Dialog fullScreen open={detail} onClose={handleDetailClose} TransitionComponent={Transition} style={{padding:"0px"}}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Button edge="start" color="inherit" onClick={handleDetailClose} aria-label="close" startIcon={
              <CloseIcon />}/>
            <Typography variant="h6" className={classes.title}>
              {event.title}
            </Typography>
            {!(eventDetail.description == "Tutorial" ||
            eventDetail.description == "Recitation" || eventDetail.description == "Lecture" ||
            eventDetail.description == "Laboratory") && (
            <Button autoFocus color="inherit" onClick={() => {handleEditEventOpen();handleDetailClose()}}>
              Edit
            </Button>)
            }
            <Button  color="inherit" onClick={handleDeleteOpen}>
              Delete
            </Button>
            <Dialog
              open={deleteOpen}
              onClose={handleDeleteClose}
              className={classes.root}
              aria-labelledby="simple-dialog-title"
              aria-describedby="simple-dialog-description"
              >
                  <DialogContent className={classes.paper}>
                      <DialogContentText>
                          <h4 id="simple-dialog-title">Delete Event</h4>
                          <div className="modal-body text-left pt-3 pb-3">
                              Are you sure you want to delete this event? 
                          </div>
                          <div className="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                  <Button variant = "outlined" className="btn btn-default col-sm-5 btn-outline-danger mr-2"
                                    style = {{margin:5}} onClick={(eventDetail.description == "Tutorial" ||
                                    eventDetail.description == "Recitation" || eventDetail.description == "Lecture" ||
                                    eventDetail.description == "Laboratory") ?
                                      ((e) => handleDeleteSchedLesson(e, eventDetail.lessonID)) : (
                                        (e) => handleDeleteEvent(e,eventID)
                                      )}>
                                      Delete
                                  </Button>
                                  <Button variant = "outlined" style = {{margin:5}} className="btn btn-default col-sm-5 btn-outline-secondary" 
                                  onClick={handleDeleteClose}>
                                      Cancel
                                  </Button>
                          </div>
                      </DialogContentText>
                  </DialogContent>
              </Dialog> 
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
              <ListItemText secondary={
                <Typography varian="subtitle1">
                  {event.startStr ? (<Typography variant="body2">
                                {(event.startStr).split("T")[0]}  &middot; 
                                {((event.startStr).split("T")[1]).slice(0,5)} 
                            </Typography>) : (
                    ""
                  )}
              </Typography>}
              primary="Start Time"
              />
          </ListItem>
          <Divider />
          <ListItem>
              <ListItemText secondary={
                <Typography varian="subtitle1">
                  {event.endStr ? (<Typography variant="body2">
                                {(event.endStr).split("T")[0]}  &middot; 
                                {((event.endStr).split("T")[1]).slice(0,5)} 
                            </Typography>) : (
                    ""
                  )}
              </Typography>}
              primary="End Time"
              />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary={eventDetail.description}/>
          </ListItem>
          <Divider />
        </List>
      </Dialog>
     
     <Dialog className={classes.root}
     open={editEventOpen}
     onClose={handleEditEventClose}>
       <DialogContent>
      <form className="post pb-4" className={classes.form}>
        <div className="form-row align-items-left mb-3 ml-3">
            <div>

            <TextField
                style = {{width: "60ch"}}
                id="outlined-multiline-static"
                defaultValue="Default Value"
                variant="outlined"
                
                helperText="Title"
                value={titleEdit}
                onChange={onTitleEditChange}
                disabled={!props.username}
                required />
            </div>
            <div>
            <TextField
                style = {{width: "60ch"}}
                id="outlined-multiline-static"
                defaultValue="Default Value"
                variant="outlined"
                placeholder="Description"
                helperText="Description"
                multiline
                rows={2}
                value={descEdit}
                onChange={onDescEditChange}
                disabled={!props.username}
                required />
            </div>
            <div>
              <TextField
                disabled={!props.username}
                id="datetime-local"
                helperText="Start Time"
                defaultValue={event.start}
                variant="outlined"
                type="datetime-local"
                value={startEdit}
                onChange={onStartEditChange}
                defaultValue={startEdit}
                InputLabelProps={{
                  shrink: true,
                }}
                required
                />
              </div>
              <div>
              <TextField
                id="datetime-local"
                helperText="End Time"
                variant="outlined"
                type="datetime-local"
                value={endEdit}
                onChange={onEndEditChange}
                defaultValue={endEdit}
                InputLabelProps={{
                  shrink: true,
                }}
                required
                disabled={!props.username}
              />
              </div>
        </div>
        <DialogActions>
            <div className="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                <Button variant = "outlined" 
                className="btn btn-default col-sm-5 btn-outline-danger mr-2" style = {{margin:5}}
                onClick={handleEditEvent}>
                    Save
                </Button>
                <Button variant = "outlined" style = {{margin:5}} className="btn btn-default col-sm-5 btn-outline-secondary"
                onClick={handleEditEventClose}>
                    Cancel
                </Button>
            </div>
            </DialogActions>
            </form>
            </DialogContent>
      </Dialog>
      </div>
      )}
      </main>
      </Container >
      </Container>
      </React.Fragment>
    )
  }

