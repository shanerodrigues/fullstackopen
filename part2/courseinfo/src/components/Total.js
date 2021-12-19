import React from "react"

const Total = ({ parts }) => {
  const arr = parts.map((part) => part.exercises)
  const total = arr.reduce((res, current) => res + current)
  return (
    <p>
      <b>Number of exercises {total}</b>
    </p>
  )
}

export default Total
