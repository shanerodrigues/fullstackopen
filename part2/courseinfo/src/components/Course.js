import React from "react"
import Header from "./Header.js"
import Content from "./Content.js"
import Total from "./Total.js"

const Course = ({ courses }) => {
  return (
    <>
      {courses.map((course) => {
        return (
          <div key={course.id}>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
          </div>
        )
      })}
    </>
  )
}

export default Course
