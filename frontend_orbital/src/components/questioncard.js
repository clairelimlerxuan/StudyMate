import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { CardMedia } from "@material-ui/core";
import { Link } from "react-router-dom";
import Chip from '@material-ui/core/Chip';
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    root: {
        width: 600,
        color: "black",
        margin: "20px",
        marginBottom: 10,
        backgroundColor: "#fafafa",
        display: "grid",
        paddingTop: "10px",
    },
    cover: {
        width: "100%",
        minHeight: 320,
    },
    img: {
        width: "100%",
    },
    info: {
        backgroundColor: "#fafafa",
    },
    iconbar: {
        width: "100%", /* Full-width */
        overflow: "auto",
    },
    icons: {
        float: "left",
        width: "20%",
        textAlign: "center",

    },
    comment: {
        justifySelf: "start",
    }
}));

export default function QuestionCard(props) {
    const classes = useStyles();

    const [loading, setLoading] = useState(true);





    return (
        <Card className={classes.root}>
            <CardContent className={classes.info}>
                <Typography variant="body2" align="left" color="textSecondary">
                    {"Posted on: " + props.creationDate}
                </Typography>
                <Typography
                    variant="subtitle1"
                    align="left"
                    color="textSecondary"
                >
                    {"Posted by : "  + props.userID}
                </Typography>
                <Typography variant="h6" align="left">
                    {props.title}
                </Typography>
                <Chip label={props.categoryID} />
                <Chip label= {props.tagID}/>
                <Typography variant="subtitle1" align="left">
                    {props.textContent}
                </Typography>
                <div className={classes.iconbar}>
                <Typography variant="subtitle1" align="left" className={classes.icons}>
                    {props.upvote}
                    <ThumbUpIcon color="secondary" className={classes.icons}/>
                </Typography>
                <Typography variant="subtitle1" align="left" className={classes.icons}>
                    {props.downvote}
                <ThumbDownIcon color="secondary" className={classes.icons}/>
                </Typography>
                <Typography variant="subtitle1" align="left" className={classes.icons}>
                    <Link to="/post-page" className={classes.comment}>
                        <ChatBubbleIcon color="secondary" className={classes.icons}>
                        </ChatBubbleIcon>
                    </Link>
                    {props.numOfComment}
                </Typography>
                </div>
            </CardContent>
        </Card>
    );
}