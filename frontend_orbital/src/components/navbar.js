
import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Link } from 'react-router-dom';
import './navbar.css';

function Navbar(props) {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    !props.isLoggedIn ? (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            StudyMate
            <i class='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
            <Link
              to='/forum'
              className='nav-links'
              onClick={closeMobileMenu}
            >
             Q&A Forum
            </Link>
          </li>
            <li className='nav-item'>
            <Link
              to='/schedules'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              Schedules
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='/assignment-exam'
              className='nav-links'
              onClick={closeMobileMenu}
            >
             Assignments & Exams
            </Link>
          </li>
            <li>
            {button ? (
                  <Link to='/login' className='nav-links-mobile'>
                    <Button buttonStyle='btn--outline'>Login</Button>
                  </Link>
                ) : (
                  <Link to='/login' className='nav-links-mobile'>
                    <Button
                      buttonStyle='btn--outline'
                      buttonSize='btn--mobile'
                      onClick={closeMobileMenu}
                    >Login
                        </Button>
                        </Link>)}
            </li>
          </ul>
        </div>
      </nav>
    </>
  ) : (
    <>
    <nav className='navbar'>
      <div className='navbar-container'>
        <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
          StudyMate
          <i class='fab fa-typo3' />
        </Link>
        <div className='menu-icon' onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className='nav-item'>
            <Link to='/' className='nav-links' onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='/schedules'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              Schedules
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='/assignment-exam'
              className='nav-links'
              onClick={closeMobileMenu}
            >
             Assignments & Exams
            </Link>
          </li>
          <li>
            <Link  className='nav-links-mobile' 
                                    to="/profile"
                                    style={{
                                        textDecoration: "none",
                                    }}
                                >
                                    <Button buttonStyle='primary'>
                                        {props.username}
                                    </Button>
                                </Link>
          </li>
          <li>
            <Link
              to='/'
              className='nav-links-mobile'
              onClick={(() => props.handleLogout())}
            >
              <Button buttonStyle='btn--outline'>Log Out</Button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  </>
  ));
}

export default Navbar;