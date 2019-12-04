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
import { LocationOn } from '@material-ui/icons';


const useStyles = makeStyles(theme => ({

}));

var Payments = function () {
    const classes = useStyles();

    const [stripePage, setStripePage] = useState(null);

    let userID = 1;

    return (
        <div>
            <Header />
            <Grid container direction="row" item xs={6} md={6} lg={6} justify="center" alignItems="baseline" >
                <List><ListPaymentOptions setStripePage={setStripePage} /></List>
                <Grid item>
                    {stripePage === 'creditCard' &&
                        <StripeProvider apiKey="pk_test_3Ty6VUy1rfVdHm4JSOP1Uo8z00w8r5ooyx">
                            <Elements>
                                <InjectedCreditCard userID={userID} />
                            </Elements>
                        </StripeProvider>
                    }
                    {stripePage === 'transfer' && <Transfer userID={userID} />}
                    {stripePage === 'history' && <History userID={userID} />}
                    {stripePage === 'summary' && <h3>Account Summary</h3>}
                </Grid>
            </Grid>
        </div>
    );
}

export default Payments;