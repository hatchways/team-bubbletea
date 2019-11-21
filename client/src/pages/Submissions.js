import React from 'react';
import Image from './components/Image';

export default class Submissions extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			files: null,
			submissions: [], 
			submissionKeys: []
		}
	this.handleChangeInUpload = this.handleChangeInUpload.bind(this)
   	this.handleClickUpload = this.handleClickUpload.bind(this)
   	this.viewAllSubmissions = this.viewAllSubmissions.bind(this)
	}

	componentDidMount() {
    this.viewAllSubmissions()
  	}

  	viewAllSubmissions() {
    	fetch('/submissions').then(response =>
      	response.json().then(data => {
        	this.setState({ submissions: data.files, submissionKeys: data.fileKeys }); 
      		})
    	) 
  	}

  	handleChangeInUpload(e) {
    	this.setState({ files: e.target.files })
  	}

  	handleClickUpload(e) {
  		if(this.state.files !== null) {
	    	e.preventDefault();
	    	const formData = new FormData();
	    	formData.append('file', this.state.files[0]);
	    	fetch('/upload', {
	      		method: 'POST', 
	      		body: formData})
	      		.then(response => {
	      			console.log("Yay! Your file has been successfully uploaded" + response)
	      			this.viewAllSubmissions()})
	      		.catch(error => {
	      			console.log("Uh-oh, something's not right..." + error)
	    	})
    	} else {
    		alert("Please select a file to upload first!")
    	}
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
			<form className="upload-form" method="post" encType="multipart/form-data"/>
        	<p><input type="file" className="picture" onChange={this.handleChangeInUpload}/></p>
        	<button type="submit" className="submit" onClick={this.handleClickUpload}>
          		Upload
        	</button>
				{imagesArray}
			</div>
			)
		}
}