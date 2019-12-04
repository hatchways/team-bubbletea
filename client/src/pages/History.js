import React, { useState } from "react";
import HistoryTable from "./HistoryTable"

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
            <HistoryTable history={paymentHistory} refundPayment={refundPayment} transactionType={"payment"} />
            <HistoryTable history={transferHistory} refundPayment={refundPayment} transactionType={"transfer"} />
        </div>
        // <div>
        //     <div>
        //         <h3>Payment History</h3>
        //         <table>
        //             <tbody>
        //                 {
        //                     paymentHistory &&
        //                     paymentHistory.map((payment) =>
        //                         <tr>
        //                             <td>Contest {payment['contest_id']}</td>
        //                             <td>{payment['amount']} Prize</td>
        //                             <td><button type="submit" onClick={() => refundPayment(payment['id'])}>Refund Payment</button></td>
        //                         </tr>
        //                     )
        //                 }
        //             </tbody>
        //         </table>
        //     </div>
        //     <div>
        //         <h3>Transfer History</h3>
        //         <table>
        //             <tbody>
        //                 {
        //                     transferHistory &&
        //                     transferHistory.map((transfer) =>
        //                         <tr>
        //                             <td>Contest {transfer['contest_id']}</td>
        //                             <td>{transfer['amount']} Prize</td>
        //                         </tr>
        //                     )
        //                 }
        //             </tbody>
        //         </table>
        //     </div>
        // </div>
    );
};

export default History;