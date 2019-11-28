import React from 'react';
import { Image } from './Image';

export class ViewSubmissions extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			submissions: [], 
			submissionKeys: []
		}
   	this.viewAllSubmissions = this.viewAllSubmissions.bind(this)
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

	render() {
		let imagesArray = []
		for(let i=0; i < this.state.submissions.length; i++) {
			imagesArray.push(
				<Image imageURL={this.state.submissions[i]} imageKey={this.state.submissionKeys[i]} key={i}/>
			)
		}
		return (
			<div>
				{imagesArray}
			</div>
			)
		}
}