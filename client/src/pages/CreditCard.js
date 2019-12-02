import React from "react";
import { CardElement, injectStripe } from 'react-stripe-elements';

class CreditCard extends React.Component {

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
                const response = await fetch(`/users/${this.props.userID}/payments/cc/${this.props.setupOrUpdate}`, {
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
                <button>{this.props.setupOrUpdate} card</button>
            </form>
        );
    }
}

export default injectStripe(CreditCard);