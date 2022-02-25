import React, { useState, useEffect } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"
import BlogForm from "./components/BlogForm"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))

      setUser(user)
      setUsername("")
      setPassword("")
    } catch (exception) {
      setMessage("Wrong username or password")
      setStatus("error")
      setTimeout(() => {
        setMessage(null)
        setStatus(null)
      }, 5000)
    }
  }

  const updateBlog = (id, blogObject) => {
    // only send user.id not entire user object to update the database
    const object = {
      ...blogObject,
      user: blogObject.user?.id,
    }
    blogService
      .update(id, object)
      .then(() => {
        // use the blogObject as that is updated and contains all user data
        setBlogs(
          blogs.map((blog) => (blog.id === blogObject.id ? blogObject : blog))
        )
      })
      .catch((error) => console.log(error))
  }

  const addBlog = (blogObject) => {
    try {
      blogService.create(blogObject).then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
      })

      setMessage(
        `a new blog, ${blogObject.title}! by ${blogObject.author} added`
      )
      setStatus("success")
      setTimeout(() => {
        setMessage(null)
        setStatus(null)
      }, 5000)
    } catch (exception) {
      setMessage("Cannot write a new blog")
      setStatus("error")
      setTimeout(() => {
        setMessage(null)
        setStatus(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message} status={status} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }

  const LoggedUser = ({ user }) => {
    const LogoutForm = () => (
      <form
        onSubmit={() => window.localStorage.removeItem("loggedBlogappUser")}
        style={{ display: "inline-block" }}
      >
        <button type="submit">logout</button>
      </form>
    )
    return (
      <div>
        <span> {user.name} logged in</span>
        <LogoutForm />
      </div>
    )
  }

  const newBlog = () => {
    return (
      <Togglable buttonLabel="new blog">
        <BlogForm createBlog={addBlog} />
      </Togglable>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} status={status} />
      <LoggedUser user={user} />

      {user !== null && newBlog()}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} updateLikes={updateBlog} />
      ))}
    </div>
  )
}

export default App
