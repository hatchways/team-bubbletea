import React, { Fragment } from "react";
import { Header } from "./Header";
import { SignUpButton } from "./SignUpButton";
import { CreateContestPaper } from "./CreateContestPaper";

export default function CreateContest() {

  return (
    <Fragment>
      <Header>
        <SignUpButton />
      </Header>
      <CreateContestPaper />
    </Fragment>
  )
}
