import React from 'react';
import { Header } from "./Header";
import { UploadPaper } from "./UploadPaper";
import { UploadButton } from "./UploadButton";
import { Redirect } from 'react-router-dom';
import { NavButton } from "./NavButton";


export class UploadSubmission extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            files: null,
            redirect: false,
            redirectMessage: false,
            redirectDiscover: false,
            redirectAccount: false,
            contestID: props.match.params.contestID
        }
        this.fileUploadRef = React.createRef()
        this.handleChangeInUpload = this.handleChangeInUpload.bind(this)
        this.handleClickUpload = this.handleClickUpload.bind(this)
        this.showFileUpload = this.showFileUpload.bind(this)
        this.redirectToNewPage = this.redirectToNewPage.bind(this)
    }

    showFileUpload() {
        this.fileUploadRef.current.click();
    }

    handleChangeInUpload(e) {
        this.setState({ files: e.target.files })
    }

    handleClickUpload(e) {
        if (this.state.files !== null) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('file', this.state.files[0]);
            console.log(formData);
            fetch(`/contests/${this.state.contestID}/submissions/upload`, {
                method: 'POST',
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

    redirectToNewPage(buttonName) {
        if (buttonName === "Messages") {
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
                <UploadPaper showFileUpload={this.showFileUpload}>
                    <form className="upload-form" method="post" encType="multipart/form-data" />
                    <input type="file" ref={this.fileUploadRef} onChange={this.handleChangeInUpload} style={{ display: "none" }} />
                    <UploadButton type="submit" onClick={this.handleClickUpload} />
                </UploadPaper>
                {this.state.redirect && <Redirect to='/view-contest' />}
                {this.state.redirectMessage && <Redirect to='/messages' />}
                {this.state.redirectDiscover && <Redirect to='/' />}
                {this.state.redirectAccount && <Redirect to='/profile' />}
            </div>
        )
    }
}