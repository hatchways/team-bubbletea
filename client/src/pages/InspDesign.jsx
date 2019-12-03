import React, { useState } from "react";
import { makeStyles, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    container: {
      height: "190px",
      width: "100%"
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    },
    imageDarkened: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: "0.4",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 1)",
      width: "100%",
      height: "100%"
    }
  })
)

export function InspDesign(props) {
  const classes = useStyles();
  const [selected, setSelected] = useState(false);

  return (
    <Grid item xs={3}>
      <div className={classes.container}>
        {selected ? (
        <div className={classes.overlay} onClick={() => setSelected(false)}>
          <img src={props.imageURL} alt="" className={classes.imageDarkened}/>
        </div>
        ) : (
        <div className={classes.overlay} onClick={() => setSelected(true)}>
          <img src={props.imageURL} alt="" className={classes.image}/>
        </div>
        )}
      </div>
    </Grid>
  )
}
