import React from "react"

const Filter = ({ handleFilter }) => {
  return (
    <span>
      filter shown with <input onChange={handleFilter} />
    </span>
  )
}

export default Filter
