import React from 'react';
import { Button, Typography } from '@material-ui/core'

export class Image extends React.Component {
  constructor({ winner }) {
    super()
    this.state = {
      hover: false,
      winner: winner
    }

    this.handleClickDownloadImage = this.handleClickDownloadImage.bind(this)
    this.toggleHover = this.toggleHover.bind(this)
  }

  handleClickDownloadImage() {
    fetch('contests/2/submissions/download', {
      method: 'POST',
      body: JSON.stringify({ "key": this.props.imageKey }),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = 'submission.png';
          a.click()
        })
      })
  }

  toggleHover() {
    this.setState({ hover: !this.state.hover })
  }
  render() {
    return (
      <div
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
        onClick={() => this.props.imageClickHandler(this.props.imageURL, this.props.submissionID)}>
        <img
          width="200px"
          height="200px"
          src={this.props.imageURL}
          style={{
            opacity: this.state.hover ? 0.5 : 1,
            border: this.state.winner ? '6px solid green' : null
          }}
          alt="grid-submissions"
        />
        {this.state.winner &&
          <div style={{
            top: 20,
            left: 50,
            position: "absolute",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: 24,
              color: "green",
            }}>
              <Typography component="h4" variant="h4">Winner</Typography>
            </div>
          </div>}
        {this.state.hover &&
          <div style={{
            top: 80,
            left: 60,
            position: "absolute",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: 16
            }}>
              <Button variant="contained">Expand</Button>
            </div>
          </div>}
      </div>
    )
  }
}
