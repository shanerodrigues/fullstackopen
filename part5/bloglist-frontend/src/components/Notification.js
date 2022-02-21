import React from "react"

const Notification = ({ message, status }) => {
  if (message === null) {
    return null
  }
  if (status === "success") {
    return <div className="success">{message}</div>
  }

  return <div className="error">{message}</div>
}

export default Notification
