const blogsRouter = require("express").Router()
const res = require("express/lib/response")
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {
  if (request.token === null) {
    response.status(401).json({
      error: "token is missing",
    })
  }
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)

  await user.save()
  response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)

  if (blog.user.toString() === request.user.id.toString()) {
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } else {
    return response.status(401).json({
      error: "cannot delete another user's post",
    })
  }
})

blogsRouter.put("/:id", async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true,
    }
  )
  response.status(204).json(updatedBlog)
})

module.exports = blogsRouter
