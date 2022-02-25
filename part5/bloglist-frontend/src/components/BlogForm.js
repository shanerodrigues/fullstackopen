import { useState } from "react"

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState("")
  const [blogAuthor, setBlogAuthor] = useState("")
  const [blogUrl, setBlogUrl] = useState("")

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title: blogTitle, author: blogAuthor, url: blogUrl })
    setBlogAuthor("")
    setBlogTitle("")
    setBlogUrl("")
  }

  return (
    <div>
      <h2>create</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="title"
            name="title"
            value={blogTitle}
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            name="author"
            value={blogAuthor}
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            name="url"
            value={blogUrl}
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
