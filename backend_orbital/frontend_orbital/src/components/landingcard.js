import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Button, Box } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    top: {
        display: "flex",
        maxHeight: "100vh",
        marginTop:"50px",
        padding: "0 80px",
    },
    right: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    left: {
        textAlign: "left",
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
    topimg: {
        width: "100%",
    },
}));


export default function Landingcard(props) {
    const classes = useStyles();

    return (
        <>
        <li style={{listStyle:"none"}}>
        <Container maxWidth="lg" className={classes.top}>
            <Grid container xs={6} className={classes.left} alignItems="center">
                <Box pr={10}>
                    <Box mb={2} mt={-9}>
                        <Typography variant="h4" style={{color:"#DE9579"}}>
                            {props.label}
                        </Typography>
                    </Box>
                    <Box mb={6}>
                        <Typography variant="h6"style={{color:"#fff"}}>
                            {props.text}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={6} className={classes.right}>
                <img
                    src={props.src}
                    className={classes.topimg}
                />
            </Grid>
        </Container>
        </li>
        </>
    );
}
