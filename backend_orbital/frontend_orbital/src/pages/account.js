import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@material-ui/core/Box";
import { NavMenu, NavItem } from "@mui-treasury/components/menu/navigation";
import { useLineNavigationMenuStyles } from "@mui-treasury/styles/navigationMenu/line";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Button, Grid } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/react";
import { useAlert } from "react-alert";
import CloseIcon from '@material-ui/icons/Close';
import Profile from '../images/profile.svg'
import {
    ListItem,
    List,
    Container,
    CssBaseline,
    CardContent,
    Typography,
    Dialog,
    Slide,
    AppBar,
    Toolbar
} from "@material-ui/core";
import { TextFields } from "@material-ui/icons";
import M from "minimatch";
import { Alert } from "@material-ui/lab";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  align-text: center;
`;

const useStyles = makeStyles((theme) => ({
    container: {
        display: "grid",
        height: "100%",
        backgroundColor:"#fffde7",
        overflow: "hidden",
        
    },
    icon: {
        height: "200px",
        width: "200px",
    },
    profile: {
        justifySelf: "start",
        display: "flex",
    },
    info: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        margin: "2rem",
    },
    form :  {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },

    information : {
            display: "flex",
            justifyContent:"space-between",
            alignItems: "center",
            margin: "15px",
            paddingBottom: "25px",
    },
    topimg: {
        marginTop: "100px",
        height: "50vh",
        flexShrink: 2,
        marginBottom: "0",
        display:"flex",
        width : "50%"
    },

    blobimg: {
        height: "50vh",
        marginBottom: "0",
        display:"flex",
        width : "50%"
    },
    appBar: {
        position: 'relative',
      },
    
      title: {
        marginLeft: theme.spacing(2),
        flex: 1,
      },
}));

const years = [
    1,2,3,4
]

function Account(props) {
    const classes = useStyles();
    const [data, setData] = useState({});
    const [member, setMember] = useState({});
    const [username, setUsername] = useState(props.username);
    const [faculty, setFaculty] = useState("");
    const [major, setMajor] = useState("");
    const [year, setYear] = useState("");
    const [majors, setMajors] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    console.log("IS STAFF " + props.isStaff);  
    console.log(member.yearOfStudy + ""); 

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        getFacs();
        getMajors();
        getMember();

    }, []);

    const getMember = () => {
        axios
        .get(`http://studymate.pythonanywhere.com/server/viewuser/${props.id}/`,
        {
            headers: {
                Authorization:
                    "JWT " + localStorage.getItem("token"),
            },
        })
        .then((res) => {
            setYear(res.data.yearOfStudy);
            setFaculty(res.data.facultyID);
            setMajor(res.data.majorID)
            setLoading(false);
        })
        .catch((error) => console.log(error));
};

    const getFacs = () => {
        axios
        .get(`http://studymate.pythonanywhere.com/server/facultylist/`)
        .then((res) => {
            setFaculties(res.data);
            setLoading(false);
        })
        .catch((error) => console.log(error));
}

    const getMajors = () => {
        axios
        .get("http://studymate.pythonanywhere.com/server/majorlist/")
        .then((res) => {
            setMajors(res.data);
            setLoading(false);
        })
        .catch((error) => console.log(error));
    }

    const handleEditProfile = e => {
        e.preventDefault();
    axios
        .post('http://studymate.pythonanywhere.com/server/editprofile/',
        {
            userID : props.id,
            year : year,
            facultyID : faculty,
            majorID : major,
        },
            {
                headers: {
                    Authorization: "JWT " + localStorage.getItem("token"),
                },
            }
            )
            .then(
                res => {
                    if(res.status === 200) {
                        handleClose();
                    }
                    getMember();
                })
            .catch(err => console.log(err));
        };


    return (
        <React.Fragment>
        <CssBaseline />
        <main style={{backgroundColor:"#fffde7"}}>
            <Container maxWidth="false" className={classes.container}>
                <CardContent className={classes.profile}>
                    <AccountCircleIcon className={classes.icon} />
                    <CardContent className={classes.info}>
                        <Typography variant="h4" style={{color:"#251312"}}>
                            {props.username}
                        </Typography>
                        <Typography variant="h4" style={{color:"#251312"}}>
                            {"Status: " +
                                (props.isStaff ? "Staff" : "Member")}
                        </Typography>
                    </CardContent>
                </CardContent>
                <Box spacing={2} className={classes.information}>
                    <div>
                            <div>
                            <TextField
                                variant="outlined"
                                required
                                style={{ maxWidth: 300 }}
                                fullWidth
                                id="standard-read-only-input"
                                helperText="Username"
                                autoComplete="username"
                                value={props.username}
                                InputProps={{
                                    readOnly: true,
                                  }}
                                disabled
                            />
                            </div>                      
                            <div>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="standard-read-only-input"
                                helperText="Year of Study"
                                value={year}
                                InputProps={{
                                    readOnly: true,
                                  }}
                                disabled
                            />
                            </div>                      
                            <div>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="standard-read-only-input"
                                helperText="Major"
                                value={major}
                                InputProps={{
                                    readOnly: true,
                                  }}
                                disabled
                            />
                            </div>                      
                            <div>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="standard-read-only-input"
                                helperText="Faculty"
                                value={faculty}
                                InputProps={{
                                    readOnly: true,
                                  }}
                                disabled
                            />
                            </div>
                            <Button variant="contained" style={{backgroundColor:"#2E1114", color:"#fff"}} onClick={handleOpen}>
                                Edit
                            </Button>
                            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} style={{padding:"0px"}}>
                            <AppBar className={classes.appBar}>
                                <Toolbar>
                                    <Button edge="start" color="inherit" onClick={handleClose} aria-label="close" startIcon={
                                    <CloseIcon />}/>
                                    <Typography variant="h6" className={classes.title}>
                                        Edit Profile
                                    </Typography>
                                    <Button  color="inherit" onClick={handleEditProfile}>
                                        Save
                                    </Button>
                                    
                                </Toolbar>
                            </AppBar>
                                    <List>
                                    <ListItem>
                                    <form className="post pb-4" className={classes.form}>
                                        <div>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="standard-read-only-input"
                                            label = "Username"
                                            autoComplete="username"
                                            value={props.username}
                                            InputProps={{
                                                readOnly: true,
                                                }}
                                            disabled
                                        />
                                        </div>
                                        <div>
                                            <TextField
                                                variant="outlined"
                                                required
                                                fullWidth
                                                select
                                                id="year"
                                                label="Year of Study"
                                                name="year"
                                                autoComplete="year"
                                                value={year}
                                                onChange = {(e) =>
                                                setYear(e.target.value)}
                                            >
                                                {years.map((option) => (
                                                    <MenuItem value={option}>
                                                    Year {option}
                                                </MenuItem>
                                                ))}
                                            </TextField>
                                        </div>
                                        <div>
                                        <TextField
                                                variant="outlined"
                                                required
                                                fullWidth
                                                select
                                                id="major"
                                                label="Major"
                                                name="major"
                                                autoComplete="major"
                                                value={major}
                                                onChange = {(e) =>
                                                setMajor(e.target.value)}
                                            >
                                                {majors.map((option) => (
                                                    <MenuItem value={option.majorID}>
                                                    {option.majorName}
                                                </MenuItem>
                                                ))}
                                            </TextField>
                                        </div>
                                        <div>
                                            {faculties.length != 0 &&
                                        <TextField
                                                variant="outlined"
                                                required
                                                fullWidth
                                                select
                                                id="faculty"
                                                label="Faculty"
                                                name="faculty"
                                                autoComplete="faculty"
                                                value={faculty}
                                                onChange = {(e) =>
                                                setFaculty(e.target.value)}
                                            >
                                                {faculties.map((option) => (
                                                    <MenuItem value={option.facultyID}>
                                                    {option.facultyName}
                                                </MenuItem>
                                                ))}
                                            </TextField>}
                                        </div>
                                        <div>
                                        </div>
                                        </form>
                                    </ListItem>
                                    </List>
                            </Dialog>
                    </div>
                    <img
                        src={Profile}
                        alt="Profile"
                        className={classes.topimg}
                    />
                </Box>    
            </Container>
        </main>
        </React.Fragment>
    );
}

export default Account
