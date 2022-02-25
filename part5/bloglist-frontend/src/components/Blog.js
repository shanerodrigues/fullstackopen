import React, { useState } from "react"
import Togglable from "./Togglable"
import blogService from "../services/blogs"

const Blog = ({ blog, updateLikes }) => {
  const [blogVisible, setBlogVisible] = useState(false)
  const hideWhenVisible = { display: blogVisible ? "none" : "inline-block" }
  const showWhenVisible = { display: blogVisible ? "inline-block" : "none" }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleClick = (blog) => {
    const blogObject = {
      ...blog,
      likes: blog.likes + 1,
    }

    updateLikes(blog.id, blogObject)
  }

  return (
    <div style={blogStyle}>
      <p>
        {blog.title} - {blog.author}
        <span style={showWhenVisible}>
          <button onClick={() => setBlogVisible(false)}>hide</button>
        </span>
        <span style={hideWhenVisible}>
          <button onClick={() => setBlogVisible(true)}>view</button>
        </span>
      </p>

      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>
          {blog.likes} <button onClick={() => handleClick(blog)}>like</button>
        </p>
        {blog.user && <p>{blog.user.name}</p>}
      </div>
    </div>
  )
}

export default Blog
