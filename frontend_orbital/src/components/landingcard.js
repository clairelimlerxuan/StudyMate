import React from 'react'

const useStyles = makeStyles((theme) => ({
    top: {
        display: "flex",
        height: "100vh",
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

const RoundedButton = withStyles((theme) => ({
    root: {
        width: "200px",
        height: "50px",
        borderRadius: "10px",
    },
}))(Button);

export default function Landingcard() {
    const classes = useStyles();

    return (
        <Container maxWidth="lg" className={classes.top}>
            <Grid container xs={6} className={classes.left} alignItems="center">
                <Box pr={10}>
                    <Box mb={2} mt={-9}>
                        <Typography variant="h2">
                            BT2102 Assignment 1
                        </Typography>
                    </Box>
                    <Box mb={6}>
                        <Typography variant="h6">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit.
                        </Typography>
                    </Box>
                    <Link
                        to="/library"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        <RoundedButton
                            variant="contained"
                            color="primary"
                            href="#"
                            size="large"
                        >
                            Browse Books
                        </RoundedButton>
                    </Link>
                </Box>
            </Grid>
            <Grid item xs={6} className={classes.right}>
                <img
                    src={bookreading3}
                    alt="Person reading a book"
                    className={classes.topimg}
                />
            </Grid>
        </Container>
    );
}
