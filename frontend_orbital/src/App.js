import React, { useState, useEffect } from "react";

import "./App.css";
import { Switch, Route, withRouter } from "react-router-dom";
import Home from "./pages/home";

import SignUp from "./pages/signup";
import Login from "./pages/login";

import { useAlert } from "react-alert";
import Navbar from "./components/navbar";


function App(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("token") ? true : false
    );
    const [username, setUsername] = useState("");
    const [id, setID] = useState("");
    const [active, setActive] = useState("");
    const alert = useAlert();
    // console.log("isloggedin " + isLoggedIn);
    // console.log("username " + username);

    useEffect(() => {
        if (isLoggedIn) {
            fetch("http://localhost:3000/current_user/", {
                headers: {
                    Authorization: `JWT ${localStorage.getItem("token")}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    setUsername(json.username);
                    setID(json.id);
                });
        }
    }, [isLoggedIn]);
/*
    const handleRegister = (e, data) => {
        e.preventDefault();
        fetch("http://localhost:3000/api/users/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                console.log(res);
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error("Error");
                }
            })
            .then((json) => {
                localStorage.setItem("token", json.token);
                props.history.push("/login");
            })
            .catch((error) => {
                alert.show("That Username Already Exists");
            });
    };

    const handleLogin = (e, data) => {
        console.log(data);
        e.preventDefault();
        fetch("http://localhost:3000/token-auth/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error("Error");
                }
            })
            .then((json) => {
                localStorage.setItem("token", json.token);
                setIsLoggedIn(true);
                setUsername(json.user.username);
                setID(json.user.id);
                props.history.push("/");
            })
            .catch((error) => alert.show("Wrong Username or Password"));
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUsername("");
        alert.show("Logged Out");
    };
*/
    return (
        <div className="App">

            <Switch>
                <Route
                    path="/sign-up"
                   component={SignUp}
                />
                <Route
                    path="/login"
                    component={Login}
                />

              
                <Route path="/" component={Home} />
            </Switch>
        </div>
    );
}

export default withRouter(App);