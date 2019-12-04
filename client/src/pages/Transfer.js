import React, { useState } from "react";
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';

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

    const accountHeader = stripeAccount ? `Stripe Connect Account: ${stripeAccount}` : 'No account added yet';

    return (
        <Grid direction="column">
            <Grid item>
                <Button color="primary" href="https://dashboard.stripe.com/dashboard">
                    Go to My Account
                </Button>
            </Grid>
            <Grid item>
                <Button color="primary" href={OauthLink}>
                    {stripeAccount ? "Update" : "Add"} Account to Receive Payments
                </Button>
            </Grid>
        </Grid>
    );
};

export default Transfer;