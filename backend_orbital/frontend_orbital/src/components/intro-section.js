import React from 'react';
import '../App.css';
import { Button } from './button';
import './intro-section.css';
import {Link} from 'react-router-dom';
import Books from '../images/books.mp4';

function IntroSection(props) {
  return (
    (!props.isLoggedIn ? (
    <div className='hero-container'>
        <video src={Books} autoPlay loop muted ></video>
        <h1>Welcome to Study Mate</h1>
        <p>Make your study life easier to manage with us</p>
        <div className='hero-btns'>
          <Link className='hero-start' to='/login'>
            <Button
              className='btns'
              buttonStyle='btn--outline'
              buttonSize='btn--large'
            >
              GET STARTED
            </Button>
            </Link>
        </div>
      </div> ) : (
            <div className='hero-container'>
            <video src={Books} autoPlay loop muted ></video>
            <h1>Welcome, {props.username}!</h1>
            <p>Make your study life easier to manage with us</p>
          </div> 
      )
    ));
  }

export default IntroSection;