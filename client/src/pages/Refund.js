import React from "react";

var Refund = function ({ userID }) {

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
            <button type="submit" onClick={refundPayment}>Refund Payment</button>
        </div>
    );
};

export default Refund;

