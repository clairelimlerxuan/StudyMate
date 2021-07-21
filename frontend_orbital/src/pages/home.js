import React, { useState } from "react";
import Navbar  from '../components/navbar'; 
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'; 
import '../App.css';
import Forum from './forum';
import IntroSection from "../components/intro-section";
import Card from '../components/card';
import Footer from '../components/footer';
function Home(props) {
    return (
        !props.isStaff ?(
        <>
            <IntroSection/>
            <Card/>
            <Footer/>
        </>
        ) : (
            <Forum/>
        )
    );
}

export default Home;