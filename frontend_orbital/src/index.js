import React from "react";
import { Router } from "react-router-dom";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { createBrowserHistory } from "history";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import axios from 'axios';


const theme = createMuiTheme({
    palette: {
        primary: {
            main:  "#3B3530",
            contrastText: "#fff",
        },
        secondary: {
            main: "#CEC4BB",
            contrastText: "#000",
        },
        text: {
            primary: "#4E3A35",
            secondary: "#564B48",
        },
    },
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
    },
});

const options = {
    // you can also just use 'bottom center'
    position: positions.TOP_CENTER,
    timeout: 5000,
    offset: "80px",
    // you can also just use 'scale'
    transition: transitions.SCALE,
    type: "error",
};

let history = createBrowserHistory();

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Router history={history}>
                <AlertProvider template={AlertTemplate} {...options}>
                    <App />
                </AlertProvider>
            </Router>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
);