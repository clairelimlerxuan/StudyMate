import React, { useState, useEffect} from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import { NavLink } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { useAlert } from "react-alert";
import { Reply } from "@material-ui/icons";
import Linkify from 'react-linkify';
import { CssBaseline } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Modal } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Backdrop } from "@material-ui/core";
import { Fade } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import { CardActionArea } from "@material-ui/core";
import { CardHeader } from "@material-ui/core";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import { Container } from "@material-ui/core";
import ThumbUp from "@material-ui/icons/ThumbUp";
import { ThumbDown } from "@material-ui/icons";
import { Edit } from "@material-ui/icons";
import { Delete } from "@material-ui/icons";
import { Comment } from "@material-ui/icons";
import { Alert, AlertTitle } from '@material-ui/lab';
import { brown } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        paddingTop: "50px",
        justifyContent:'center',
        justifyContent: 'space-between',
    },
    root: {
        width: 1000,
        flexDirection: "column",
        marginBottom: 20,
    },

    commentroot : {
        width: 800,
        marginBottom: 30,
    },

    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth:600,
    },

    paper: {
        width: 550,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },

    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 25,
        fontWeight: 1000,
    },
    pos: {
        marginBottom: 12,
    },
    footer : {
        listStyle: "none"
    },
    line :{
        marginBottom:12,
    },
    form :  {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },

    header : {
        backgroundColor: "#8d6e63",
        width: "100%",
        alignItems: 'stretch',
        flexDirection: 'column',
        flexGrow: 1,
    },
    headerTitle : {
        color: theme.palette.secondary.contrastText,
    }
    }));


