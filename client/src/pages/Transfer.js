import React, { useState } from "react";

var Transfer = function ({ userID }) {

    const [OauthLink, setOauthLink] = useState("#");
    const [connectCode, setConnectCode] = useState(null);


    if (OauthLink === "#") {
        (async () => {
            const response = await fetch(`/users/${userID}/payments/oauth`);
            const { Oauth_link: newOauthLink } = await response.json();
            setOauthLink(newOauthLink);
        })();
    }

    let connectDiv = <a href="#">Link not available</a>;
    let connectDone = false;
    if (connectCode === null) {
        connectDiv = <a href={OauthLink} target="_blank">Add Account to Receive Payments</a>;

        (async () => {
            const urlParams = await new URLSearchParams(window.location.search);
            setConnectCode(urlParams.get('code'));
        })();

    } else if (connectDone === false) {
        (async () => {
            const response = await fetch(`/users/${userID}/payments/transfers/setup`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: connectCode })
            });
            if (await response) {
                connectDone = true;
                connectDiv = <a href="#">We are done</a>;
            }
        })();
    } else {
        connectDiv = <a href="#">We are done</a>;
    }

    return (
        <div>
            {connectDiv}
        </div>
    );
};

export default Transfer;