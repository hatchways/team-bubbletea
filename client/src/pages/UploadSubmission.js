import React from 'react';
import { Header } from "./Header";
import { UploadPaper } from "./UploadPaper"; 
import { UploadButton } from "./UploadButton";
import { Redirect } from 'react-router-dom'; 

export class UploadSubmission extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            files: null,
            redirect: false,
        }
        this.fileUploadRef = React.createRef()
        this.handleChangeInUpload = this.handleChangeInUpload.bind(this)
        this.handleClickUpload = this.handleClickUpload.bind(this)
        this.showFileUpload = this.showFileUpload.bind(this)   
    }

    showFileUpload() {
        this.fileUploadRef.current.click(); 
    }
    
    handleChangeInUpload(e) {
        this.setState({ files: e.target.files })
    }

    handleClickUpload(e) {
        if(this.state.files !== null) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('file', this.state.files[0]);
            fetch('/contests/2/submissions/upload', {
                method:'POST', 
                body: formData
            })
            .then(response => {
                console.log(response)
                this.setState({ redirect: true })
            })
            .catch(error => {
                console.log(error)
            })
        } else {
            // TODO add MUI popup here 
            alert("Please select a file to upload first!")
        }
    }
    render() {
        return(
            <div>
                <Header/>
                <UploadPaper showFileUpload={this.showFileUpload}>
                    <form className="upload-form" method="post" encType="multipart/form-data"/>
                    <input type="file" ref={this.fileUploadRef} onChange={this.handleChangeInUpload} style={{ display: "none" }}/>
                </UploadPaper>
                <UploadButton type="submit" onClick={this.handleClickUpload}/>
                {this.state.redirect && <Redirect to='/view-contest'/>}
            </div>
        )
    }
}