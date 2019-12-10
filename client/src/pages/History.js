import React, { useState } from "react";
import HistoryTable from "./HistoryTable"
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";

var History = function ({ userID }) {

    const [paymentHistory, setPaymentHistory] = useState(null);
    const [transferHistory, setTransferHistory] = useState(null);

    function refundPayment(payment_intent_id) {
        (async () => {
            const response = await fetch(`/users/${userID}/payments/cc/refund`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ payment_intent_id: payment_intent_id })
            });
        })();
    }

    if (!paymentHistory) {
        (async () => {
            const response = await fetch(`/users/${userID}/payments/cc/history`);
            setPaymentHistory(await response.json());
        })();
    }

    if (!transferHistory) {
        (async () => {
            const response = await fetch(`/users/${userID}/payments/transfers/history`);
            setTransferHistory(await response.json());
        })();
    }

    return (
        <Grid container spacing={6}>
            <Grid item>
                <Typography variant="h6" component="h6">Payments as a Contest Owner</Typography>
                <HistoryTable history={paymentHistory} refundPayment={refundPayment} transactionType={"payment"} />
            </Grid>
            <Grid item>
                <Typography variant="h6" component="h6">Transfers Received as Contest Winner</Typography>
                <HistoryTable history={transferHistory} refundPayment={refundPayment} transactionType={"transfer"} />
            </Grid>
        </Grid>
    );
};

export default History;