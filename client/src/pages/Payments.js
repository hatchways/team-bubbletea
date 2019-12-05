import React, { useState } from "react";
import { Elements, StripeProvider } from 'react-stripe-elements';
import InjectedCreditCard from "./CreditCard";
import History from "./History";
import Transfer from "./Transfer";
import ListPaymentOptions from "./ListPaymentOptions"
import { Header } from './Header';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Grid, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';


const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
}));

var Payments = function () {
    const classes = useStyles();

    const [stripePage, setStripePage] = useState(null);
    const stripePublishableKey = "pk_test_3Ty6VUy1rfVdHm4JSOP1Uo8z00w8r5ooyx"

    let userID = 1;

    return (
        <div>
            <Header />
            <Grid container component="main" className={classes.root}>
                <CssBaseline />
                <Grid item xs={3} sm={3} md={3} >
                    <ListPaymentOptions setStripePage={setStripePage} />
                </Grid>
                <Grid item xs={9} sm={9} md={9} component={Paper} elevation={6} square>
                    <div className={classes.paper}>
                        {stripePage === 'creditCard' &&
                            <StripeProvider apiKey={stripePublishableKey}>
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