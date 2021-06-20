import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import Collapse from '@material-ui/core/Collapse';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';




const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  },
}));

export default function DescriptionAlerts(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleOpen = () => {
    setOpen(true);
};

const handleClose = () => {
    setOpen(false);
};

  return (
  <div className={classes.root}>
          <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className={classes.paper}>
          <Collapse in={open}>
        <Alert severity="warning" onClose={() => {setOpen(false);}} color="info">
            <AlertTitle>Warning</AlertTitle>
                Only registered user that can proceed further — <strong>Please sign in</strong>
          </Alert>
    </Collapse>
    </div>
      </Modal>
  </div>
  );
  }
