import Weather from "./Weather"
const Country = ({ country }) => {
  return (
    <div key={country.name}>
      <h1>{country.name}</h1>
      <p>Capital {country.capital}</p>
      <p>Population {country.population}</p>
      <h3>Spoken languages</h3>
      <ul>
        {country.languages.map((lang) => (
          <li key={lang.name}>{lang.name}</li>
        ))}
      </ul>
      <img style={{ width: "20%" }} src={country.flag} alt={country.name} />
      <Weather capital={country.capital} />
    </div>
  )
}

export default Country
