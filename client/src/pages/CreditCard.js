import React from "react";
import { CardElement, injectStripe } from 'react-stripe-elements';
import { makeStyles, Typography } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';

class CreditCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            clientSecret: null,
            last4: null,
            brand: null,
            expMonth: null,
            expYear: null,
            ccExists: null,
            ccHeader: null
        };
    }

    componentDidMount() {
        (async () => {
            const response = await fetch(`/users/${this.props.userID}/payments/cc/info`);
            const data = await response.json();
            this.setState({ clientSecret: await data['client_secret'] });
            this.setState({ last4: await data['last4'] });
            this.setState({ brand: await data['brand'] });
            this.setState({ expMonth: await data['exp_month'] });
            this.setState({ expYear: await data['exp_year'] });
            this.setState({ ccExists: await this.state.last4 ? true : false });
        })();
    }

    handleSubmit = async (ev) => {

        ev.preventDefault();

        const cardElement = this.props.elements.getElement('card');

        const { setupIntent, error } = await this.props.stripe.confirmCardSetup(this.state.clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });


        if (error) {
            console.log('ERROR IN CONFIRM CARD SETUP')
        } else {
            if (setupIntent.status === 'succeeded') {
                const response = await fetch(`/users/${this.props.userID}/payments/cc/${this.state.ccExists ? 'update' : 'setup'}`, {
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

    style = {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };

    render() {
        return (
            <div>
                <div>
                    <Typography variant="h6" component="h6">
                        By adding your credit card information, you are authorizing Tattoo Art <br />
                        to charge this card whenever you create a contest.  The charge will be in <br />
                        the amount of the contest prize.
                </Typography>

                </div>
                {this.state.clientSecret &&
                    <div>
                        <List>
                            <ListItem>
                                <ListItemText primary="Credit card details" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Card number: **** **** **** ${this.state.last4}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Brand: ${this.state.brand}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Expiration ${this.state.expMonth} / ${this.state.expYear}`} />
                            </ListItem>
                        </List>
                    </div>}
                <form onSubmit={this.handleSubmit} id="payment-form">
                    <div className="form-row">
                        <label htmlFor="card-element">
                            Credit or debit card
                    </label>
                        <div id="card-element">
                            <CardElement style={this.style} />
                        </div>
                        <div id="card-errors" role="alert"></div>
                        <div>
                            <Button color="inherit">
                                {this.state.ccExists ? 'Update' : 'Add'} credit card
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

        );
    }
}

export default injectStripe(CreditCard);