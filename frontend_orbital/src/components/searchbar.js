import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
    margin: {
        marginTop: 50,
        width: "50%",
    },
    resize: {
        fontSize: 26,
    },
}));

export default function SearchBar({ handleSearch, loadAll }) {
    const classes = useStyles();
    const [keyword, setKeyword] = useState("");
    console.log(keyword);

    const handleInput = (e) => {
        setKeyword(e.target.value);
    };

    const handleEnterPress = (e) => {
        if (e.key === "Enter") {
            if (keyword == "") {
                loadAll();
            } else {
                handleSearch(keyword);
            }
        }
    };

    return (
        <div>
            <TextField
                fullWidth
                className={classes.margin}
                placeholder="Search"
                size="medium"
                onChange={handleInput}
                onKeyPress={handleEnterPress}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="large" />
                        </InputAdornment>
                    ),
                    classes: {
                        input: classes.resize,
                    },
                }}
            />
        </div>
    );
}