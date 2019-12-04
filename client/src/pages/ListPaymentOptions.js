import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

function ListPaymentOptions(props) {

    return (
        <div>
            <ListItem button onClick={e => props.setStripePage("profile")}>
                <ListItemIcon>
                    <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={e => props.setStripePage("creditCard")}>
                <ListItemIcon>
                    <CreditCardIcon />
                </ListItemIcon>
                <ListItemText primary="Contest Owner Payments" />
            </ListItem>
            <ListItem button onClick={e => props.setStripePage("transfer")}>
                <ListItemIcon>
                    <AccountBalanceIcon />
                </ListItemIcon>
                <ListItemText primary="Tattoo Artist Transfers" />
            </ListItem>
            <ListItem button onClick={e => props.setStripePage("history")}>
                <ListItemIcon>
                    <AttachMoneyIcon />
                </ListItemIcon>
                <ListItemText primary="Transaction History" />
            </ListItem>
        </div>
    );
}

export default ListPaymentOptions;