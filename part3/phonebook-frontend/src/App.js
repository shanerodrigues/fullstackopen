import React, { useState, useEffect } from "react"
import Persons from "./components/Persons"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import personService from "./services/persons"
import "./App.css"
import Notification from "./components/Notification"

// run json-server
// json-server --port 3001 --watch db.json

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")
  const [message, setMessage] = useState(null)
  const [condition, setCondition] = useState(null)

  useEffect(() => {
    personService.getAll().then((numbers) => setPersons(numbers))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const checker = checkName(newName, newNumber)
    if (!checker) {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(personObject)
        .then((newNumber) => {
          console.log("third console")
          setPersons(persons.concat(newNumber))
          setNewName("")
          setNewNumber("")
          setMessage(`Added ${newName}`)
          setCondition("success")
          setTimeout(() => {
            setMessage(null)
            setCondition(null)
          }, 5000)
        })
        .catch((error) => {
          setMessage(error.response.data.error)
          setCondition("failure")
          setTimeout(() => {
            setMessage(null)
            setCondition(null)
          }, 5000)
          setNewName("")
          setNewNumber("")
        })
    } else {
      setNewName("")
      setNewNumber("")
    }
  }

  const updatePerson = (name, number) => {
    const chosenPerson = persons.find((person) => name === person.name)
    const changedPerson = { ...chosenPerson, number: number }

    personService
      .update(chosenPerson.id, changedPerson)
      .then((returnedPerson) => {
        setPersons(
          persons.map((person) =>
            person.id !== chosenPerson.id ? person : returnedPerson
          )
        )
      })
      .catch((error) => {
        setMessage(`The person ${newName} was already deleted from server`)
        setCondition("failure")
        setTimeout(() => {
          setMessage(null)
          setCondition(null)
        }, 5000)
        setPersons(persons.filter((n) => n.id !== chosenPerson.id))
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const checkName = (newName, newNumber) => {
    const isPresent = (element) => element.name === newName
    const indexVal = persons.findIndex(isPresent)
    if (indexVal >= 0) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        updatePerson(newName, newNumber)
        return true
      }
      return true
    } else if (newName === "") {
      alert(`Please add a person to the phonebook`)
      return true
    }
    return false
  }

  return (
    <div className="container">
      <h2>Phonebook</h2>
      <Notification message={message} condition={condition} />
      <p>
        <Filter handleFilter={handleFilter} />
      </p>
      <PersonForm
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <div>
        <Persons
          persons={persons}
          filter={filter}
          setPersons={setPersons}
          setMessage={setMessage}
          setCondition={setCondition}
        />
      </div>
    </div>
  )
}

export default App
