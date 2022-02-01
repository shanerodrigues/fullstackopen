const supertest = require("supertest")
const mongoose = require("mongoose")
const app = require("../app")
const api = supertest(app)

const helper = require("./test_helper")
const Blog = require("../models/blog")
const User = require("../models/user")

let token = null

describe("blog api", () => {
  beforeEach(async () => {
    // await Blog.deleteMany({})
    // const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
    // const promiseArray = blogObjects.map((blog) => blog.save())
    // const dummyUser = {
    //   name: "Duh Uhm",
    //   username: "duhmnb",
    //   password: "passtheword",
    // }
    // await api.post("/api/users").send(dummyUser)
    // const response = await api.post("/api/login").send({
    //   username: dummyUser.username,
    //   password: dummyUser.password,
    // })
    // const token = "Bearer " + response.body.token
    // // console.log({ token })
    // await Promise.all(promiseArray)

    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
    const promiseArray = blogObjects.map((blog) => blog.save())

    await User.deleteMany({})

    const dummyUser = {
      name: "Duh Uhm",
      username: "duhmnb",
      password: "passtheword",
    }

    await api.post("/api/users").send(dummyUser)

    const response = await api
      .post("/api/login")
      .send({ username: dummyUser.username, password: dummyUser.password })

    token = "Bearer " + response.body.token

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

  test("adding a blog with token works", async () => {
    const newBlog = {
      title: "Yippie Ki Yay",
      author: "Joe Dane",
      url: "www.daydreamers.co",
      likes: 20,
    }

    await api
      .post("/api/blogs")
      .set("Authorization", token)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const response = await api.get("/api/blogs")
    const titles = response.body.map((r) => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(newBlog.title)
  })

  test("adding a blog without token fails", async () => {
    const newBlog = {
      title: "Yippie Ki Yay",
      author: "Joe Dane",
      url: "www.daydreamers.co",
      likes: 20,
    }

    await api.post("/api/blogs").send(newBlog).expect(401)
  })

  test("likes property default to 0 if missing", async () => {
    const newBlog = {
      title: "Yippie Ki Yay",
      author: "Joe Dane",
      url: "www.daydreamers.co",
    }

    const response = await api
      .post("/api/blogs")
      .set("Authorization", token)
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
      .set("Authorization", token)
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/)
  })

  describe("DELETING TESTS", () => {
    test("delete one blog post", async () => {
      // ADD A BLOG POST
      const newBlog = {
        title: "Exmple",
        author: "Joe Dane",
        url: "www.daydreamers.co",
        likes: 20,
      }

      await api.post("/api/blogs").set("Authorization", token).send(newBlog)

      const blogsAtStart = await helper.blogsInDb()
      console.log({ blogsAtStart })

      const blogToDelete = blogsAtStart[blogsAtStart.length - 1]
      console.log({ blogToDelete })

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", token)
        .expect(204)

      const response = await api.get("/api/blogs")

      const blogsAtEnd = await helper.blogsInDb()

      expect(response.body).toHaveLength(blogsAtStart.length - 1)

      const contents = blogsAtEnd.map((b) => b.title)
      expect(contents).not.toContain(blogToDelete.title)
    })
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

afterAll(() => {
  mongoose.connection.close()
})
