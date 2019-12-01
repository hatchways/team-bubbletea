import React from 'react';
import { ImagesGrid } from './ImagesGrid';
import { Image } from './Image';
import { Header } from './Header';
import { ContestDetailsPaperSheet } from './ContestDetailsPaper';
import { ImageDisplayPaper } from './ImageDisplayPaper';
import { NotificationsButton } from './NotificationsButton';
import { MessagesButton } from './MessagesButton';
import { ImagePopUp } from './ImagePopUp';
import { DiscoverButton } from './DiscoverButton';
import { AccountButton } from './AccountButton';

export class ViewSubmissions extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			submissions: [], 
			submissionKeys: [], 
			imagePopUpDisplayed: false,
			displayedImageURL: "",  
		}
	   this.viewAllSubmissions = this.viewAllSubmissions.bind(this)
	   this.displayImagePopUp = this.displayImagePopUp.bind(this)
	   this.closeImagePopUp = this.closeImagePopUp.bind(this)
	}

	componentDidMount() {
    this.viewAllSubmissions()
  	}

  	viewAllSubmissions() {
    	fetch('/contests/2/submissions').then(response =>
      	response.json().then(data => {
        	this.setState({ submissions: data.files, submissionKeys: data.fileKeys }); 
      		})
    	) 
	  }
	  
	displayImagePopUp(imageURL) {
		this.setState({ imagePopUpDisplayed : true, displayedImageURL: imageURL })
	}

	closeImagePopUp() {
		this.setState({ imagePopUpDisplayed: false })
	}

	render() {
		let imagesArray = []
		for(let i=0; i < this.state.submissions.length; i++) {
			imagesArray.push(
				<Image imageURL={this.state.submissions[i]} imageKey={this.state.submissionKeys[i]} key={i}/>
			)
		}
		return (
			<div>
				<Header>
					<DiscoverButton/>
					<MessagesButton/>
					<NotificationsButton/>
					<AccountButton/>
				</Header>
				<ContestDetailsPaperSheet/>
				<ImageDisplayPaper 
					submissions={this.state.submissions} 
					submissionKeys={this.state.submissionKeys} 
					imageClickHandler={this.displayImagePopUp} />
				<ImagePopUp 
					imagePopUpDisplayed={this.state.imagePopUpDisplayed} 
					imageURL={this.state.displayedImageURL} 
					closePopUp={this.closeImagePopUp} />
			</div>
			)
		}
}