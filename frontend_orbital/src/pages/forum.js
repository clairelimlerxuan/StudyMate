import Category from "../components/category";
import Box from "@material-ui/core/Box";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Container, CssBaseline } from "@material-ui/core";
import { css } from "@emotion/react";
import SearchBar from "../components/searchbar";
import QuestionCard from "../components/questioncard";
import Card from '@material-ui/core/Card';
import { CardHeader } from "@material-ui/core";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Autocomplete } from "@material-ui/lab";
import { useAlert } from "react-alert";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import { SettingsInputComponent, SettingsOutlined } from "@material-ui/icons";


const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  align-text: center;
`;


const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        justifyContent:"center",
        backgroundColor: "#B79C8B",
    },
    topimg: {
        marginTop: "100px",
        height: "50vh",
        width: "auto",
        marginBottom: "0",
    },
    root: {
        width: 800,
        flexDirection: "column",
        padding: theme.spacing(2),
        marginBottom: 10,
        marginTop: 30,
    },
    
    form :  {
    '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
    },
}
}));

function Forum(props) {
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const classes = useStyles();
    const [active, setActive] = useState("");
    const [userpost, setUserPost] = useState({});
    const alert = useAlert();   
    const [post, setPost] = useState({});
    const [content, setContent] = useState("");
    const [title, setTitle]  = useState("");
    const [tag, setTag] = useState("");
    const [acadTag, setAcadTag] = useState([]);
    const [nonacadTag, setNonAcadTag] = useState([]);
    const [selectCategory, setSelectCategory] = useState("");
    const [module, setModule] = useState("");
    const [moduleLabel, setModuleLabel] = useState("");
    const [poster, setPoster] = useState({});
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [modules, setModules] = useState([]);
    const [value, setValue] = React.useState(null);


    useEffect(() => {
        setActive("forum");
        getTags();
        getAcademicTag();
        getNonAcademicTag();
        getCategories();
        getModules();
        loadAll();
    }, []);

    const getTags = () => {
        axios
        .get("http://localhost:8000/server/taglist/")
        .then((res) => {
            setTags(res.data);
            setLoading(false);
        })
        .catch((error) => console.log(error));
};


    const getAcademicTag = () => {
        axios
        .get("http://localhost:8000/server/tagbycategory/1/",{
        headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
        },})
        .then((res) => {
            setAcadTag(res.data);
            setLoading(false);
        })
        .catch((error) => console.log(error));
    };

    const getNonAcademicTag = () => {
        axios
        .get("http://localhost:8000/server/tagbycategory/2/",{
            headers: {
                Authorization: `JWT ${localStorage.getItem("token")}`,
        },})
        .then((res) => {
            setNonAcadTag(res.data);
            setLoading(false);
        })
        .catch((error) => console.log(error));
    };

    const getCategories = () => {
        axios
        .get("http://localhost:8000/server/categorylist/")
        .then((res) => {
            setCategories(res.data);
            setLoading(false);
        })
        .catch((error) => console.log(error));
    };

    const getModules = () => {
        axios
        .get("http://localhost:8000/server/modulelist/")
        .then((res) => {
            setModules(res.data);
            setLoading(false);
        })
        .catch((error) => console.log(error));
    };

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const loadAll = () => {
        axios
            .get("http://localhost:8000/server/postlist/")
            .then((res) => {
                const postlist = res.data;
                setPosts(postlist);
                setLoading(false);
            })
            .catch((error) => console.log(error));
    };

    const handleSearch = (keyword) => {
        axios
            .get(`http://localhost:8000/server/search/?q=${keyword}/`
            
            )
            .then((res) => {
                setPosts(res.data);
                setLoading(false);
                setCategory("");
            })
            .catch((error) => console.log(error));
    };

    const handleFilter = (category) => {
        axios
            .get(
                `http://localhost:8000/server/filterbycategory/?search=${category}/`)
            .then((res) => {
                setPosts(res.data);
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


            const handleSubmitPost = (e) => {
                e.preventDefault();
                axios
                .post(`
                http://localhost:8000/server/createpost/`,
                {
                    title : title,
                    userID : props.id,
                    textContent : content,
                    categoryID : selectCategory,
                    tagID : tag,
                    moduleCode : module,
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
                setModule("");
                setSelectCategory("");
                setContent("");
                setTag("");
                setTitle("");
            })
            .catch((err) => {
                if (
                    err.response.status === 401 ||
                    err.response.status === 404
                ) {
                    alert.show("Your session has expired. Please Log In to submit a question");
                } else {
                    console.log(err.response);
                    console.log(err.response.data.res);
                    alert.show(err.response.data.res);
                }
            });
            }

    const onQuestionChange = e => {
        setContent(e.target.value);
        setPoster(props);
    };

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const onTagChange = (e) => {
        setTag(e.target.value);
    }

    const onCategoryChange =(e) => {
        setSelectCategory(e.target.value);
    }



    return (
        <React.Fragment>
            <CssBaseline />
                <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection='column'
                        >
                    <img
                        src='/images/reading.svg'
                        alt="Person reading a book"
                        className={classes.topimg}
                    />
                    <SearchBar handleSearch={handleSearch} loadAll={loadAll} />

                </Box>
                <Container maxWidth="false" className={classes.container}>
                <Card className = {classes.root}>
                    <CardHeader
                    title="Hi, what's your question?"
                    /> 
                        <CardContent>
                            <form className="post pb-4" onSubmit={handleSubmitPost} className={classes.form}>
                                    <div className="form-row align-items-left mb-3 ml-3">
                                        <div>
                                        <TextField
                                            style = {{width: "60ch"}}
                                            id="outlined-multiline-static"
                                            defaultValue="Default Value"
                                            variant="outlined"
                                            placeholder="Title"
                                            value={title}
                                            onChange={onTitleChange}
                                            disabled={!props.username}
                                            required />
                                        </div>
                                        <div>
                                            <TextField
                                                style = {{width: "20ch"}}
                                                id="outlined-multiline-static"
                                                select
                                                variant="outlined"
                                                placeholder="Category"
                                                value={selectCategory}
                                                onChange={onCategoryChange}
                                                helperText="Category"
                                                disabled={!props.username}
                                                required >
                                                <MenuItem value="" disabled>
                                                    Category
                                                </MenuItem>
                                                {categories.map((option) => (
                                                    <MenuItem value={option.categoryID}>
                                                    {option.categoryName}
                                                    </MenuItem>
                                                ))}
                                             </TextField>             
                                             <TextField
                                                style = {{width: "20ch"}}
                                                id="outlined-multiline-static"
                                                select
                                                variant="outlined"
                                                placeholder="Tag"
                                                defaultValue="Default Value"
                                                value={tag}
                                                onChange={e =>{
                                                setTag(e.target.value)}}
                                                disabled={!props.username}
                                                helperText="Tag"
                                                required >
                                                
                                                {selectCategory == "ACAD" && acadTag.map((option) => (
                                                    <MenuItem value={option.tagID}>
                                                    {option.tagName}
                                                    </MenuItem>
                                                ))}
                                                                                                
                                                {selectCategory == "NON-ACAD" && nonacadTag.map((option) => (
                                                    <MenuItem value={option.tagID}>
                                                    {option.tagName}
                                                    </MenuItem>
                                                ))}

                                             </TextField>
                                             
                                            {tag == "Module" &&
                                            <>
                                            <p>{module}</p>
                                            <Autocomplete
                                                value={module}
                                                onChange={(event, newInputValue) => {
                                                    if(newInputValue){
                                                setModule(newInputValue.moduleCode);}
                                                else {
                                                    setModule("");
                                                }
                                                }}
                                                id="controllable-states-demo"
                                                options={modules}
                                                getOptionLabel={option => option.moduleCode}
                                                style={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Module" variant="outlined" />}
                                            />
                                            </>
                                            }
                                            </div>
                                    
                                            
                                        <div>
                                    <TextField
                                        style = {{width: "60ch"}}
                                        id="outlined-multiline-static"
                                        multiline
                                        rows={3}
                                        defaultValue="Default Value"
                                        variant="outlined"
                                        placeholder="What is your question? "
                                        value={content}
                                        onChange={onQuestionChange}
                                        disabled={!props.username}
                                        required />
                                        </div>
                                    </div>
                                    <small className="form-text text-muted col-sm-11">
                                        Inappropriate or irrelevant questions will be filtered accordingly.
                                    </small>       
                                    
                                    <br />
                                    <Button type="submit" color="secondary" variant="contained" 
                                    disabled={content== "" ? true : false}
                                    >
                                        Submit
                                    </Button>
                            </form>
                    </CardContent>
                </Card>
            </Container>
            <main>
                {loading ? (
                    <div className={classes.loading}>
                        <FadeLoader
                            loading={loading}
                            color="#2176ff"
                            css={override}
                            size={150}
                        />
                    </div>
                    ) : (
                    <Container maxWidth="false" className={classes.container}>
                    <Category
                        category={category}
                        setCategory={setCategory}
                        handleFilter={handleFilter}
                    />
                        <Grid container xs={12}>
                            {posts.map((post) => {
                                return (
                                    <>
                                        <Link
                                            to={`/post-page/${post.postID}`}
                                            style={{ textDecoration: "none" }}
                                        >
                                            <QuestionCard
                                                userID={post.userID}
                                                creationDate = {post.creationDate}
                                                title={post.title}
                                                categoryID = {post.categoryID}
                                                tagID = {post.tagID}
                                                textContent = {post.textContent}
                                                upvote = {post.upvote}
                                                downvote = {post.downvote}
                                                numOfComment = {post.numOfComments}
                                            />
                                        </Link>
                                    </>
                                );
                        })}
                        </Grid>
                    </Container>
                    )}            
                </main>
            </React.Fragment>
        );
}

export default Forum;