import React from "react";
import { Header } from "./Header";
import { ContestDetailsPaperSheet } from "./ContestDetailsPaper";
import { ImageDisplayPaper } from "./ImageDisplayPaper";
import { ImagePopUp } from "./ImagePopUp";
import { NavButton } from "./NavButton";
import WinnerSnackbar from './WinnerSnackbar';
import { Redirect } from 'react-router-dom'; 

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
      contestID: 3,
      winnerID: null,
      winnerMsg: false, 
      redirectMessage: false, 
      redirectDiscover: false, 
      redirectAccount: false
    };
    this.viewAllSubmissions = this.viewAllSubmissions.bind(this)
    this.displayImagePopUp = this.displayImagePopUp.bind(this)
    this.closeImagePopUp = this.closeImagePopUp.bind(this)
    this.openWinnerMsg = this.openWinnerMsg.bind(this)
    this.closeWinnerMsg = this.closeWinnerMsg.bind(this)
    this.redirectToNewPage = this.redirectToNewPage.bind(this)
  }

  componentDidMount() {
    this.viewAllSubmissions();
  }

  viewAllSubmissions() {
    fetch(`/contests/${this.state.contestID}/submissions/`).then(response =>
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

  redirectToNewPage(buttonName) {
    if(buttonName === "Messages") {
      this.setState({ redirectMessage: true })
    } else if (buttonName === "Discover") {
      this.setState({ redirectDiscover: true })
    } else if (buttonName === "Profile") {
      this.setState({ redirectAccount: true })
    }
  }

  render() {
    return (
      <div>
        <Header>
          <NavButton buttonName="Discover" redirect={this.redirectToNewPage}></NavButton>
          <NavButton buttonName="Messages" redirect={this.redirectToNewPage}></NavButton>
          <NavButton buttonName="Profile" redirect={this.redirectToNewPage}></NavButton>
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
        {this.state.redirectMessage && <Redirect to='/messages'/>}
        {this.state.redirectDiscover && <Redirect to='/'/>}
        {this.state.redirectAccount && <Redirect to='/profile'/>}
      </div>
    )
  }
}