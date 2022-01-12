import React from "react"
import Person from "./Person"
import personService from "../services/persons"

const Persons = ({ persons, filter, setPersons, setMessage, setCondition }) => {
  const deleteEntry = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter((n) => n.id !== person.id))
        })
        .catch((error) => {
          setMessage(
            `Information of ${person.name} has already been removed from the server`
          )
          setCondition("failure")
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.filter((n) => n.id !== person.id))
        })
    }
  }
  return persons
    .filter((person) => {
      if (filter == null) {
        return person
      } else {
        return person.name.toLowerCase().includes(filter.toLowerCase())
      }
    })
    .map((person) => {
      return (
        <Person
          key={person.id}
          person={person}
          deleteEntry={() => deleteEntry(person)}
        />
      )
    })
}

export default Persons
