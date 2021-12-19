const Notification = ({ message, condition }) => {
  if (message === null) {
    return null
  }
  if (condition === "success") {
    return <div className="success">{message}</div>
  }
  if (condition === "failure") {
    return <div className="error">{message}</div>
  }
}

export default Notification
