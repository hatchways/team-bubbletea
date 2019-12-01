import React, { Component, useEffect, useState } from "react";
import { CardElement, injectStripe, Elements, StripeProvider } from 'react-stripe-elements';
import InjectedAddCard from "./AddCard";

import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Route, Link } from "react-router-dom";
import Select from 'react-select'

var Payments = function () {
    let userID = 1;
    let contestID = 3;
    const [clientSecret, setClientSecret] = useState(null);
    const [OauthLink, setOauthLink] = useState("#");
    const [connectCode, setConnectCode] = useState(null);
    const [refundOptions, setRefundOptions] = useState(null);


    if (OauthLink === "#") {
        (async () => {
            const response = await fetch(`/users/${userID}/payments`);
            const { client_secret: newClientSecret, Oauth_link: newOauthLink } = await response.json();
            setClientSecret(newClientSecret);
            setOauthLink(newOauthLink);
        })();
    }



    let connectDiv = <a href="#">Link not available</a>;
    let connectDone = false;
    if (connectCode === null) {
        connectDiv = <a href={OauthLink} target="_blank">Add Account to Receive Payments</a>;

        (async () => {
            const urlParams = await new URLSearchParams(window.location.search);
            setConnectCode(urlParams.get('code'));
        })();

    } else if (connectDone === false) {
        (async () => {
            const response = await fetch(`/users/${userID}/payments/transfers/setup`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: connectCode })
            });
            if (await response) {
                connectDone = true;
                connectDiv = <a href="#">We are done</a>;
            }
        })();
    } else {
        connectDiv = <a href="#">We are done</a>;
    }

    // (async () => {
    //     const response = await fetch(`/users/${userID}/payments/cc/payments`)
    //     setRefundOptions(response.json().map(p => { value: p; label: p }));
    // })();


    function makePayment() {
        (async () => {
            const response = await fetch(`/users/${userID}/payments/cc/pay`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contest_id: contestID, amount: 3300 })
            });
        })();
        (async () => {
            const response = await fetch(`/users/${userID}/payments/transfers/receive`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: 2000 })
            });
        })();
    }

    function refundPayment() {
        (async () => {
            const response = await fetch(`/users/${userID}/payments/cc/refund`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ payment_intent_id: 'pi_1FkzvgCTioA7mNziCEymRDXa' })
            });
        })();
    }

    return (
        <div>
            <div>
                {connectDiv}
            </div>
            <div>
                <StripeProvider apiKey="pk_test_3Ty6VUy1rfVdHm4JSOP1Uo8z00w8r5ooyx">
                    <Elements>
                        <InjectedAddCard clientSecret={clientSecret} userID={userID} setupOrUpdate={"setup"} />
                    </Elements>
                </StripeProvider>
            </div>
            <div>
                <StripeProvider apiKey="pk_test_3Ty6VUy1rfVdHm4JSOP1Uo8z00w8r5ooyx">
                    <Elements>
                        <InjectedAddCard clientSecret={clientSecret} userID={userID} setupOrUpdate={"update"} />
                    </Elements>
                </StripeProvider>
            </div>
            <div>
                <button type="submit" onClick={makePayment}>Make Payment</button>
            </div>
            <div>
                <button type="submit" onClick={refundPayment}>Refund Payment</button>
            </div>
            {/* <form onSubmit={refundPayment}>
                <label>
                    Potential refunds:
                    <Select options={refundOptions} />
                </label>
                <input type="submit" value="Get refund" />
            </form> */}
        </div>
    );
}

export default Payments;