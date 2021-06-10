import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function DescriptionAlerts(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  return (
  <div className={classes.root}>
    <Collapse in={open}>
        <Alert severity="warning" onClose={() => {setOpen(false);}} color="info">
            <AlertTitle>Warning</AlertTitle>
                Only registered user that can proceed further — <strong>Please sign in</strong>
          </Alert>
    </Collapse>
  </div>
  );
  }
