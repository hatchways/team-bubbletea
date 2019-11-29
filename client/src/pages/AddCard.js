import React, { Component, useEffect, useState } from "react";
import { CardElement, injectStripe, Elements } from 'react-stripe-elements';

import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Route, Link } from "react-router-dom";

class AddCard extends React.Component {

    handleSubmit = async (ev) => {

        ev.preventDefault();

        const cardElement = this.props.elements.getElement('card');

        const { setupIntent, error } = await this.props.stripe.confirmCardSetup(this.props.clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });


        if (error) {
            console.log('ERROR IN CONFIRM CARD SETUP')
        } else {
            if (setupIntent.status === 'succeeded') {
                const response = await fetch(`/users/${this.props.userID}/payments/cc/setup`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ payment_method_id: setupIntent.payment_method })
                });
                console.log(await response.json());
            }
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Card details
                    <CardElement style={{ base: { fontSize: '18px' } }} />
                </label>
                <button>Add card</button>
            </form>
        );
    }
}

export default injectStripe(AddCard);