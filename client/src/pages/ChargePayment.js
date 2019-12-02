import React from "react";

var ChargePayment = function ({ userID }) {

    function makePayment() {
        (async () => {
            const response = await fetch(`/users/${userID}/payments/cc/pay`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contest_id: 3, amount: 3300 })
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

    return (
        <div>
            <button type="submit" onClick={makePayment}>Make Payment</button>
        </div>
    )
}

export default ChargePayment;