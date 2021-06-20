import React, { useState, useEffect } from "react";

import "./App.css";
import { Switch, Route, withRouter,  useLocation  } from "react-router-dom";
import Home from "./pages/home";
import IntroSection from './components/intro-section';
import SignUp from "./pages/signup";
import Login from "./pages/login";
import Profile from "./pages/profile";
import { useAlert } from "react-alert";
import Navbar from "./components/navbar";
import Forum from './pages/forum';
import PrivateRoute from './components/privateroute';
import PublicRoute from './components/publicroute';
import PostHistory from './pages/posthistory'
function App(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("token") ? true : false
    );
    const [username, setUsername] = useState("");
    const [id, setID] = useState("");
    const [isStaff, setIsStaff] = useState(false);
    const [active, setActive] = useState("");
    const alert = useAlert();


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
                    setID(json.id);
                    setIsStaff(json.is_staff);
                });
        }
    }, [isLoggedIn]);
    const handleRegister = (e, data) => {
        e.preventDefault();
        fetch("http://localhost:8000/server/users/", {
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
        fetch("http://localhost:8000/token-auth/", {
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
                setIsStaff(json.is_staff);
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

    return (
        <div className="App">
           {(props.location.pathname !== '/sign-up' && props.location.pathname !== '/login') && <Navbar
                active={active}
                setActive={setActive}
                isLoggedIn={isLoggedIn}
                username={username}
                handleLogout={handleLogout}
            />}

            {(props.location.pathname == '/') && <IntroSection
                active={active}
                setActive={setActive}
                isLoggedIn={isLoggedIn}
                username={username}
                handleLogout={handleLogout}
            />}     

            <Switch>
                <Route
                    path="/sign-up"
                    render={(props) => (
                    <SignUp {...props} handleRegister={handleRegister} />
                    )}
                />
                <Route
                    path="/login"
                    render={(props) => (
                        <Login {...props} handleLogin={handleLogin} />
                    )}
                />
                                <Route
                    path="/profile"
                    render={(props) => (
                        <Profile
                            {...props}
                            username={username}
                            id={id}
                            isStaff={isStaff}
                        />
                    )}
                />
                <Route
                    path="/forum"
                    render={(props) => (
                        <Forum
                            {...props}
                            username={username}
                            id={id}
                            isStaff={isStaff}
                        />
                    )}
                />
                <Route
                    path="/post"
                    render={(props) => (
                        <PostHistory
                            {...props}
                            username={username}
                            id={id}
                            isStaff={isStaff}
                        />
                    )}
                />
                <Route path='/'  component={Home}/>
            </Switch>
        </div>
    );
}

export default withRouter(App);