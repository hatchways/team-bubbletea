import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    close: {
        padding: theme.spacing(0.5),
    },
}));




function WinnerSnackbar(props) {

    const classes = useStyles();

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={props.winnerMsg}
                autoHideDuration={6000}
                onClose={props.closeWinnerMsg}
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
                        onClick={props.closeWinnerMsg}
                    >
                        <CloseIcon />
                    </IconButton>
                }
            />
        </div>
    );
}

export default WinnerSnackbar;