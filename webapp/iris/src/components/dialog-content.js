import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

/**
 * Function to declare dialog box 
 */
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

/**
 * Function to set the title of the dialog box
 * @param {*} props 
 * @returns 
 */
const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs(props) {

  const handleClose = () => {
    const closeHandler = props.closeHandle;
    console.log(props.content);
    closeHandler(false);
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Caller Vitals
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div>
              <label>Caller Name: </label>
              <label>{props.content.name}</label><br></br>
              <label>Blood Group: </label>
              <label>{props.content.bloodGroup}</label><br></br>
              <label>Height: </label>
              <label>{props.content.height}</label><br></br>
              <label>Weight: </label>
              <label>{props.content.weight}</label><br></br>
              <label>Caller Vitals: </label><br></br>
              <label>Oxygen Level: </label>
              <label>{props.content.vitals?.oxygenLevel}</label><br></br>
              <label>Body Temperature: </label>
              <label>{props.content.vitals?.temperature}</label><br></br>
              <label>Heart Rate: </label>
              <label>{props.content.vitals?.heartRate}</label><br></br>
              <label>Blood Pressure: </label>
              <label>{props.content.vitals?.diastolic}/{props.content.vitals?.systolic}</label>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
