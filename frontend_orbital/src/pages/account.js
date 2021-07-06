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


import {
    Container,
    CssBaseline,
    CardContent,
    Typography,
} from "@material-ui/core";
import { TextFields } from "@material-ui/icons";
import M from "minimatch";
import { Alert } from "@material-ui/lab";


const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  align-text: center;
`;

const useStyles = makeStyles((theme) => ({
    container: {
        display: "grid",
        paddingTop: "100px",
        height: "90vh",
        
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
            justifyContent:"center",
            alignItems: "center"
    }
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
    console.log("IS STAFF " + props.isStaff);  
    console.log(member.yearOfStudy + ""); 

    useEffect(() => {
        getFacs();
        getMajors();
        getMember();

    }, []);




    const getMember = () => {
        axios
        .get(`http://localhost:8000/server/viewuser/${props.id}/`,
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
        .get(`http://localhost:8000/server/facultylist/`)
        .then((res) => {
            setFaculties(res.data);
            setLoading(false);
        })
        .catch((error) => console.log(error));
}

    const getMajors = () => {
        axios
        .get("http://localhost:8000/server/majorlist/")
        .then((res) => {
            setMajors(res.data);
            setLoading(false);
        })
        .catch((error) => console.log(error));
    }

    const handleEditProfile = e => {
    axios
        .post('http://localhost:8000/server/editprofile/',
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
                    window.location.reload(false);
                })
            .catch(err => console.log(err));
        };


    return (
        <React.Fragment>
        <CssBaseline />
        <main>
            <Container maxWidth="md" className={classes.container}>
                <CardContent className={classes.profile}>
                    <AccountCircleIcon className={classes.icon} />
                    <CardContent className={classes.info}>
                        <Typography variant="h4">
                            {props.username}
                        </Typography>
                        <Typography variant="h4">
                            {"Status: " +
                                (props.isStaff ? "Staff" : "Member")}
                        </Typography>
                    </CardContent>
                </CardContent>

                <Box spacing={2} className={classes.information}>
                    <div>
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
                                <Button onClick={handleEditProfile} variant="contained">
                                    Save
                                </Button>
                            </div>
                        </form>
                    </div>
                </Box>    
            </Container>
        </main>
        </React.Fragment>
    );
}

export default Account
