import React from "react"
import Countries from "./Countries"

const SelectCountries = ({ query, data }) => {
  let filteredCountries = data.filter((country) =>
    country.name.toLowerCase().includes(query.toLowerCase())
  )

  return <Countries filteredCountries={filteredCountries} query={query} />
}

export default SelectCountries
