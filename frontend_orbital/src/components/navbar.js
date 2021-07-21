
import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Link } from 'react-router-dom';
import './navbar.css';
import Dropdown from './dropdown';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function Navbar(props) {

  const [click, setClick] = React.useState(false);
  const [dropdown, setDropdown] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const onMouseEnter = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(true);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(false);
    }
  };

  const extendElement = () => {
    dropdown ? setDropdown(false) : setDropdown(true);
  }

  useEffect(() => {
    onMouseEnter();
  }, []);

  window.addEventListener('resize', onMouseEnter);

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
              className='nav-links'
              onClick={() => {closeMobileMenu(); handleOpen()}}
            >
              Schedules
            </Link>
            <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
        <DialogTitle id="alert-dialog-title">{"Please Log In to See Your Schedule"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
        </Dialog>
            </li>
            <li className='nav-item'>
            <Link
              to='/todolist'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              To Do List
            </Link>
            </li>
            <li>
            {dropdown ? (
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
  ) :(
    !props.isStaff ? (
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
              to='/todolist'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              To Do List
            </Link>
          </li>
          <li className='nav-links-mobile'  onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave} onClick={extendElement}>
              <Button buttonStyle='primary' class="dropbtn">
                Hi, {props.username}!
                <i class="fa fa-caret-down"></i>
              </Button>
              {dropdown && <Dropdown  
onCloseMobileMenu={closeMobileMenu}/>}
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
      <li className='nav-links-mobile'  onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave} onClick={extendElement}>
              <Button buttonStyle='primary' class="dropbtn">
                Hi, {props.username}!
                <i class="fa fa-caret-down"></i>
              </Button>
              {dropdown && <Dropdown  
onCloseMobileMenu={closeMobileMenu}/>}
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
  )));
}

export default Navbar;