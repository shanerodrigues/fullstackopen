import React, { useState } from "react"
import Country from "./Country"

const Countries = ({ filteredCountries, query }) => {
  const [selectedCountry, setSelectedCountry] = useState(null)

  if (filteredCountries.length > 10) {
    return <div>Too many matches, be more specific</div>
  }

  if (filteredCountries.length === 1) {
    return (
      <div key={filteredCountries[0].alpha3Code}>
        <Country country={filteredCountries[0]} />
      </div>
    )
  }
  if (selectedCountry !== null) {
    return (
      <div key={selectedCountry.alpha3Code}>
        <Country country={selectedCountry} />
      </div>
    )
  }

  return filteredCountries.map((country) => {
    return (
      <div key={country.name}>
        {country.name}
        <button onClick={() => setSelectedCountry(country)}>show</button>
      </div>
    )
  })
}

export default Countries
