import React, { useState, useEffect } from "react"
import axios from "axios"
import SelectCountries from "./components/SelectCountries"

function App() {
  const [data, setData] = useState([])
  const [query, setQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios.get("https://restcountries.com/v2/all").then((res) => {
      setData(res.data)
    })
  }, [query])

  const handleInput = (e) => {
    if (e === "") {
      setQuery("")
      setSelectedCountry(null)
    } else {
      setQuery(e)
    }
  }
  return (
    <div className="App">
      <p>
        find countries{" "}
        <input value={query} onChange={(e) => handleInput(e.target.value)} />
      </p>

      {query !== "" ? (
        <SelectCountries query={query} data={data} />
      ) : (
        <div>Type to search</div>
      )}
    </div>
  )
}

export default App
