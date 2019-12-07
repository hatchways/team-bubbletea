import React, { Fragment } from "react";

export function AvailableUsers(props) {
  return (
    <Fragment>
      <ul>
        {props.users.map((user) => (
          <li onClick={() => props.onUserClick(user.user_id)} key={user.user_id}>
            {user.first_name + ' ' + user.last_name}
          </li>
        ))}
      </ul>
    </Fragment>
  )
}