import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';
import uploadImage from "./uploadimage.png";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: "10%",
    "padding-bottom": "5%",
    "padding-top": "5%",
    "box-shadow" : 
    "0px 2px 5px 1px rgba(209, 209, 209, 0.9), 0px 2px 5px -1px rgba(209, 209, 209, 0.9), 0px 1px 5px 0px rgba(209, 209, 209, 0.9), 0px 1px 5px 0px rgba(209, 209, 209, 0.9)", 
  },
  position: {
    "margin-right": "2%",
    "margin-left" : "2%", 
    "margin-top" : "30px",
  },
  header: {
    "margin-bottom" : "30px",
  },
  subheader: {
    "margin-top" : "2px",
  },
  subtitle: {
      "color" : theme.default,
      "margin-top" : "1%"
  }
}));

export function UploadPaper(props) {
  const classes = useStyles();

  return (
  <Grid container justify="center">
    <Grid item xs={9} md={7} lg={8} className={classes.position}>
      <Paper className={classes.paper}>
          <Grid item className={classes.header}>
            <Typography variant="h4" align="center">
              Submit Design
            </Typography>
          </Grid>
          <Grid item>
            <div align="center" onClick={props.showFileUpload}>
              <img src={uploadImage} style={{ width: "25%", height: "25%"}}/>
            </div>  
          </Grid>
          <Grid item className={classes.subheader}>
              <Typography variant="h6" align="center">
                  Click to choose a file
              </Typography>
          </Grid>
          <Grid item className={classes.subtitle}>
              <Typography variant="subtitle1" align="center">
                  Please upload high resolution images 
                  in JPEG, PNG or GIF.
              </Typography>
          </Grid>
          <Grid item>
            {props.children}
          </Grid>
      </Paper>
    </Grid>
  </Grid>
  );
}