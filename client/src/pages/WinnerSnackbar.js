import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles({
    close: {
        padding: theme.spacing(0.5),
    },
});



function WinnerSnackbar(props) {

    const classes = useStyles();

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Success! Winner Declared</span>}
                action={
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        className={classes.close}
                        onClick={this.props.closeWinnerMsg}
                    >
                        <CloseIcon />
                    </IconButton>
                }
            />
        </div>
    );
}

export default WinnerSnackbar;