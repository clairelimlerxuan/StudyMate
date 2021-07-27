import React, { useState } from "react";
import {
    CategoryProvider,
    CategoryTitle,
    CategoryItem,
} from "@mui-treasury/components/menu/category";
import { makeStyles } from "@material-ui/core/styles";
import { YearPicker } from "react-dropdown-date";
import Button from "@material-ui/core/Button";
import { useFirebaseBtnStyles } from "@mui-treasury/styles/button/firebase";

const useStyles = makeStyles({
    container: {
        backgroundColor: "#E7ECEF",
        borderRadius: "10px",
        marginTop: "5vh",
        padding: "1rem",
        paddingTop: 0,
        height: "30vh",
        width: "20vw",
        display: "grid",
        rowGap: 0,
        textAlign: "left",
        paddingLeft: "1rem",
    },
    active: {
        margin: 0,
        padding: 0,
        fontWeight: "bold",
    },
});

const categories =    
    {"ACAD" : "Academic",
    "NON-ACAD" : "Non-Academic"};

export default function Category(props) {
    const classes = useStyles();
    const styles = useFirebaseBtnStyles();
    return (
        <div className={classes.container}>
            <CategoryProvider>
                <CategoryTitle>Categories</CategoryTitle>
                {Object.entries(categories).map(([key, value]) => {
                    return (
                        <CategoryItem
                            className={
                                props.key == key
                                    ? classes.active
                                    : null
                            }
                            onClick={() => props.setCategory(key)}
                            style={{ cursor: "pointer" }}
                        >
                            {value}
                        </CategoryItem>
                    );
                })}
                <Button
                    style={{ marginTop: "1.5rem", width: "95%" }}
                    classes={styles}
                    variant={"contained"}
                    color={"primary"}
                    onClick={() =>
                        props.handleFilter(props.category)
                    }
                >
                    Filter
                </Button>
            </CategoryProvider>
        </div>
    );
}


