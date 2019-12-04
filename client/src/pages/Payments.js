import React, { useState } from "react";
import { Elements, StripeProvider } from 'react-stripe-elements';
import InjectedCreditCard from "./CreditCard";
import ChargePayment from "./ChargePayment";
import Transfer from "./Transfer";
import Refund from "./Refund";

var Payments = function () {
    let userID = 1;
    const [stripePage, setStripePage] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);

    if (!clientSecret) {
        (async () => {
            const response = await fetch(`/users/${userID}/payments/secret`);
            const { client_secret: newClientSecret } = await response.json();
            setClientSecret(newClientSecret);
        })();
    }

    function changeStripePage(event) {
        setStripePage(event.target.value);
    }

    const optionsMenu = (
        <div>
            <select onChange={changeStripePage}>
                <option value="none">---</option>
                <option value="creditCard">Add or update my credit card information</option>
                <option value="chargePayment">Make a payment</option>
                <option value="transfer">Set up my bank account to receive transfers</option>
                <option value="refund">Claim a refund</option>
            </select>
        </div >
    )

    const creditCardPage = (
        <div>
            <div>
                <StripeProvider apiKey="pk_test_3Ty6VUy1rfVdHm4JSOP1Uo8z00w8r5ooyx">
                    <Elements>
                        <InjectedCreditCard key={1} clientSecret={clientSecret} userID={userID} setupOrUpdate={"setup"} />
                    </Elements>
                </StripeProvider>
            </div>
            <div>
                <StripeProvider apiKey="pk_test_3Ty6VUy1rfVdHm4JSOP1Uo8z00w8r5ooyx">
                    <Elements>
                        <InjectedCreditCard key={2} clientSecret={clientSecret} userID={userID} setupOrUpdate={"update"} />
                    </Elements>
                </StripeProvider>
            </div>
        </div>
    );

    return (
        {optionsMenu} 
        {stripePage === 'creditCard' && ({creditCardPage})}
        {stripePage === 'transfer' && (<Transfer userId={userId}>)}
        {stripePage === 'chargePayment' && <ChargePayment userID={userID} />}
        {stripePage === 'refund' && <Refund userID={userID} />}
    )
}

export default Payments;
