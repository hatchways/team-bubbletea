import React, { useState } from "react";
import { Elements, StripeProvider } from 'react-stripe-elements';
import InjectedCreditCard from "./CreditCard";
import History from "./History";
import Transfer from "./Transfer";
import { Header } from './Header';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Grid, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { LocationOn } from '@material-ui/icons';


const useStyles = makeStyles(theme => ({
    root: {
        "padding-bottom": "1%",
        "padding-top": "0.5%",
        "box-shadow": null,
    },
    nav: {
        "margin-left": "25%",
        "margin-right": "25%",
        display: "flex"
    },
    info: {
        "margin-left": "25%",
        "margin-right": "25%",
    },
}));

var Payments = function () {
    const classes = useStyles();

    const [stripePage, setStripePage] = useState(null);

    let userID = 1;

    return (
        <div>
            <Header />
            <Grid container justify="center">
                <Grid item xs={9} md={7} lg={12} className={classes.root}>
                    <Paper className={classes.nav}>
                        <BottomNavigation
                            value={stripePage}
                            onChange={(event, newValue) => {
                                setStripePage(newValue);
                            }}
                            showLabels
                            className={classes.root}
                        >
                            <BottomNavigationAction value='summary' label="Summary" icon={<LocationOn />} />
                            <BottomNavigationAction value='creditCard' label="Credit Card" icon={<LocationOn />} />
                            <BottomNavigationAction value='transfer' label="Bank Account" icon={<LocationOn />} />
                            <BottomNavigationAction value='history' label="View Payment/Transfer History" icon={<LocationOn />} />
                        </BottomNavigation>
                    </Paper>
                </Grid>
                <Grid item xs={9} md={7} lg={12} className={classes.info}>
                    {stripePage === 'creditCard' &&
                        <div>
                            <StripeProvider apiKey="pk_test_3Ty6VUy1rfVdHm4JSOP1Uo8z00w8r5ooyx">
                                <Elements>
                                    <InjectedCreditCard userID={userID} />
                                </Elements>
                            </StripeProvider>
                        </div>}
                    {stripePage === 'transfer' && <Transfer userID={userID} />}
                    {stripePage === 'history' && <History userID={userID} />}
                    {stripePage === 'summary' && <h3>Account Summary</h3>}
                </Grid>
            </Grid>
        </div>
    );
}

export default Payments;