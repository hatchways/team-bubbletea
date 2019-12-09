import React from "react";
import { CardElement, injectStripe } from 'react-stripe-elements';
import { makeStyles, Typography } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import { Grid } from "@material-ui/core";

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
            this.setState({
                clientSecret: data['client_secret'],
                last4: data['last4'],
                brand: data['brand'],
                expMonth: data['exp_month'],
                expYear: data['exp_year'],
                ccExists: data['last4'] ? true : false
            });
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
            console.log('Error occurred when confirming card details')
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
            <Grid container spacing={6}>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Typography variant="h6" component="h6">
                        By adding your credit card information, you are authorizing Tattoo Art
                        to charge this card each time you declare a contest winner.  The charge will
                        be in the amount of the contest prize.
                    </Typography>
                </Grid>
                {this.state.clientSecret &&
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Typography variant="h6" component="h6">
                            Current Card Details
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary={`Card number: **** **** **** ${this.state.last4}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Expiration: ${this.state.expMonth} / ${this.state.expYear}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Brand: ${this.state.brand
                                    && this.state.brand[0].toUpperCase() + this.state.brand.slice(1)}`} />
                            </ListItem>
                        </List>
                    </Grid>}
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <form onSubmit={this.handleSubmit} id="payment-form">
                        <Grid container spacing={3} direction="column" className="form-row">
                            <Grid item>
                                <Typography variant="h6" component="h6">
                                    Enter your credit card details:
                                </Typography>
                            </Grid>

                            <Grid item id="card-element">
                                <CardElement style={this.style} />
                            </Grid>
                            <Grid item id="card-errors" role="alert"></Grid>
                            <Grid item>
                                <Button color="inherit" variant="outlined" type="submit">
                                    {this.state.ccExists ? 'Update' : 'Add'} credit card
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>

        );
    }
}

export default injectStripe(CreditCard);