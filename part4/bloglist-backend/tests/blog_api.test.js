const supertest = require("supertest")
const mongoose = require("mongoose")
const app = require("../app")
const api = supertest(app)
const helper = require("./test_helper")
const Blog = require("../models/blog")
const User = require("../models/user")
const bcrypt = require("bcrypt")

describe("notes api", () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)
  })

  test("notes returned as JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("blog posts have unique ids", async () => {
    const response = await api.get("/api/blogs")

    for (let i = 0; i < helper.initialBlogs.length; i++) {
      expect(response.body[i].id).toBeDefined()
    }
  })

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs")

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test("create a new blog works", async () => {
    const newBlog = {
      title: "Yippie Ki Yay",
      author: "Joe Dane",
      url: "www.daydreamers.co",
      likes: 20,
    }

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const response = await api.get("/api/blogs")

    const notesAtEnd = await helper.blogsInDb()
    const title = notesAtEnd.map((b) => b.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(title).toContain("Yippie Ki Yay")
  })

  test("likes property default to 0 if missing", async () => {
    const newBlog = {
      title: "Yippie Ki Yay",
      author: "Joe Dane",
      url: "www.daydreamers.co",
    }

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    expect(response.body.likes).toBe(0)
  })

  test("cannot post blog if title and url properties are missing", async () => {
    const newBlog = {
      author: "Joe Dane",
      likes: 200,
    }

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/)
  })

  test("delete one blog post", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const response = await api.get("/api/blogs")

    const blogsAtEnd = await helper.blogsInDb()

    expect(response.body).toHaveLength(helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map((b) => b.title)
    expect(contents).not.toContain(blogToDelete.title)
  })

  test("update likes for a blog post", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToChangeLikes = blogsAtStart[0]

    blogToChangeLikes.likes = 24

    await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send(blogToChangeLikes)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd[0].likes).toBe(24)
  })

  test("update title, author, url and likes of a blog post", async () => {
    const blogsAtStart = await helper.blogsInDb()

    const updatedBlog = {
      title: "Patterns of React",
      author: "Cichael Mhan",
      url: "https://patternsreact.com/",
      likes: 24,
    }

    await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send(updatedBlog)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd[0].title).toEqual("Patterns of React")
    expect(blogsAtEnd[0].author).toEqual("Cichael Mhan")
    expect(blogsAtEnd[0].url).toEqual("https://patternsreact.com/")
    expect(blogsAtEnd[0].likes).toBe(24)
  })
})

describe("users api", () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("sekret", 10)
    const user = new User({ username: "root", passwordHash })

    await user.save()
  })

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("`username` to be unique")

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test("username must be unique", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      blogs: [],
      username: "root",
      name: "Testing Root",
      password: "test",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test("username must be minimum length of 3", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      blogs: [],
      username: "ro",
      name: "Testing Roo",
      password: "test",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test("password must be minimum length of 3", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      blogs: [],
      username: "examples",
      name: "Testing Roo",
      password: "te",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test("username and password must be given", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      blogs: [],
      name: "Testing Roo",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
