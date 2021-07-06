import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { useFirebaseBtnStyles } from "@mui-treasury/styles/button/firebase";
import { useAlert } from "react-alert";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: 100,
        color: "black",
        margin: 10,
        marginBottom: 20,
        borderRadius: 10,
        border: "1px solid black",
    },
    cover: {
        width: "100%",
    },
    title : {},
    textcontent : {},
    info: {
        margin: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    buttons: {
        marginRight: 30,
    },
    button: {
        margin: 10,
        backgroundColor: "#14cc60",
        borderColor: "#14cc60",
    },
}));

export default function BorrowedBookList({ comment }) {
    const styles = useFirebaseBtnStyles();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(comment);
    const [commentdata, setCommentdata] = useState({});
    const [postdata, setPostdata] = useState({});
    const alert = useAlert();

    useEffect(() => {
        axios
            .get(`http://localhost:8000/server/viewcomment/${data.commentID}/`,
            {
                headers: {
                    Authorization: "JWT " + localStorage.getItem("token"),
                },
            }
            )
            .then((res) => {
                setCommentdata(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        axios
            .get(`http://localhost:8000/server/commentparent/${data.commentID}/`,
            {
                headers: {
                    Authorization: "JWT " + localStorage.getItem("token"),
                },
            })
            .then((res) => {
                setPostdata(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


   
    return (
        <Card className={classes.root} elevation="0">
            <div className={classes.info}>
                <Typography
                    variant="h5"
                    onClick={handleOpen}
                    className={classes.title}
                >
                    {postdata.title}
                </Typography>
                <Typography
                    variant="h5"
                    onClick={handleOpen}
                    className={classes.textcontent}
                >
                    {commentdata.textContent}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                    {"Posted on :"  + commentdata.creationDate}
                </Typography>

            </div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">Transition modal</h2>
                        <p id="transition-modal-description">
                            Comment
                        </p>
                    </div>
                </Fade>
            </Modal>
        </Card>
    );
}