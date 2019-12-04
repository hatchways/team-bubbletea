import React, { useState } from "react";

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
        <div>
            <div>
                <h3>Payment History</h3>
                <table>
                    {
                        paymentHistory &&
                        paymentHistory.map((payment) =>
                            <tr>
                                <td>Contest {payment['contest_id']}</td>
                                <td>{payment['amount']} Prize</td>
                                <td><button type="submit" onClick={() => refundPayment(payment['id'])}>Refund Payment</button></td>
                            </tr>
                        )
                    }
                </table>
            </div>
            <div>
                <h3>Transfer History</h3>
                <table>
                    {
                        transferHistory &&
                        transferHistory.map((transfer) =>
                            <tr>
                                <td>Contest {transfer['contest_id']}</td>
                                <td>{transfer['amount']} Prize</td>
                            </tr>
                        )
                    }
                </table>
            </div>
        </div>
    );
};

export default History;