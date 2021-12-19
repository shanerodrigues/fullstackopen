import React from "react"

const Person = ({ person, deleteEntry }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={deleteEntry}>delete</button>
    </p>
  )
}

export default Person
