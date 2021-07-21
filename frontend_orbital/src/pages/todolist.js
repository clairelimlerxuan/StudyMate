import React , {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Navbar from '../components/navbar';
import TodayTwoToneIcon from '@material-ui/icons/TodayTwoTone';
import HistoryIcon from '@material-ui/icons/History';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import AssignmentIcon from '@material-ui/icons/Assignment';
import axios from 'axios';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
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
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Todolist(props) {
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);
  const [recentTasks, setRecent] = useState([]);
  const [todayTask, setTodayTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [component, setComponent] = useState('all')

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
      if (err.response.status ===  401 || err.response.status === 404) {
        alert.show("Your session has expired. Please login again to see your schedule")
      } else {
        console.log(err);
      }
    });
}, []);

const handleChangeData = (newType) => {
    setComponent(newType);
    if (newType == component) {
        return;
    }

    if (newType == "all") {
        axios
            .get(
                `http://localhost:8000/server/usertasklist/${props.id}/`,
                {
                    headers: {
                        Authorization:
                            "JWT " + localStorage.getItem("token"),
                    },
                }
            )
            .then((res) => {
                console.log(res.data);
                setTasks(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                alert.show("Signature Has Expired, Please Login Again");
            });
    } else if (newType == "today") {
        axios
            .get(
                `http://localhost:8000/server/usercommentlist/${props.id}/`,
                {
                    headers: {
                        Authorization:
                            "JWT " + localStorage.getItem("token"),
                    },
                }
            )
            .then((res) => {
                console.log(res.data);
                setData(res.data);
                setComments(res.data);
                setLoading(false);
            })
            .catch((err) => {
                alert.show("Signature Has Expired, Please Login Again");
            });
    } else if (newType == 'Reply') {
        axios
        .get(
            `http://localhost:8000/server/userreplylist/${props.id}/`,
            {
                headers: {
                    Authorization:
                        "JWT " + localStorage.getItem("token"),
                },
            }
        )
        .then((res) => {
            console.log(res.data);
            setData(res.data);
            setReplies(res.data);
            setLoading(false);
        })
        .catch((err) => {
            alert.show("Signature Has Expired, Please Login Again");
        });
    }
};
     
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
          <ListItem button key="All">
                <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                <ListItemText primary="All" />
              </ListItem>
              <ListItem button key="Today">
                <ListItemIcon>{<TodayTwoToneIcon/>}</ListItemIcon>
                <ListItemText primary="Today" />
              </ListItem>
              <ListItem button key={"Recent"}>
                <ListItemIcon>{<HistoryIcon/>}</ListItemIcon>
                <ListItemText primary={"Recent"} />
              </ListItem>
            
          </List>
          <Divider />
          <List>
          <ListItem button key={"Complete"}>
                <ListItemIcon>{<DoneIcon/>}</ListItemIcon>
                <ListItemText primary={"Complete"} />
              </ListItem>
            
          <ListItem button key={"Incomplete"}>
                <ListItemIcon>{<ClearIcon/>}</ListItemIcon>
                <ListItemText primary={"Incomplete"} />
              </ListItem>
            
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
      </main>
    </div>
  );
}

