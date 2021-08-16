import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@material-ui/core/Box";
import { NavMenu, NavItem } from "@mui-treasury/components/menu/navigation";
import { useLineNavigationMenuStyles } from "@mui-treasury/styles/navigationMenu/line";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PostList from "../components/postlist";
import CommentList from "../components/commentlist";
import ReplyList from "../components/replylist";
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/react";
import { useAlert } from "react-alert";

import {
    Container,
    CssBaseline,
    CardContent,
    Typography,
} from "@material-ui/core";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  align-text: center;
`;

const useStyles = makeStyles({
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
    },
    info: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
});

export default function Profile(props) {
    const classes = useStyles();
    const [data, setData] = useState({});
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const alert = useAlert();
    const [active, setActive] = useState("Post");
    console.log("IS STAFF " + props.isStaff);
    

    if (data != null) {
        console.log(data.length == 0);
    }

    useEffect(() => {
        if (!props.isStaff) {
            axios
                .get(
                    `http://studymate.pythonanywhere.com/server/userpostlist/${props.id}/`,
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
                    setPosts(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    alert.show("Please Login Again");
                });
        }
    }, []);



    const handleChangeData = (newType) => {
        setActive(newType);
        if (newType == active) {
            return;
        }

        if (newType == "Post") {
            axios
                .get(
                    `http://studymate.pythonanywhere.com/server/userpostlist/${props.id}/`,
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
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    alert.show("Signature Has Expired, Please Login Again");
                });
        } else if (newType == "Comment") {
            axios
                .get(
                    `http://studymate.pythonanywhere.com/server/usercommentlist/${props.id}/`,
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
                `http://studymate.pythonanywhere.com/server/userreplylist/${props.id}/`,
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
                            <Box
                                height={48}
                                display={"flex"}
                                justifyContent="center"
                            >
                                <NavMenu
                                    useStyles={useLineNavigationMenuStyles}
                                >
                                    <NavItem
                                        active={
                                            active == "Post" ? true : false
                                        }
                                        onClick={() =>
                                            handleChangeData("Post")
                                        }
                                    >
                                        <Typography variant="h6">
                                            Post History
                                        </Typography>
                                    </NavItem>
                                    <NavItem
                                        active={
                                            active == "Comment" ? true : false
                                        }
                                        onClick={() =>
                                            handleChangeData("Comment")
                                        }
                                    >
                                        <Typography variant="h6">
                                            Comment History
                                        </Typography>
                                    </NavItem>
                                    <NavItem
                                        active={
                                            active == "Reply" ? true : false
                                        }
                                        onClick={() =>
                                            handleChangeData("Reply")
                                        }
                                    >
                                        <Typography variant="h6">
                                            Reply History
                                        </Typography>
                                    </NavItem>
                                </NavMenu>
                            </Box>
                            {loading ? (
                                <div className={classes.loading}>
                                    <FadeLoader
                                        loading={loading}
                                        color="#2176ff"
                                        css={override}
                                        size={150}
                                    />
                                </div>
                            ) : data.length != 0 ? (
                                active == "Post" ? (
                                 <CardContent className={classes.posts}>
                                    {data.map((post) => {
                                            return (
                                                <PostList
                                                    post={post}
                                                    key={post.postid}
                                                />
                                            );
                                    }
                                    )}
                                </CardContent> 
                                ) : (
                                    active == "Comment" ? (
                                        <CardContent className={classes.comments}>
                                        {comments.map((comment) => {
                                                return (
                                                    <CommentList
                                                        comment={comment}
                                                        key={comment.commentID}
                                                    />
                                                );
                                        }
                                        )}
                                    </CardContent> 
                                    ) : (
                                        <CardContent className={classes.replies}>
                                        {replies.map((reply) => {
                                                return (
                                                    <ReplyList
                                                        reply={reply}
                                                        key={reply.replyid}
                                                    />
                                                );
                                        }
                                        )}
                                    </CardContent> 
                                    )
                                )
    

                            ) : (
                                <Box
                                height={48}
                                display={"flex"}>
                                <CardContent style={{alignItems:"center"}}>
                                    <Typography variant="h3">
                                    {"No " + active + " Made"}
                                    </Typography>
                                </CardContent>
                                </Box>
                 
                            )
                            }
                </Container>
            </main>
        </React.Fragment>
    );
}