import { useState } from "react"

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? "none" : "inline-block" }
  const showWhenVisible = { display: visible ? "inline-block" : "none" }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
