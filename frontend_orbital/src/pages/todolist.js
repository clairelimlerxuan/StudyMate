import React , {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MuiListItem from "@material-ui/core/ListItem";
import TodayTwoToneIcon from '@material-ui/icons/TodayTwoTone';
import HistoryIcon from '@material-ui/icons/History';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import MenuIcon  from '@material-ui/icons/Menu';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { DialogContent, DialogActions, DialogTitle} from '@material-ui/core';
import { Box, Tooltip,Button, Card, CardContent, CardActions, Fab, Dialog,TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import css from '@emotion/css';
import { withStyles } from '@material-ui/styles';
import { useAlert } from 'react-alert';
import { FadeLoader } from 'react-spinners';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { green } from '@material-ui/core/colors';
import { FlashOffRounded, SettingsBackupRestoreOutlined } from '@material-ui/icons';
const drawerWidth = 240;
const override = css`
  display: flex;
  margin: 0 auto;
  border-color: red;
  align-text: center;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width:"100%"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex:999,
  },
  drawerPaper: {
    maxWidth: drawerWidth,
    minWidth:"200px",
    paddingTop : "20px",
  },
  drawerContainer: {
    width:250,
  },
  content: {
    padding: theme.spacing(3),
    overflow: "hidden",
    flexDirection:"column",
  },

  tooltip : {
      float:"right",
      margin:"20px"
  },
  info : {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding:"10px",
    paddingBottom:"0px"
  },
  rootCard: {
    width: 600,
    flexDirection: "column",
    marginBottom:"20px",
    display:"flex",
    overflow:"hidden",
    justifyContent:"center"
    },

    topimg: {
    height: "30vh",
    width: "auto",
    marginBottom: "0",
},

    modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    },
}));

const ListItem = withStyles({
    root: {
      "&$selected": {
        backgroundColor:"#b71c1c",
        color: "#b71c1c",
        "& .MuiListItemIcon-root": {
          color: "#b71c1c"
        }
      },
      "&$selected:hover": {
        backgroundColor: "purple",
        color: "#b71c1c",
        "& .MuiListItemIcon-root": {
          color: "#b71c1c"
        }
      },
      "&:hover": {
        color: "#b71c1c",
        "& .MuiListItemIcon-root": {
          color: "#b71c1c"
        }
      }
    },
    selected: {}
  })(MuiListItem);

export default function Todolist(props) {
    const classes = useStyles();
    const [taskID, setTaskID] = useState("");
        const [tasks, setTasks] = useState([]);
    const [recentTasks, setRecent] = useState([]);
    const [todayTask, setTodayTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [incompleteTasks, setIncompleteTasks] = useState([]);
    const [title, setTitle] = useState("");    
    const [deadline, setDeadline] = useState("");
    const [completed, setCompleted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [component, setComponent] = useState('all');
    const alert = useAlert();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [checked, setChecked] = useState({checkedA : false, checkedA1: false, checkedB : false, checkedC : false,
    checkedD : false, checkedE : false});
    const [taskChecked, setTaskChecked] = useState(false);
    const [state, setState] = useState({
        left: false,
    });

    const [titleEdit, setTitleEdit] = useState("");
    const [deadlineEdit, setDeadlineEdit] = useState("");
    const [completedEdit, setCompletedEdit] = useState(false);
    const [submittedEdit, setSubmittedEdit] = useState(false);
    const [subOpen, setSubOpen] = useState(false);
    const[editOpen, setEditOpen] = useState(false);

    const handleSubOpen = () => {
        setSubOpen(true);
    };

    const handleSubClose = () => {
        setSubOpen(false);
    };

    const setSubmittedStatus =  (submitted) => {
        setSubmittedEdit(submitted);
    }

    const setCompletedStatus = (status) => {
        setCompletedEdit(status);
    }

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
    }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <div
          className={(classes.list)}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}>
            <List>
            <ListItem button key="All" onClick={(event) => {handleChangeData("all"); handleListItemClick(event, 0)}} 
            selected={selectedIndex === 0}>
                    <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                    <ListItemText primary="All" />
                </ListItem>
                <ListItem button key="Today" onClick={(event) => {handleChangeData("today"); handleListItemClick(event, 1)}}
                selected={selectedIndex === 1}>
                    <ListItemIcon>{<TodayTwoToneIcon/>}</ListItemIcon>
                    <ListItemText primary="Today" />
                </ListItem>
                <ListItem button key={"Recent"} onClick={(event) => {handleChangeData("recent"); handleListItemClick(event, 2)}}
                selected={selectedIndex === 2}>
                    <ListItemIcon>{<HistoryIcon/>}</ListItemIcon>
                    <ListItemText primary={"Recent"} />
                </ListItem>
                
            </List>
            <Divider />
            <List>
            <ListItem button key={"Complete"} onClick={(event) => {handleChangeData("completed"); handleListItemClick(event, 3)}}
            selected={selectedIndex === 3}>
                    <ListItemIcon>{<DoneIcon/>}</ListItemIcon>
                    <ListItemText 
                    primary={"Complete"} />
                </ListItem>
                
            <ListItem button key={"Incomplete"} onClick={(event) => {handleChangeData("incomplete"); handleListItemClick(event, 4)}}
            selected={selectedIndex === 4}>
                    <ListItemIcon>{<ClearIcon/>}</ListItemIcon>
                    <ListItemText primary={"Incomplete"} />
            </ListItem>
                
            </List>
        </div>
    )

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleChange = (event, index) => {
    console.log(event.target.checked)
    setChecked({ ...checked, [event.target.name]: event.target.checked});
  };

  const getTasks = () => {
    axios
    .get(
        `http://localhost:8000/server/usertasklist/${props.id}/`,
        {
          headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }  
    )
    .then((res) => {
        console.log(res.data);
        setTasks(res.data);
        setLoading(false);
    })
    .catch((err) => {
        if (
          err.response.status === 401 
      ) {
          alert.show("Your session has expired. Please Log In again to answer this question");
      } else if (err.response.status === 404) {
            alert.show("Sorry, we are unable to fetch your task right now")
      } else {
        console.log(err.response);
        console.log(err.response.data.res);
        alert.show(err.response.data.res);
      }
    }); }

  const getRecentTasks = () => {
    axios
    .get(
        `http://localhost:8000/server/userrecenttasklist/${props.id}/`,
        {
          headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }  
    )
    .then((res) => {
        console.log(res.data);
        setRecent(res.data);
        setLoading(false);
    })
    .catch((err) => {
        if (
          err.response.status === 401 
      ) {
          alert.show("Your session has expired. Please Log In again to answer this question");
      } else if (err.response.status === 404) {
            alert.show("Sorry, we are unable to fetch your task right now")
      } else {
        console.log(err.response);
        console.log(err.response.data.res);
        alert.show(err.response.data.res);
      }
    }); }

  const getCompletedTask = () => {
    axios
    .get(
        `http://localhost:8000/server/usercompletetasklist/${props.id}/`,
        {
            headers: {
                Authorization:
                    "JWT " + localStorage.getItem("token"),
            },
        }
    )
    .then((res) => {
        console.log(res.data);
        setCompletedTasks(res.data);
        setLoading(false);
    })
    .catch((err) => {
        if (
          err.response.status === 401 
      ) {
          alert.show("Your session has expired. Please Log In again to answer this question");
      } else if (err.response.status === 404) {
            alert.show("Sorry, we are unable to fetch your task right now")
      } else {
        console.log(err.response);
        console.log(err.response.data.res);
        alert.show(err.response.data.res);
      }
    }); }

  const getIncompleteTask = () => {
    axios
    .get(
        `http://localhost:8000/server/userincompletetasklist/${props.id}/`,
        {
            headers: {
                Authorization:
                    "JWT " + localStorage.getItem("token"),
            },
        }
    )
    .then((res) => {
        console.log(res.data);
        setIncompleteTasks(res.data);
        setLoading(false);
    })
    .catch((err) => {
        if (
          err.response.status === 401 
      ) {
          alert.show("Your session has expired. Please Log In again to answer this question");
      } else if (err.response.status === 404) {
            alert.show("Sorry, we are unable to fetch your task right now")
      } else {
        console.log(err.response);
        console.log(err.response.data.res);
        alert.show(err.response.data.res);
      }
    }); }

  const getTodayTasks = () => {
    axios
    .get(
        `http://localhost:8000/server/usertodaytasklist/${props.id}/`,
        {
            headers: {
                Authorization:
                    "JWT " + localStorage.getItem("token"),
            },
        }
    )
    .then((res) => {
        console.log(res.data);
        setTodayTasks(res.data);
        setLoading(false);
    })
    .catch((err) => {
        if (
          err.response.status === 401 
      ) {
          alert.show("Your session has expired. Please Log In again to answer this question");
      } else if (err.response.status === 404) {
            alert.show("Sorry, we are unable to fetch your task right now")
      } else {
        console.log(err.response);
        console.log(err.response.data.res);
        alert.show(err.response.data.res);
      }
    }); }

  useEffect(() => {
    axios
    .get(
        `http://localhost:8000/server/usertasklist/${props.id}/`,
        {
          headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }  
    )
    .then((res) => {
        console.log(res.data);
        setTasks(res.data);
        setLoading(false);
    })
    .catch((err) => {
        if (
          err.response.status === 401 
      ) {
          alert.show("Your session has expired. Please Log In again to answer this question");
      } else if (err.response.status === 404) {
            alert.show("Sorry, we are unable to fetch your task right now")
      } else {
        console.log(err.response);
        console.log(err.response.data.res);
        alert.show(err.response.data.res);
      }
    }); }, []);

