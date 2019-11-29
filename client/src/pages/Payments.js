import React, { Component, useEffect, useState } from "react";
import { CardElement, injectStripe, Elements, StripeProvider } from 'react-stripe-elements';
import InjectedAddCard from "./AddCard";

import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Route, Link } from "react-router-dom";

var Payments = function () {
    var userID = 1;
    const [clientSecret, setClientSecret] = useState("");
    const [OauthLink, setOauthLink] = useState("");

    (async () => {
        const response = await fetch(`/users/${userID}/payments`);
        const { client_secret: newClientSecret, Oauth_link: newOauthLink } = await response.json();
        setClientSecret(newClientSecret);
        setOauthLink(newOauthLink);
    })();

    return (
        <div>
            <div>
                <a href={OauthLink}>Add Account to Receive Payments</a>
            </div>
            <div>
                <StripeProvider apiKey="pk_test_3Ty6VUy1rfVdHm4JSOP1Uo8z00w8r5ooyx">
                    <Elements>
                        <InjectedAddCard clientSecret={clientSecret} userID={userID} />
                    </Elements>
                </StripeProvider>
            </div>
        </div>
    );
}

export default Payments;