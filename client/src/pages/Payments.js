import React, { Component } from "react";

import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Route, Link } from "react-router-dom";

export default class Payments extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.addCCData = this.addCCData.bind(this)
    }

    componentDidMount() {
        this.setState({ userID: 1 });
        fetch(`/users/${1}/payments`).then(response =>
            response.json().then(data => {
                this.setState({ clientSecret: data.clientSecret, OauthLink: data.OauthLink });
            })
        )
    }


    addCCData() {
        var stripe = window.Stripe('pk_test_3Ty6VUy1rfVdHm4JSOP1Uo8z00w8r5ooyx');

        var elements = stripe.elements();
        var cardElement = elements.create('card');
        cardElement.mount('#card-element');

        var cardholderName = document.getElementById('cardholder-name');
        var cardButton = document.getElementById('card-button');
        var clientSecret = cardButton.dataset.secret;

        // set correctly
        var userID = 1

        cardButton.addEventListener('click', function (ev) {

            stripe.confirmCardSetup(
                clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: { name: cardholderName.value }
                    }
                }
            ).then(function (result) {
                if (result.error) {
                    // Display error.message in your UI.
                } else {
                    // The setup has succeeded. Display a success message.
                    fetch(`/users/${this.state.userID}/payments/cc/setup`, {
                        method: 'POST',
                        body: JSON.stringify({ 'payment_method_id': result.setupIntent.payment_method })
                    })
                }
            });
        });

    }

    render() {
        return (
            <div>
                <div>
                    <a href={this.state.OauthLink}>Add Account to Receive Payments</a>
                </div>
                <div>
                    <button type="submit" onClick={this.addCCData}>Add Credit Card to Make Payments</button>
                    <input id="cardholder-name" type="text" />
                    <div id="card-element"></div>
                    <button id="card-button" data-secret="{{ client_secret }}">Save Card</button>
                </div>
            </div>
        )
    }
}