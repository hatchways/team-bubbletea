import React, { Fragment } from 'react';
import { makeStyles, Grid, GridList, GridListTile, GridListTileBar, ListSubheader } from '@material-ui/core';
import { Image } from './Image';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
<<<<<<< HEAD
    "padding-left": "0.75%",
    "padding-right": "0.5%",
=======
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
>>>>>>> dev
  },
  gridList: {
    width: '100%',
    height: '100%',
    paddingTop: theme.spacing(2),
  },
  tilebar: {
<<<<<<< HEAD
    "height": "12.5%",
    "margin-right": "1.5%",
    "margin-bottom": "1.5%"
=======
    height: 20,
    marginBottom: theme.spacing(0.5)
>>>>>>> dev
  }
}));

export function ImagesGrid(props) {
  const classes = useStyles();

  return (
    <Fragment>
      <Grid container justify="center" className={classes.root}>
        <GridList cellHeight="auto" className={classes.gridList} cols={5}>
          {props.submissions.map((submission, i) => (
<<<<<<< HEAD
            <Grid item className={classes.tile}>
=======
            <Grid item className={classes.tile} key={i}>
>>>>>>> dev
              <GridListTile key={submission}>
                <Image imageClickHandler={props.imageClickHandler}
                  imageURL={submission}
                  submissionID={props.submissionIDs[i]}
                  imageKey={props.submissionKeys[i]} />
                <GridListTileBar
                  className={classes.tilebar}
                  subtitle={<span>by: artistname</span>}
                />
              </GridListTile>
            </Grid>
          ))}
        </GridList>
      </Grid>
    </Fragment>
  );
}