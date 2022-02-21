import React from "react"
const Blog = ({ blog }) => (
  <div style={{ marginTop: "10px" }}>
    {blog.title} {blog.author}
  </div>
)

export default Blog
