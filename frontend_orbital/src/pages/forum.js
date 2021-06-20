

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

import { CenterFocusStrong, SignalCellularNullOutlined } from "@material-ui/icons";
import SearchBar from "../components/searchbar";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles({
    container: {
        display: "flex",
    },
    loading: {
        marginTop: "100px",
        alignItems: 'center'
    },
    topimg: {
        marginTop: "100px",
        height: "50vh",
        width: "auto",
        marginBottom: "0",
    },
});

function Forum(props) {
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [books, setPosts] = useState([]);
    const classes = useStyles();
    

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
        <SearchBar />
        </Box>
        <main>

        <Container maxWidth="false" className={classes.container}>
    
        <Category
            category={category}
            setCategory={setCategory}
        />
        </Container>
                     )
                     )</main>
    </React.Fragment>
    );
}

export default Forum;