export default function Thread({ match, location, id }) {
    const [user, setUser] = useState({});
    const [username, setUsername]  = useState("");
    const [isStaff, setIsStaff] = useState(false);
    const [user_post, setUserPost] = useState({});
    const [post, setPostdata] = useState({});
    const [comments, setCommentsdata] = useState([]);
    const [commentID, setCommentID] = useState("");
    const [comment, setComment] = useState({});
    const [replies, setReplies] = useState([]);
    const [reply, setReply] = useState({})
    const [replyID, setReplyID] = useState("");
    const [content, setContent] = useState("");
    const [answerer, setAnswerer] = useState({});
    const [answer, setAnswer] = useState("");
    const [postEdit, setPostEdit] = useState("");
    const [postTitleEdit, setPostTitleEdit] = useState("");
    const [commentEdit, setCommentEdit] = useState("");
    const [replyEdit, setReplyEdit] = useState("");
    const [modal, setModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [upvote, setUpvote] = useState(false);
    const [downvote, setDownVote] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [like, setLike] = useState(0);
    const [dislike, setDislike] = useState(0);
    const alert = useAlert();

    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("token") ? true : false
    );

    const [scroll, setScroll] = React.useState('paper');
  
    const handleModalOpen = (scrollType) => {
      setModal(true);
      setScroll(scrollType);
    };


    const handleModalClose = () => {
        setModal(false);
    }

    const handleEditOpen = () => {
        setEditOpen(true);
      };
  
  
      const handleEditClose = () => {
          setEditOpen(false);
      }
  
      
    

    const descriptionElementRef = React.useRef(null);

    useEffect(() => {
    if (modal) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [modal]);


    useEffect(() => {
        if (isLoggedIn) {
            fetch("http://localhost:8000/server/current_user/", {
                headers: {
                    Authorization: `JWT ${localStorage.getItem("token")}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    setUsername(json.username);
                    setIsStaff(json.is_staff);
                });
        }
    }, [isLoggedIn]);
    
    useEffect(() => {
        axios
            .get(
                `http://localhost:8000/server/postcomment/${match.params.postID}/`
            )
            .then((res) => {
                console.log(res.data);
                setCommentsdata(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        axios
            .get(
                `http://localhost:8000/server/viewpost/${match.params.postID}/`
            )
            .then((res) => {
                console.log(res.data);
                setPostdata(res.data);
                setLike(res.data.upvote);
                setDislike(res.data.downvote);
                setLoading(false);
                getUserPost();
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    
    const getReplies = (commentid) => {
        axios
        .get(
            `http://localhost:8000/server/commentanswer/${commentid}/`)
            .then((res) => {
                setReplies(res.data);
                setReplyID(id);
                setLoading(false);
                setCommentID(commentid);
            });
        }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteOpen = () => {
        setDeleteOpen(true);
    }

    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };

    const handleSubmitComment = () =>
        axios
        .post(
        `http://localhost:8000/server/createcomment/`,
        {
            postID: match.params.postID,
            userID : id,
            textContent : content,
        },
        {
            headers: {
                Authorization: "JWT " + localStorage.getItem("token"),
            },
        }
    )
    .then((res) => {
        console.log(res);
        console.log(res.data);
        handleOpen();
        setContent("");
    })
    .catch((err) => {
        if (
            err.response.status === 401 ||
            err.response.status === 404
        ) {
            alert.show("Your session has expired. Please Log In again to answer this question");
        } else {
            console.log(err.response);
            console.log(err.response.data.res);
            alert.show(err.response.data.res);
        }
    });


    const handleSubmitCommentAns = () => {
        axios
        .post(`
        http://localhost:8000/server/createreply/`,
        {
            postID: match.params.postID,
            userID : id,
            textContent : content,
            commentID :commentID,
        },
        {
            headers: {
                Authorization: "JWT " + localStorage.getItem("token"),
            },
        }
    )
    .then((res) => {

        console.log(res);
        console.log(res.data);
        handleOpen();
        setContent("");
    })
    .catch((err) => {
        if (
            err.response.status === 401 ||
            err.response.status === 404
        ) {
            alert.show("Your session has expired. Please Log In again to comment this answer");
        } else {
            console.log(err.response);
            console.log(err.response.data.res);
            alert.show(err.response.data.res);
        }
    });
    }
    
    const handleUpvote = (userID, postID) => {
    axios
    .post(`http://localhost:8000/server/upvotepost/`, 
    {
        userID : id,
        postID : match.params.postID,
        
    },
    {
        headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
        },
    }
    )
    .then(
        res => {
            console.log(res);
            console.log('Update Complete');  
            setPost(res.data);
            setLike(res.data.upvote);
        })
        .catch((err) => {
            if (
                err.response.status === 401 ||
                err.response.status === 404
            ) {
                alert.show("Please Log In to vote this post");
            } else {
                console.log(err.response);
                console.log(err.response.data.res);
                alert.show(err.response.data.res);
            }
        });
        }

    const handleDownvote = () => {
        axios
        .post(`http://localhost:8000/server/downvotepost/`, 
        {
            postID : match.params.postID,
            userID : id
        },
        {
            headers: {
                Authorization: "JWT " + localStorage.getItem("token"),
            },
        }
        )
        .then(
            res => {
                console.log(res);
            })
        .catch((err) => { if (
            err.response.status === 401 ||
            err.response.status === 404
        ) {
            alert.show("Please Log In to vote this post");
        } else {
            console.log(err.response);
            console.log(err.response.data.res);
            alert.show(err.response.data.res);
        }
    });
    }

    const handleUnvote = () => {
        axios
        .post(`http://localhost:8000/server/downvotepost/`, 
        {
            postID : match.params.postID,
            userID : id
        },
        {
            headers: {
                Authorization: "JWT " + localStorage.getItem("token"),
            },
        }
        )
        .then(
            res => {
                console.log(res);
            })
        .catch((err) => { if (
            err.response.status === 401 ||
            err.response.status === 404
        ) {
            alert.show("Please Log In to vote this post");
        } else {
            console.log(err.response);
            console.log(err.response.data.res);
            alert.show(err.response.data.res);
        }
    });
    }

    
    const handleEditComment = e => {
            e.preventDefault();
            const data = {
                textContent: commentEdit,
                commentID : commentID,
                userID : id,
            };
    
            axios
                .post(('http://localhost:8000/server/editcoment', data),
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
            }

    const onCommentChange = e => {
            setContent(e.target.value)
            setAnswerer(username)
        };

    const handleEditPost = e => {
            e.preventDefault();

            axios
                .post('http://localhost:8000/server/editpost/',
                {
                    userID : id,
                    textContent: postEdit,
                    title : postTitleEdit,
                    postID: match.params.postID,
                },
                {
                    headers: {
                        Authorization: "JWT " + localStorage.getItem("token"),
                    },
                })
                .then(
                    res => {
                        window.location.reload(false);
                    })
                .catch(err => console.log(err));
        };
    
    
    const setPost = (post,title) => {
            setPostEdit(post);
            setPostTitleEdit(title);
    }

    
    const onPostEditChange = (e) => {
        setPostEdit(e.target.value);
    };

    const onPostTitleEditChange = (e) => {
        setPostTitleEdit(e.target.value);
    };


    const onReplyEditChange = e => {
       setReplyEdit(e.target.value);
    };

    const onReplyChange = (e) => {
        setContent(e.target.value)
        setAnswerer(username)
    }

    
    const handleDelete = e => { //deleting post
        e.preventDefault();

        axios
            .delete(`http://localhost:8000/server/deletepost/${match.params.postID}/${id}/`,
            {
                headers: {
                    Authorization: "JWT " + localStorage.getItem("token"),
                },
            })//delete post
            .then(res => {
                console.log(res);
                window.location.reload(false);
            
            })
            .catch(err => console.log(err));
    };

    const handleDeleteComment = (e) => { 

        axios
            .delete(`http://localhost:8000/server/deletecomment/${commentID}/${id}/`,
            {
                headers: {
                    Authorization: "JWT " + localStorage.getItem("token"),
                },
            }) //delete comment
            .then(res => {
                console.log(res);
                window.location.reload(false);
            })
            .catch(err => console.log(err));
    };

    
    const getUserPost = () => { 
        
        //get the user who post the question/post
        const postID = match.params.postID; //get post id
        axios
            .get( `http://localhost:8000/server/postuser/${match.params.postID}/`
            ) //search user who post the question
            .then(res => {
                setUserPost(res.data); //set user_post 
            })
            .catch(err => console.log(err));
    };

    const setReplyAndID = (id, reply) => {
        setReplyID(id);
        setContent(reply);
    }

    const setCommentAndID = (commentid, ans) => {
        setCommentID(commentid);
        setContent(ans);
    }

    const refreshPage =() => {
        window.location.reload(false);
    }

    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <React.Fragment>
        <CssBaseline />

        <Container maxWidth="false" className={classes.container}>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="start"
                m={1}
                flexDirection='column'
                        >
        <p className="whiteSpace"></p>
        
        <Card className = {classes.root}>
            <CardHeader title={post.title}
            subheader={
            <div className="sub-text">
                    <h8 className="pr-1">@ {`${post.postID}`}</h8>
                        &middot; Posted on {`${post.creationDate}`}
                            <div>Posted by {user_post.username}</div>
            </div>
            }
             classes={{
                root: classes.header,
                title: classes.headerTitle,
              }}

           
            >
            </CardHeader>
            <hr className="line"></hr>
                    <CardContent>
                    <Typography  variant="body2" component="p" style={{marginBottom:12}}>
                        {post.textContent}
                    </Typography>
                    <ul className="footer">
                        <li>
                            <Button title="Like"  startIcon={<ThumbUp />} onClick={() => {
                                if (setUpvote == true) {
                                    handleUnvote(
                                        match.params.postID,
                                        id
                                    )
                                }
                                else {
                                    setUpvote(true);
                                    handleUpvote(
                                        match.params.postID,
                                        id
                                )}}}>
                                {like}
                            </Button>
                            <Button  title="Disike"
                            startIcon={<ThumbDown/>}
                            onClick={() => {
                                if (setDownVote == true) {
                                    handleUnvote(
                                        match.params.postID,
                                        id
                                    )
                                } 
                                else {
                                setDownVote(true);
                                handleDownvote(
                                    match.params.postID,
                                    id
                                )}}}>
                                {post.downvote}
                            </Button>
                            
                            <Button title="View comments"  data-toggle="modal" 
                            data-target="#commentsPostModal" 
                            startIcon={<Comment/>}>
                                    {post.numOfComments}
                            </Button>
                        
                        </li>
                        <li>
                            {isLoggedIn &&
                                <form className="post pb-4">
                                    <div className="form-row align-items-left mb-3 ml-3">
                                    <TextField
                                        style = {{width: "60ch"}}
                                        id="outlined-multiline-static"
                                        label="Comment.."
                                        multiline
                                        rows={5}
                                        defaultValue="Default Value"
                                        variant="outlined"
                                        placeholder="What are your thoughts? "
                                        value={content}
                                        onChange={onCommentChange}
                                        disabled={!isLoggedIn}
                                        required />
                                    </div>
                                    <small className="form-text text-muted col-sm-11">
                                        Inappropriate or irrelevant answers will be filtered accordingly.
                                    </small>       
                                    
                                    <br />
                                    <Button type="submit" color="secondary" variant="contained" onClick={handleSubmitComment}
                                    disabled={content== "" ? true : false}
                                    >
                                        Answer
                                    </Button>
                                </form>
                            }

                            {!isLoggedIn &&
                                <form className="post pb-4">
                                    <div className="form-row align-items-left mb-3 ml-3">
                                    <TextField
                                        style = {{width: "60ch"}}
                                        id="outlined-multiline-static"
                                        label="Comment.."
                                        multiline
                                        rows={5}
                                        defaultValue="Default Value"
                                        variant="outlined"
                                        placeholder="What are your thoughts? "
                                        value={content}
                                        onChange={onCommentChange}
                                        disabled={true}
                                        required />
                                    </div>
                                    <small className="form-text text-muted col-sm-11">
                                        Inappropriate or irrelevant answers will be filtered accordingly.
                                    </small>       
                                    <Alert severity="warning"  color="error">
                                        <AlertTitle>Warning</AlertTitle>
                                            <strong>Please </strong> 
                                            <strong>
                                            <NavLink className="underline-link alert-danger" to="/login">
                                            sign in</NavLink> to answer this question</strong> 
                                    </Alert>
                                </form>
                            }

                            {isLoggedIn && username == user_post.username &&
                            <div>
                                <>
                                <Button  variant="contained" color="secondary"  style={{ width: 100 }} 
                                startIcon={<Edit/>} onClick={() => {handleEditOpen();setPost(post.textContent,
                                post.title);}}>
                                        Edit
                                </Button>
                                <Dialog
                                    open={editOpen}
                                    onClose={handleEditClose}
                                    className={classes.modal}
                                    aria-labelledby="simple-dialog-title"
                                    aria-describedby="simple-dialog-description"
                                    >
                                        <DialogContent className={classes.paper}>
                                            <DialogContentText>
                                                <h4 id="simple-dialog-title">Edi post</h4>
                                            </DialogContentText>
                                        <form className="post pb-4" className={classes.form}>
                                            <div className="form-row align-items-left mb-3 ml-3">
                                                <div>
                                                <TextField
                                                    style = {{width: "60ch"}}
                                                    id="outlined-multiline-static"
                                                    defaultValue="Default Value"
                                                    variant="outlined"
                                                    placeholder="Title"
                                                    value={postTitleEdit}
                                                    onChange={onPostTitleEditChange}
                                                    disabled={!isLoggedIn}
                                                    required />
                                                </div>
                                                <div>
                                                <TextField
                                                    style = {{width: "60ch"}}
                                                    id="outlined-multiline-static"
                                                    defaultValue="Default Value"
                                                    variant="outlined"
                                                    placeholder="Title"
                                                    multiline
                                                    rows={4}
                                                    value={postEdit}
                                                    onChange={onPostEditChange}
                                                    disabled={!isLoggedIn}
                                                    required />
                                                </div>
                                            </div>
                                            <DialogActions>
                                                <div className="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                                    <Button variant = "outlined" 
                                                    className="btn btn-default col-sm-5 btn-outline-danger mr-2" style = {{margin:5}}
                                                    onClick={handleEditPost}>
                                                        Save
                                                    </Button>
                                                    <Button variant = "outlined" style = {{margin:5}} className="btn btn-default col-sm-5 btn-outline-secondary"
                                                    onClick={handleEditClose}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </DialogActions>
                                        </form>
                                        </DialogContent>
                                    </Dialog> 
                                </>
                                <>                                  
                                    <Button  variant="contained" color="secondary"  style={{ width: 100 }} 
                                    startIcon={<Delete/>} onClick={() => handleDeleteOpen()}>
                                            Delete
                                    </Button>
                                    <Dialog
                                    open={deleteOpen}
                                    onClose={handleDeleteClose}
                                    className={classes.modal}
                                    aria-labelledby="simple-dialog-title"
                                    aria-describedby="simple-dialog-description"
                                    >
                                        <DialogContent className={classes.paper}>
                                            <DialogContentText>
                                                <h4 id="simple-dialog-title">Delete post</h4>
                                                <div className="modal-body text-left pt-3 pb-3">
                                                    Are you sure you want to delete this post? 
                                                </div>
                                                <div className="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                                        <Button variant = "outlined" className="btn btn-default col-sm-5 btn-outline-danger mr-2"
                                                         style = {{margin:5}} onClick={handleDelete}>
                                                            Delete
                                                        </Button>
                                                        <Button variant = "outlined" style = {{margin:5}} className="btn btn-default col-sm-5 btn-outline-secondary" 
                                                        onClick={handleDeleteClose}>
                                                            Cancel
                                                        </Button>
                                                </div>
                            
                                            </DialogContentText>
                                        </DialogContent>
                                    </Dialog> 
                                    </>
                                    </div>   
                            }     {/* end of delete post/question modal */}        
                        </li>
                    </ul>
            </CardContent>
        </Card>
        {/* Post */}
        <p className="whiteSpace"></p>

        {/*Comments*/}
            <div>
                <h2 className="pt-5 pb-2"> <b>Answers: </b></h2>
                < Linkify >
                    {comments && comments.map((comment) =>
                        <Card y={10}  className={classes.commentroot}>
                        <CardContent>
                        <div>
                            <div className="card mb-3 card-thread">
                                <div className="card-body mr-4 pb-0">
                                    <Typography variant="subtitle2">
                                        <div className="sub-text">
                                            Posted by {comment.userID}
                                            <div className="pl-0">
                                                Answered on {comment.creationDate}
                                            </div>
                                        </div>
                                    </Typography>
                                    <Typography className={classes.pos} style={{marginBottom:12}}>
                                            <p className="whiteSpace">{comment.textContent}</p>
                                    </Typography>
                                        {isLoggedIn &&
                                        <div>
                                                 <Button className="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button"
                                                     data-toggle="modal" data-target="#commentsModal"
                                                     onClick={() => {
                                                        getReplies(`${comment.commentID}`); handleModalOpen('paper');}}
                                                     startIcon={<Comment/>}>
                                                         {comment.replyCount}
                                                 </Button>
                                                 
                                                <Dialog
                                                    className={classes.modal}
                                                    open={modal}
                                                    onClose={handleModalClose}
                                                    scroll={scroll}
                                                    aria-labelledby="scroll-dialog-title"
                                                    aria-describedby="scroll-dialog-description"
                                                    closeAfterTransition
                                                    BackdropComponent={Backdrop}
                                                    BackdropProps={{
                                                      timeout: 500,}}>
                                               
                                                  <Fade in={modal}>
                                                      <div className={classes.paper}>
                                                         <div id="scroll-dialog-title" className="modal fade" role="dialog">
                                                             <div className="modal-dialog modal-lg">
                                                                 <div className="modal-content">
                                                                     <div className="modal-header blueBg">
                                                                         <h2 id="transition-modal-title">Replies</h2>
                                                                    </div>
                                                                    <div className="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                                                            <p className="font-italic pb-1 mb-0 pl-2">Commenting as {username}</p>
                                                                            
                                                                    </div>
                                                                    <div className="modal-body text-left pt-0">
                                                                    <div className="row content mb-0 greyBg pt-4 pb-3">
                                                                    <form className="post pb-4">
                                                                        <div className="form-row align-items-left mb-3 ml-3">
                                                                        <TextField
                                                                            style = {{width: "60ch"}}
                                                                            id="outlined-multiline-static"
                                                                            label="Reply"
                                                                            multiline
                                                                            rows={5}
                                                                            defaultValue="Default Value"
                                                                            variant="outlined"
                                                                            placeholder="Add reply... "
                                                                            value={content}
                                                                            onChange={onReplyChange}
                                                                            required />
                                                                        </div>
                                                                        <small className="form-text text-muted col-sm-11">
                                                                            Inappropriate or irrelevant replies will be filtered accordingly.
                                                                        </small>       
                                                                        
                                                                        <br />
                                                                        <Button type="submit" color="secondary" variant="contained" onClick={handleSubmitCommentAns}
                                                                        disabled={content == "" ? true : false} style={{marginBottom:15}}
                                                                        >
                                                                            Add Comment
                                                                        </Button>
                                                                    </form>
                                        
                                                                    </div>
                                                    
                                                                         {replies && replies.map((reply) =>
                                                                             <DialogContent dividers={scroll === 'paper'}>
                                                                                <DialogContentText
                                                                                 id="scroll-dialog-description"
                                                                                 ref={descriptionElementRef}
                                                                                 tabIndex={-1}
                                                                               >
                                                                                    <div>
                                                                                        <div className="row content">
                                                                                            <div className="col-sm-12 ml-2">
                                                                                                <p className="font-weight-bold pb-0 mb-0">{reply.userID}</p>
                                                                                                <p className="sub-text pt-0 mt-0">Commented on {reply.creationDate}</p>
                                                                                            </div>
                                                                                            <p className="mr-3 ml-4 whiteSpace">{reply.textContent}</p>
                                                                                        </div>   
                                                                                        
                                                                                    </div>
                                                                                </DialogContentText>
                                                                            </DialogContent>
                                                                     )}
 
                                                                     {replies.length == "0" &&
                                                                         <div className="muted-text mt-3 pl-3 pb-3">
                                                                             No Replies yet!
                                                                         </div>
                                                                     }
                                                                 </div>
                                                             </div>
                                                         </div>
                                                     </div>
                                                </div>
                                              </Fade>
                                              </Dialog>
                                    
                                              </div>
                                        }
                                         {!isLoggedIn &&
                                            <div>
                                                <Button className="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button"
                                                     data-toggle="modal" data-target="#commentsModal"
                                                     onClick={() => {
                                                        getReplies(`${comment.commentID}`); handleModalOpen('paper');}}
                                                     startIcon={<Comment/>}>
                                                         {comment.replyCount}
                                                 </Button>
                                                     <Dialog
                                                    className={classes.modal}
                                                    open={modal}
                                                    onClose={handleModalClose}
                                                    scroll={scroll}
                                                    aria-labelledby="scroll-dialog-title"
                                                    aria-describedby="scroll-dialog-description"
                                                    closeAfterTransition
                                                    BackdropComponent={Backdrop}
                                                    BackdropProps={{
                                                      timeout: 500,}}>
                                               
                                                  <Fade in={modal}>
                                                     <div className={classes.paper}>
                                                         <div id="scroll-dialog-title" className="modal fade" role="dialog">
                                                             <div className="modal-dialog modal-lg">
                                                                 <div className="modal-content">
                                                                     <div className="modal-header blueBg">
                                                                         <h2 id="transition-modal-title">Replies</h2>
                                                                     </div>
                                                                     <div className="modal-body text-left pt-0">
                                                                     <div className="row content mb-0 greyBg pt-4 pb-3">
                                                                        <div className="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                                                            <p className="font-italic pb-1 mb-0 pl-2">Commenting as {username}</p>
                                                                            
                                                                        </div>
                                                                    </div>
                                                                         <hr className="mt-0 mb-4" />
                                                    
                                                                         {replies && replies.map((reply) =>
                                                                             <DialogContent dividers={scroll === 'paper'}>
                                                                                <DialogContentText
                                                                                 id="scroll-dialog-description"
                                                                                 ref={descriptionElementRef}
                                                                                 tabIndex={-1}
                                                                               >
                                                                                    <div>
                                                                                        <div className="row content">
                                                                                            <div className="col-sm-12 ml-2">
                                                                                                <p className="font-weight-bold pb-0 mb-0">{reply.userID}</p>
                                                                                            </div>
                                                                                            <p className="mr-3 ml-4 whiteSpace">{reply.textContent}</p>
                                                                                        </div>   
                                                                                        
                                                                                    </div>
                                                                                </DialogContentText>
                                                                            </DialogContent>
                                                                     )}
 
                                                                     {replies.length == "0" &&
                                                                         <div className="muted-text mt-3 pl-3 pb-3">
                                                                             No Replies yet!
                                                                         </div>
                                                                     }
                                                                 </div>
                                                             </div>
                                                         </div>
                                                     </div>
                                                  </div>
                                              </Fade>
                                              </Dialog>
                                             </div>

                                        }
                                        {isLoggedIn && id == `${comment.userID}` &&
                                        <ul>
                                                <Button className="btn btn-icon float-right" title="Edit Answer" data-toggle="modal" data-target="#editAnswerModal" 
                                                onClick={() => setCommentAndID(`${comment.commentID}`, 
                                                `${comment.textContent}`)} startIcon={<Edit/>}>
                                                </Button>
                                        
                                                <>
                                                <Button className="btn btn-icon float-right" type="button" data-toggle="modal" title="Delete Answer" data-target="#deleteAnswerModal" 
                                                onClick={() =>{setCommentID(`${comment.commentID}`); handleOpen()}} startIcon={<Delete/>}>
                                                </Button>
                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose} 
                                                    className={classes.modal}
                                                    aria-labelledby="simple-dialog-title"
                                                    aria-describedby="simple-dialog-description"
                                                    >
                                                        <DialogContent className={classes.paper}>
                                                            <DialogContentText>
                                                                <h4 id="simple-dialog-title">Delete Comment</h4>
                                                                <div className="modal-body text-left pt-3 pb-3">
                                                                    Are you sure you want to delete your comment? 
                                                                </div>
                                                                <div className="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                                                    <Button variant = "outlined" 
                                                                    className="btn btn-default col-sm-5 btn-outline-danger mr-2" style = {{margin:5}}
                                                                        onClick={handleDeleteComment}>
                                                                        Delete
                                                                    </Button>
                                                                    <Button variant = "outlined" style = {{margin:5}} className="btn btn-default col-sm-5 btn-outline-secondary" 
                                                                    onClick={handleClose}>
                                                                        Cancel
                                                                    </Button>
                                                                </div>
                                            
                                                            </DialogContentText>
                                                        </DialogContent>

                                                    </Dialog>
                                                </>
                                            
                                        </ul>
                                        }
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                    )}
                                        
                    {!comments || comments.length == "0" &&
                        <div className="card mb-3">
                            <div className="card-body mr-4">
                                <div className="muted-text mt-3">
                                    No answer yet for this question! Your contribution would be appreciated!
                                </div>
                            </div>
                        </div>
                    }
                </Linkify>
            </div>
        {/*END*/}
    
        </Box>
        </Container>
        </React.Fragment>
    );
                        }