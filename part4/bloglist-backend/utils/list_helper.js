// functions to carry out here

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let likes = 0
  for (let blog of blogs) {
    likes += blog.likes
  }
  return likes
}

const favouriteBlog = (blogs) => {
  let mostLiked = blogs.reduce((mostLikes, blog) => {
    return (mostLikes.likes || 0) > blog.likes ? mostLikes : blog
  }, {})
  let mostLikedBlog = {
    title: mostLiked.title,
    author: mostLiked.author,
    likes: mostLiked.likes,
  }
  return mostLikedBlog
}

const mostBlogs = (blogs) => {
  const authorsAndBlogNumber = []

  for (let i = 0; i < blogs.length; i++) {
    const findAuthor = authorsAndBlogNumber.find(
      (blog) => blog.author === blogs[i].author
    )
    if (!findAuthor) {
      const blogAuthor = {
        author: blogs[i].author,
        blogs: 1,
      }
      authorsAndBlogNumber.push(blogAuthor)
    } else {
      findAuthor.blogs += 1
    }
  }
  let highest = []
  highest = authorsAndBlogNumber[0]
  for (let i = 0; i < authorsAndBlogNumber.length; i++) {
    if (authorsAndBlogNumber[i].blogs > highest.blogs) {
      highest = authorsAndBlogNumber[i]
    }
  }
  return highest
}

const mostLikes = (blogs) => {
  const authorsAndLikesNumber = []

  for (let i = 0; i < blogs.length; i++) {
    const findAuthor = authorsAndLikesNumber.find(
      (blog) => blog.author === blogs[i].author
    )
    if (!findAuthor) {
      const blogAuthor = {
        author: blogs[i].author,
        likes: blogs[i].likes,
      }
      authorsAndLikesNumber.push(blogAuthor)
    } else {
      findAuthor.likes += blogs[i].likes
    }
  }
  let highest = []
  highest = authorsAndLikesNumber[0]
  for (let i = 0; i < authorsAndLikesNumber.length; i++) {
    if (authorsAndLikesNumber[i].likes > highest.likes) {
      highest = authorsAndLikesNumber[i]
    }
  }
  return highest
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}
