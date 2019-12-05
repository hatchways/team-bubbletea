import React, { useState } from "react";
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';


var Transfer = function ({ userID }) {

    const [OauthLink, setOauthLink] = useState("#");
    const [stripeAccount, setStripeAccount] = useState(null);

    if (OauthLink === "#") {
        (async () => {
            const response = await fetch(`/users/${userID}/payments/transfers/info`);
            const { Oauth_link: newOauthLink, stripe_acct: newStripeAccount } = await response.json();
            setOauthLink(newOauthLink);
            setStripeAccount(newStripeAccount);
        })();
    }

    return (
        <Grid container direction="column" spacing={3}>
            <Grid item>
                <Typography variant="h4" component="h4">Use Stripe Connect Account to Receive Transfers</Typography>
            </Grid>
            <Grid item>
                {stripeAccount &&
                    <Button color="inherit" variant="outlined" href="https://dashboard.stripe.com/dashboard">
                        Go to My Account
                    </Button>}
                {!stripeAccount &&
                    <Typography variant="h6" component="h6">You do not currently have an account</Typography>}
            </Grid>
            <Grid item>
                <Button color="inherit" variant="outlined" href={OauthLink}>
                    {stripeAccount ? "Change to a new Stripe Connect account" : "Add a Stripe Connect account"}
                </Button>
            </Grid>
        </Grid>
    );
};

export default Transfer;