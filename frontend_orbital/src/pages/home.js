import React, { useState } from "react";
import Navbar  from '../components/navbar'; 
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'; 
import '../App.css';

import Card from '../components/card';
import Footer from '../components/footer';
function Home() {
    return (
        <>
            <Card/>
            <Footer/>
        </>
    );
}

export default Home;