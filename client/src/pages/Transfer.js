import React, { useState } from "react";

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
        <div>
            <div>
                <h3>{accountHeader}</h3>;
            </div>
            <div>
                <a href={OauthLink} target="_blank">Add/Update Account to Receive Payments</a>;
            </div>
        </div>
    );
};

export default Transfer;