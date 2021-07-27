import React, { useState } from 'react';
import './dropdown.css';
import { Link } from 'react-router-dom';
import { MenuItems } from './menuitems';
import { Badge } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { ClassNames } from '@emotion/react';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { typography } from '@material-ui/system';


function Dropdown(props) {
  const [click, setClick] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setClick(true)
  };

  const handleOpen = () => {
    setOpen(true);
    console.log(open ? "H" : "T")
  };

  const handleCloseModal = () => {
    setOpen(false)
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ul
        onClick={props.onCloseMobileMenu}
        className={click ? 'dropdown-menu clicked' : 'dropdown-menu'}
      >
        {MenuItems.map((item, index) => {
          return (
            <li key={index}>
                    <Link
                    className={item.cName}
                    to={item.path}
                    onClick={()=>setClick(false)}
                  >
                  <Typography>{item.title}</Typography>
                  </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default Dropdown;