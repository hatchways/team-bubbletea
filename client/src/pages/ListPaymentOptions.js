import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';

function ListPaymentOptions(props) {

    return (
        <div>
            <ListItem button onClick={e => props.setStripePage("summary")}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Account Summary" />
            </ListItem>
            <ListItem button onClick={e => props.setStripePage("creditCard")}>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Contest Owner Payments" />
            </ListItem>
            <ListItem button onClick={e => props.setStripePage("transfer")}>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Tattoo Artist Transfers" />
            </ListItem>
            <ListItem button onClick={e => props.setStripePage("history")}>
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Transaction History" />
            </ListItem>
        </div>
    );
}

export default ListPaymentOptions;