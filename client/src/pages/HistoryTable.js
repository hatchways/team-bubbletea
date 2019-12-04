import React from 'react';
import { makeStyles, Typography } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
});



function HistoryTable(props) {

    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Table className={classes.table} aria-label="history table">
                <TableHead>
                    <TableRow>
                        <TableCell>Contest ID</TableCell>
                        <TableCell align="right">Prize</TableCell>
                        {props.transactionType === "payment" && <TableCell align="right"></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.history && props.history.map(transaction => (
                        <TableRow key={transaction['contest_id']}>
                            <TableCell component="th" scope="row">
                                {transaction['contest_id']}
                            </TableCell>
                            <TableCell align="right">{transaction["amount"]}</TableCell>
                            {props.transactionType === "payment" && <TableCell align="right">
                                <Button color="primary" onClick={e => props.refundPayment(transaction["id"])}>
                                    Request Refund
                                </Button>
                            </TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default HistoryTable;