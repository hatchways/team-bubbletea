import React, { Fragment } from 'react';
import { makeStyles, Grid, GridList, GridListTile, GridListTileBar, ListSubheader } from '@material-ui/core';
import { Image } from './Image';

const useStyles = makeStyles(theme => ({
	root: {
	  display: 'flex',
	  flexWrap: 'wrap',
	  overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    "padding-left": "0.75%",
    "padding-right": "0.5%",
	},
	gridList: {
	  width: '100%',
    height: '100%',
    "padding-top": "1%",
  },
  tilebar: {
    "height":"12.5%",
    "margin-right": "1.5%",
    "margin-bottom": "1.5%"
  }
  }));

  export function ImagesGrid(props) {
  const classes = useStyles();

  return (
    <Fragment>
      <Grid container justify="center" className={classes.root}>
          <GridList cellHeight="auto" className={classes.gridList} cols={5}>
            {props.submissions.map((submission, i) => (
              <Grid item className={classes.tile}>
              <GridListTile key={submission}>
                <Image imageClickHandler={props.imageClickHandler} imageURL={submission} imageKey={props.submissionKeys[i]} />
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