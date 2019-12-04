import React, { useState } from "react";
import { Elements, StripeProvider } from 'react-stripe-elements';
import InjectedCreditCard from "./CreditCard";
import History from "./History";
import Transfer from "./Transfer";
import ListPaymentOptions from "./ListPaymentOptions"
import List from '@material-ui/core/List';
import { Header } from './Header';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Grid, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';


const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

var Payments = function () {
    const classes = useStyles();

    const [stripePage, setStripePage] = useState(null);

    let userID = 1;

    return (
        <div>
            <Header />
            <Grid container component="main" className={classes.root}>
                <CssBaseline />
                <Grid item xs={3} sm={3} md={3} >
                    <List><ListPaymentOptions setStripePage={setStripePage} /></List>
                </Grid>
                <Grid item xs={9} sm={9} md={9} component={Paper} elevation={6} square>
                    <div className={classes.paper}>
                        {stripePage === 'creditCard' &&
                            <StripeProvider apiKey="pk_test_3Ty6VUy1rfVdHm4JSOP1Uo8z00w8r5ooyx">
                                <Elements>
                                    <InjectedCreditCard userID={userID} />
                                </Elements>
                            </StripeProvider>
                        }
                        {stripePage === 'transfer' && <Transfer userID={userID} />}
                        {stripePage === 'history' && <History userID={userID} />}
                        {stripePage === 'profile' && <Typography>Profile</Typography>}
                    </div>
                </Grid>
            </Grid>
        </div >
    );
}

export default Payments;