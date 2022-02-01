const blogsRouter = require("express").Router()
const res = require("express/lib/response")
const Blog = require("../models/blog")
const User = require("../models/user")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {
  const body = request.body

  //Finding random user to add blog to
  const allUsers = await User.find({})
  const userIds = allUsers.map((u) => u.id)
  const randomNumber = Math.floor(Math.random() * userIds.length)
  const user = await User.findById(userIds[randomNumber])

  // const user = await User.findById(body.userId)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  console.log("completed before blog id gets concatenated")
  user.blogs = user.blogs.concat(savedBlog._id)
  console.log("completed after blog id added")

  await user.save()
  response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
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
