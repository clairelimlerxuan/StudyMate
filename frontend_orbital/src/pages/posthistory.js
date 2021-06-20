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
        display: "flex",
    },
    info: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        margin: "2rem",
    },
});

export default function Profile(props) {
    const classes = useStyles();
    const [data, setData] = useState({});
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [replies, setReply] = useState([]);
    const [loading, setLoading] = useState(true);
    const alert = useAlert();
    const [active, setActive] = useState("Posted");
    console.log("IS STAFF " + props.isStaff);
    console.log(posts);

    if (data != null) {
        console.log(data.length == 0);
    }

    useEffect(() => {
        if (!props.isStaff) {
            axios
                .get(
                    `http://localhost:8000/server/userpostlist/${props.id}/`,
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
                    alert.show("Please Login Again");
                });
        }
    }, []);

    const handleChangeData = (newType) => {
        setActive(newType);
        if (newType == active) {
            return;
        }

        if (newType == "Posted") {
            axios
                .get(
                    `http://localhost:8000/server/userpostlist/${props.id}/`,
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
                    setLoading(false);
                })
                .catch((err) => {
                    alert.show("Error Fetching Data");
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
                setLoading(false);
            })
            .catch((err) => {
                alert.show("Error Fetching Data");
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
                                            active == "Posted" ? true : false
                                        }
                                        onClick={() =>
                                            handleChangeData("Posted")
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
                                        css={css}
                                        size={150}
                                        
                                    />
                                </div>
                            ) : data.length != 0 ? (
                                active == "Posted" ? (
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
                                        {data.map((comment) => {
                                                return (
                                                    <CommentList
                                                        comment={comment}
                                                        key={comment.commentid}
                                                    />
                                                );
                                        }
                                        )}
                                    </CardContent> 
                                    ) : (
                                        <CardContent className={classes.replies}>
                                        {data.map((reply) => {
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
                                <CardContent>
                                    <Typography variant="h3">
                                    {"No " + active + "Made"}
                                    </Typography>
                                </CardContent>
                 
                            )
                            }
                </Container>
            </main>
        </React.Fragment>
    );
}