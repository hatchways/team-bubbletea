import React from 'react';

export class Image extends React.Component {
	constructor() {
		super()
		this.handleClickDownloadImage = this.handleClickDownloadImage.bind(this)
	}

	handleClickDownloadImage() {
		fetch('/download', {
			method: 'POST', 
			body: JSON.stringify({"key" : this.props.imageKey}),
			headers: {"Content-Type" : "application/json"}
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
	render() {
		return(
			<div>
				<img width="200px" height="200px" src={this.props.imageURL}/>
				<button type="submit" onClick={this.handleClickDownloadImage}>Download</button>
			</div>
		)
	}
} 