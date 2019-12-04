import React from 'react';
import { Header } from "./Header";

export class ViewContest extends React.Component {
    render() {
        return(
            <div>
                <Header/>
                <h4>You are at View Contest page</h4> 
                <p>Your submission has been successfully uploaded!</p>
            </div>
        )
    }
}
