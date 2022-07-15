import { useState, useEffect } from 'react';
import axios from 'axios';

function Countries({countries, handleShow}) {
  if (countries.length > 20) {
    return <p>Too many matches, specify another filter</p>
  } else if (countries.length === 1) {
    return <Country country={countries[0]} />
  } else if (countries.length === 0) {
    return <p>Couldn't find a country with that name</p>
  } else {
    return countries.map(({name: {common: name}}) => {
      return (
        <p key={name} id={name}>
          {name}
          <button onClick={handleShow}>show</button>
        </p>
      );
    });
  }
}

function Country({country}) {
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital ? country.capital[0] : ''}</p>
      <p>area {country.area}</p>
      <p><strong>languages:</strong></p>
      <Languages langs={country.languages} />
      <img src={country.flags.png} alt='flag'/ >
      <Weather country={country} />
    </>
  );
}

function Languages ({langs}) {
  return (
    <ul>
      {Object.entries(langs).map(([id, lang]) => <li key={id}>{lang}</li>)}
    </ul>
  )
}

function Weather({country}) {
  const [weather, setWeather] = useState([]);
  
  useEffect(() => {
    if (country.capital) {
      let url = 'https://api.openweathermap.org/data/2.5/weather';
      let params = new URLSearchParams({
        lat: country.capitalInfo.latlng[0],
        lon: country.capitalInfo.latlng[1],
        appid: process.env.REACT_APP_API_KEY,
        units: 'imperial',
      });

      url = url + '?' + params.toString();
      axios.get(url).then(response => setWeather(response.data));
    }
  }, []);

  return (
    <div key='weather'>
      <h2>Weather in {country.capital}</h2>
      {weather.length !== 0 &&
      (<><p key='temp'>temperature {weather.main.temp} Fahrenheit</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt=''/>
      <p key='wind'>wind {weather.wind.speed} mph</p></>)}
    </div>
  );
}

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
         .then(response => setCountries(response.data));
  }, []);

  const handleSearch = event => {
    setSearch(event.target.value);
    setCountry('');
  };

  const handleShow = event => {
    const name = event.target.closest('p').id;
    const country = countries.find(({name: {common}}) => common === name);
    setCountry(country);
  };

  const filterCountries = () => {
    return countries.filter(({name: {common: name}}) => {
      return name.toLowerCase().includes(search.toLowerCase());
    });
  };

  return (
    <>
      <label htmlFor='search'>find countries</label>
      <input id='search' value={search} onChange={handleSearch}/>
      {country === ''
        ? <Countries countries={filterCountries()} handleShow={handleShow}/>
        : <Country country={country} />}
    </>
  );
}

export default App;
