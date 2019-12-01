import React from 'react';

export class Image extends React.Component {
	constructor() {
		super() 
		this.state = {
			hover: false, 
		} 
			
		this.handleClickDownloadImage = this.handleClickDownloadImage.bind(this)
		this.toggleHover = this.toggleHover.bind(this)
	}

	handleClickDownloadImage() {
		fetch('contests/2/submissions/download', {
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

	toggleHover() {
		this.setState({ hover: !this.state.hover })
	}
	render() {
		return(
			<div 
				onMouseEnter={this.toggleHover} 
				onMouseLeave={this.toggleHover} 
				onClick={() => this.props.imageClickHandler(this.props.imageURL)}>
					<img width="200px" height="200px" src={this.props.imageURL} style={{ opacity : this.state.hover ? 0.5 : 1 }} />
					{this.state.hover && <div style={{ width: "30%", height: "5%", top: "47.5%", left : "35%", position: "absolute", textAlign: "center" }}>
						<div style={{ fontSize: "16px" }}>
						Expand
						</div>
					</div>}
			</div>
		)
	}
} 

// <button type="submit" onClick={this.handleClickDownloadImage}>Download</button>