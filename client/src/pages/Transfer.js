import React, { useState } from "react";

var Transfer = function ({ userID }) {

    const [OauthLink, setOauthLink] = useState("#");

    if (OauthLink === "#") {
        (async () => {
            const response = await fetch(`/users/${userID}/payments/oauth`);
            const { Oauth_link: newOauthLink } = await response.json();
            setOauthLink(newOauthLink);
        })();
    }

    return (
        <div>
            <a href={OauthLink} target="_blank">Add/Update Account to Receive Payments</a>;
        </div>
    );
};

export default Transfer;