import React, { useState } from "react";
import { useMemo } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  
const useStyles = makeStyles((theme) => ({
    paper: {
        paddingTop: theme.spacing(17),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp(props) {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("e1234567@u.nus.edu");
    const [password, setPassword] = useState("");
    const isValidEmail = React.useMemo(() =>
    /e\S+@u.nus.edu/.test(email),
    [email]
    )
    const handleUsername = (e) => {
        setUsername(e.target.value);
    };
    const handlePassword = (e) => {
        setPassword(e.target.value);
    };
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register Now!
                </Typography>
                <form
                    className={classes.form}
                    noValidate
                    onSubmit={(e) =>
                        props.handleRegister(e, {
                            username: username,
                            email : email,
                            password: password,
                        })
                    }
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                value={username}
                                onChange={handleUsername}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error = {isValidEmail ? false : true}
                                variant="outlined"
                                validationState={isValidEmail ? 'valid' : 'invalid'}
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                placeholder="e1234567@u.nus.edu"
                                autoComplete="email"
                                value={email}
                                helperText={isValidEmail? "" : "Please sign up with your NUS student email"}
                                onChange={handleEmail}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={handlePassword}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="center">
                        <Grid item>
                            <Link
                                to="/login"
                                style={{
                                    textDecoration: "none",
                                    color: "#2176ff",
                                }}
                            >
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}