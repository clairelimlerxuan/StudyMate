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
        maxWidth: 600,
        color: "black",
        margin: "20px",
        marginBottom: 10,
        backgroundColor: "#DADBD6",
        display: "grid",
        paddingTop: "10px",
        display :"flex"
    },
    cover: {
        width: "100%",
        minHeight: 320,
    },
    img: {
        width: "100%",
    },
    info: {
        backgroundColor: "#DADBD6",
    },
    iconbar: {
        width: "100%", /* Full-width */
        overflow: "auto",
    },
    icons: {
        float: "left",
        width: "20%",
        textAlign: "center",
        color:"#292120"

    },
    comment: {
        justifySelf: "start",
    },

    chipCategory : {
        
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
                <Typography variant="h6" align="left" style={{color:"#292120"}}>
                    {props.title}
                </Typography>
                {props.categoryID == 'ACAD' &&
                    <Chip label={props.categoryID} style={{backgroundColor:"#6B564E", color:"#221719"}}/>}
                {props.categoryID == "NON-ACAD" &&  
                    <Chip label={props.categoryID} style={{backgroundColor:"#AB7F3D",color:"#221719"}}/>}
                <Chip label= {props.tagID} style={{backgroundColor:"#A35141", color:"#221719"}}/>
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