const handleChangeData = (newType) => {
    setComponent(newType);
    if (newType == component) {
        return;
    }

    if (newType == "all") {
        getTasks();
    } else if (newType == "today") {
        getTodayTasks();
    } else if (newType == 'recent') {
        getRecentTasks();
    } else if (newType == "completed") {
        getCompletedTask();
    } else if (newType == "incomplete") {
        getIncompleteTask();
    };
    }
    const handleCompleteTask = (e, taskid, index) => {
        axios
      .post(
      `http://localhost:8000/server/completetask/`,
      {
          taskID : taskid,
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
      getTasks();
      getTodayTasks();
      getRecentTasks();
      getCompletedTask();
      getIncompleteTask();
  })
  .catch((err) => {
    if (
      err.response.status === 401 
  ) {
      alert.show("Your session has expired. Please Log In again to answer this question");
  } else if (err.response.status === 404) {
        alert.show("Sorry, we are unable to fetch your task right now")
  } else {
    console.log(err.response);
    console.log(err.response.data.res);
    alert.show(err.response.data.res);
  }
}); }

    const handleSubmitTask = (e) => {
        e.preventDefault();
        axios
      .post(
      `http://localhost:8000/server/createtask/`,
      {
          userID : props.id,
          title : title,
          deadline : deadline,
          completed : completed,
          submitted : submitted,
      },
      {
          headers: {
              Authorization: "JWT " + localStorage.getItem("token"),
          },
      }
  )
  .then((res) => {
      if (res.status === 200) {
          handleSubClose();
      }
      console.log(res);
      console.log(res.data);
      setTitle("");
      setDeadline("");
      setCompleted(false);
      setSubmitted(false);
  })
  .catch((err) => {
    if (
      err.response.status === 401 
  ) {
      alert.show("Your session has expired. Please Log In again to answer this question");
  } else if (err.response.status === 404) {
        alert.show("Sorry, we have trouble in retrieving your task right now")
  } else {
    console.log(err.response);
    console.log(err.response.data.res);
    alert.show(err.response.data.res);
  }
}); }
    
    const handleEditTask = (e) => {
        e.preventDefault();
        axios
      .post(
      `http://localhost:8000/server/edittask/`,
      {
          userID : props.id,
          taskID : taskID,
          title : titleEdit,
          deadline : deadlineEdit,
          completed : completedEdit,
          submitted : submittedEdit,
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
      setTitleEdit("");
      setDeadlineEdit("");
      setCompletedEdit(false);
      setSubmittedEdit(false);
      setTaskID("");
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

    const tickCompleted = () => {
        setCompleted(true);
    };

    const tickSubmitted = () => {
        setSubmitted(true);
    }

    const tickCompletedEdit = (event) => {
        setCompletedEdit(event.target.checked);
    };

    const tickSubmittedEdit = (event) => {
        setSubmittedEdit(event.target.checked);
    }
     
    const handleEditOpen = (task) => {
        setEditOpen(true);
        setTitleEdit(task.title);
        setDeadlineEdit(task.deadline);
        setCompletedEdit(task.completed);
        setSubmittedEdit(task.submitted);
        setTaskID(task.taskID);
    };

    const handleEditClose = () => {
        setEditOpen(false);
    };

    return (
        <div>
        <CssBaseline />
        <div className={classes.root}>
        {['left',].map((anchor) => (
            <React.Fragment key={anchor}>
                <Tooltip title="Menu" aria-label="add" onClick={toggleDrawer(anchor, true)} className={classes.tooltip}>
                    <Fab className={classes.fab} style={{backgroundColor:"#64485C"}}>
                        <MenuIcon/>
                    </Fab>
                </Tooltip>
                <h1 style={{padding:"10px"}}>All Tasks</h1>
                <Drawer  className={classes.drawer} classes={{
                paper: classes.drawerPaper,}} anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                    {list(anchor)}
                </Drawer>
            </React.Fragment>))}
        </div>
        <main className={classes.content}>
            <Tooltip title="Add Task" aria-label="add" className={classes.tooltip} onClick={handleSubOpen}>
            <Fab className={classes.fab} style={{backgroundColor:"#64485C"}}>
                <AddIcon/>
            </Fab>
            </Tooltip>
            <Dialog open={subOpen}
            onClose={handleSubClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className={classes.modal}
            >
            <DialogTitle id="alert-dialog-title">Add Task</DialogTitle>
                <DialogContent> 
                    <form className={classes.form} onSubmit={handleSubmitTask}>
                        <div>
                            <div>
                            <TextField
                                style = {{width: "40ch"}}
                                id="outlined-multiline-static"
                                variant="outlined"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                }}
                                helperText="Title"
                                required>
                                </TextField>
                            </div>
                            <div>
                                <TextField
                                    id="datetime-local"
                                    helperText="Deadline"
                                    variant="outlined"
                                    type="datetime-local"
                                    value={deadline}
                                    onChange={(e) => {
                                        setDeadline(e.target.value);
                                    }}
                                    defaultValue="2017-05-24T10:30"
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    required
                                />
                            </div>
                            <h1>{completed ? "completed" : "incomplete"}</h1>
                            <div>
                            <FormControlLabel
                            control={<Checkbox checked={checked.checkedB} onChange={(event) => {handleChange(event);tickCompleted()}}
                             name="checkedB" />}
                            label="Completed"
                        />
                            </div>
                            <div>
                            <FormControlLabel
                            control={<Checkbox checked={checked.checkedC} onChange={(event) => {handleChange(event);tickSubmitted()}}
                             name="checkedC" />}
                            label="Submitted"
                        />
                            </div>  
                        </div>
                        <DialogActions>
                        <Button type="submit" disabled={(title == "") 
                        || (deadline == "") ? true : false}>
                            Add
                        </Button>
                        <Button onClick={handleSubClose}>
                            Close
                        </Button>
                    </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            <Box
                display="flex"
                flexDirection='column'
                width = "100%"
                alignItems ="center"
                className = {classes.box}
                >
            {loading ? (
              <div className={classes.loading}>
                  <FadeLoader
                      loading={loading}
                      color="#a1887f"
                      css={override}
                      size={150}
                  />
              </div> ) : (
                  <div>
                {component == "all" && 
                <>
                {tasks.length != 0 && component == "all" ? (tasks.map((task,index) =>
                <Card className={classes.rootCard}>
                    <CardContent className={classes.info} style={{paddingBottom:"10px"}}>
                        <div>
                            <Typography variant="body2" align="left" color="textSecondary">
                                {task.title}
                            </Typography>
                        </div>
                        <div style={{flexDirection:"row"}}>         
                        <CardActions>
                            <FormControlLabel
                            control={<Checkbox checked={task.completed} onChange={(event,index) => {handleChange(event,index);handleCompleteTask(event,task.taskID,index)}}
                             name="checkedA" />}
                            label="Complete"
                        />
                            <Button startIcon={<EditIcon/>} onClick={() => handleEditOpen(task)}/>
                            <Dialog open={editOpen}
                                onClose={handleEditClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                className={classes.modal}
                                >
                                <DialogTitle id="alert-dialog-title">Edit Task</DialogTitle>
                                    <DialogContent> 
                                        <form className={classes.form} onSubmit={handleEditTask}>
                                            <div>
                                                <div>
                                                <TextField
                                                    style = {{width: "40ch"}}
                                                    id="outlined-multiline-static"
                                                    variant="outlined"
                                                    placeholder="Title"
                                                    value={titleEdit}
                                                    onChange={(e) => {
                                                        setTitleEdit(e.target.value);
                                                    }}
                                                    helperText="Title"
                                                    required>
                                                    </TextField>
                                                </div>
                                                <div>
                                                    <TextField
                                                        id="datetime-local"
                                                        helperText="Deadline"
                                                        variant="outlined"
                                                        type="datetime-local"
                                                        value={deadlineEdit}
                                                        onChange={(e) => {
                                                            setDeadlineEdit(e.target.value);
                                                        }}
                                                        defaultValue="2017-05-24T10:30"
                                                        InputLabelProps={{
                                                        shrink: true,
                                                        }}
                                                        required
                                                    />
                                                </div>
                                                <h1>{completed ? "completed" : "incomplete"}</h1>
                                                <div>
                                                <FormControlLabel
                                                control={<Checkbox checked={completedEdit} 
                                                onChange={(event) => {handleChange(event); tickCompletedEdit(event)}}
                                                name="checkedD" />}
                                                label="Completed"
                                            />
                                                </div>
                                                <div>
                                                <FormControlLabel
                                                control={<Checkbox checked={submittedEdit} 
                                                onChange={(event) => {handleChange(event);tickSubmittedEdit(event)}}
                                                name="checkedE" />}
                                                label="Submitted"
                                            />
                                                </div>  
                                            </div>
                                            <DialogActions>
                                            <Button type="submit" disabled={(titleEdit == "") 
                                            || (deadlineEdit == "") ? true : false}>
                                                Add
                                            </Button>
                                            <Button onClick={handleEditClose}>
                                                Close
                                            </Button>
                                        </DialogActions>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                        </CardActions>
                        </div>
                        
                    </CardContent>
                </Card>)
                ) : (
                    <>
                    {tasks.length == 0 &&
                        <Typography variant="h3">
                            No Tasks Made
                        </Typography>
                        }
                    </>
                )}
                </>}
                {component == "today" &&
                <>
                    {todayTask.length != 0 ? ( todayTask.map((task) =>
                    <Card className={classes.rootCard}>
                        <CardContent className={classes.info}>
                            <div>
                                <Typography variant="body2" align="left" color="textSecondary">
                                    {task.title}
                                </Typography>
                            </div>
                            <div style={{flexDirection:"row"}}>         
                                <CardActions>
                                    <FormControlLabel
                                    control={<Checkbox checked={task.completed}
                                     onChange={(event,index) => {handleChange(event,index);handleCompleteTask(event,task.taskID,index)}}/>}
                                    label="Complete"/>
                                    <Button startIcon={<EditIcon/>}>
                                    </Button>
                                </CardActions>
                            </div>
                        </CardContent>
                    </Card>)
                    ) : (
                        <>
                        {todayTask.length == 0 &&
                            <div className="card-body mr-4">
                                <img                         
                                src='/images/nodata.svg'
                                alt="No Task"
                                className={classes.topimg}
                                />
                                <Typography variant="h5">
                                    No Task for You for Today
                                </Typography>
                            </div>
                            }
                        </>
                    )}
                </>}
                {component == "recent" &&
                <>
                    {recentTasks.length != 0 ? (recentTasks.map((task) =>
                    <Card className={classes.rootCard}>
                        <CardContent className={classes.info}>
                            <div>
                                <Typography variant="body2" align="left" color="textSecondary">
                                    {task.title}
                                </Typography>
                            </div>
                            <div style={{flexDirection:"row"}}>         
                                <CardActions>
                                    <FormControlLabel
                                    control={<Checkbox  checked={task.completed}
                                    onChange={(event,index) => 
                                        {handleChange(event,index);handleCompleteTask(event,task.taskID,index)}} name="checkedA1" />}
                                    label="Complete"/>
                                    <Button startIcon={<EditIcon/>}>

                                    </Button>
                                </CardActions>
                            </div>
                        </CardContent>
                    </Card>)
                    ) : (
                        <>
                        {recentTasks.length == 0 &&
                            <div className="card-body mr-4">
                                <img                         
                                src='/images/nodata.svg'
                                alt="No Task"
                                className={classes.topimg}
                                />
                                <Typography variant="h5">
                                    No Recent Tasks
                                </Typography>
                            </div>
                            }
                        </>
                    )}
                </>}
                {component == "completed" &&
                <>
                    {completedTasks.length != 0 ? (completedTasks.map((task) =>
                    <Card className={classes.rootCard}>
                        <CardContent className={classes.info}>
                            <div>
                                <Typography variant="body2" align="left" color="textSecondary">
                                    {task.title}
                                </Typography>
                            </div>
                            <div style={{flexDirection:"row"}}>         
                                <CardActions>
                                <FormControlLabel
                                    control={<Checkbox checked={task.completed} onChange={(event) => {handleChange(event);handleCompleteTask(event,task.taskID)}}
                                    name="checkedA" />}
                                    label="Complete"
                                />
                                    <Button startIcon={<EditIcon/>}>

                                    </Button>
                                </CardActions>
                            </div>
                        </CardContent>
                    </Card>)
                    ) : (
                        <>
                        {completedTasks.length == 0 &&
                            <div className="card-body mr-4">
                                <img                         
                                src='/images/nodata.svg'
                                alt="No Task"
                                className={classes.topimg}
                                />
                                <Typography variant="h5">
                                    No Completed Tasks
                                </Typography>
                            </div>
                            }
                        </>
                    )}
                </>}
                {component == "incomplete" &&
                <>
                {incompleteTasks.length != 0 ? (incompleteTasks.map((task) =>
                    <Card className={classes.rootCard}>
                        <CardContent className={classes.info}>
                            <div>
                                <Typography variant="body2" align="left" color="textSecondary">
                                    {task.title}
                                </Typography>
                            </div>
                            <div style={{flexDirection:"row"}}>         
                                <CardActions>
                                <FormControlLabel
                                    control={<Checkbox checked={task.completed} onChange={(event) => {handleChange(event);handleCompleteTask(event,task.taskID)}}
                                    name="checkedA" />}
                                    label="Complete"
                                />
                                    <Button startIcon={<EditIcon/>}>

                                    </Button>
                                </CardActions>
                            </div>
                        </CardContent>
                    </Card>)
                    ) : (
                        <>
                        {incompleteTasks.length == 0 &&
                            <div className="card-body mr-4">
                                <img                         
                                src='/images/nodata.svg'
                                alt="No Task"
                                className={classes.topimg}
                                />
                                <Typography variant="h5">
                                    No Incomplete Tasks
                                </Typography>
                            </div>
                            }
                        </>
                    )}
                </>}
                </div>)}
            </Box>
        </main>
        </div>
    );
}

