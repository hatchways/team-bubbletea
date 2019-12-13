import React from "react";
import { Header } from "./Header";
import { ContestDetailsPaperSheet } from "./ContestDetailsPaper";
import { ImageDisplayPaper } from "./ImageDisplayPaper";
import { ImagePopUp } from "./ImagePopUp";
import { NavButton } from "./NavButton";
import WinnerSnackbar from './WinnerSnackbar';

export class ViewSubmissions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      submissions: [],
      submissionKeys: [],
      submissionIDs: [],
      imagePopUpDisplayed: false,
      displayedImageURL: "",
      displayedSubmissionID: null,
      contestID: props.match.params.contestID,
      winnerID: null,
      winnerMsg: false
    };
    this.viewAllSubmissions = this.viewAllSubmissions.bind(this)
    this.displayImagePopUp = this.displayImagePopUp.bind(this)
    this.closeImagePopUp = this.closeImagePopUp.bind(this)
    this.openWinnerMsg = this.openWinnerMsg.bind(this)
    this.closeWinnerMsg = this.closeWinnerMsg.bind(this)
  }

  componentDidMount() {
    this.viewAllSubmissions();
  }

  viewAllSubmissions() {
    fetch(`/contests/${this.state.contestID}/submissions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'jwtoken': localStorage.getItem('token') })
    }).then(response =>
      response.json().then(data => {
        this.setState({
          submissions: data.files,
          submissionKeys: data.fileKeys,
          submissionIDs: data.submissionIDs,
          winnerID: data.winnerID
        });
      })
    )
  }

  displayImagePopUp(imageURL, submissionID) {
    this.setState({ imagePopUpDisplayed: true, displayedImageURL: imageURL, displayedSubmissionID: submissionID })
  }

  closeImagePopUp() {
    this.setState({ imagePopUpDisplayed: false })
  }

  openWinnerMsg() {
    this.setState({ winnerMsg: true })
  }

  closeWinnerMsg() {
    this.setState({ winnerMsg: false })
  }

  render() {
    return (
      <div>
        <Header>
          <NavButton buttonName="Discover"></NavButton>
          <NavButton buttonName="Messages"></NavButton>
          <NavButton buttonName="Notifications"></NavButton>
          <NavButton buttonName="Account"></NavButton>
        </Header>
        <ContestDetailsPaperSheet />
        <ImageDisplayPaper
          submissions={this.state.submissions}
          submissionKeys={this.state.submissionKeys}
          submissionIDs={this.state.submissionIDs}
          imageClickHandler={this.displayImagePopUp}
          winnerID={this.state.winnerID}
        />
        <ImagePopUp
          imagePopUpDisplayed={this.state.imagePopUpDisplayed}
          imageURL={this.state.displayedImageURL}
          closePopUp={this.closeImagePopUp}
          submissionID={this.state.displayedSubmissionID}
          contestID={this.state.contestID}
          winnerDeclared={this.state.winnerID ? true : false}
          openWinnerMsg={this.openWinnerMsg}
        />
        <WinnerSnackbar closeWinnerMsg={this.closeWinnerMsg} winnerMsg={this.state.winnerMsg} />
      </div>
    )
  }
}