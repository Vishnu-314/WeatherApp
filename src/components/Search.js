import React, { useState, useEffect } from 'react';

const Search = () => {
    const [weather, setWeather] = useState(null);
    const [cityName, setCityName] = useState('');
    const [error, setError] = useState('');
    const [lastCities, setLastCities] = useState(() => {
        const lastCitiesJSON = localStorage.getItem('lastCities');
        if (lastCitiesJSON) {
            return JSON.parse(lastCitiesJSON);
        }
        return [];
    });

    useEffect(() => {
        async function fetchWeather() {
            if (cityName) {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=e4474a5a310acf7bf0512732579b629b&units=metric`
                );
                const data = await response.json();
                if (data.cod === '404') {
                    setWeather(null)
                    setError('Enter a valid city name');
                } else {
                    setWeather(data);
                    setLastCities((prevLastCities) => {
                        const newLastCities = [cityName, ...prevLastCities].slice(0, 3);
                        localStorage.setItem('lastCities', JSON.stringify(newLastCities));
                        return newLastCities;
                    });
                    setError('');
                }
            } else {
                setError('');
            }
        }
        fetchWeather();
    }, [cityName]);

    const handleCityNameChange = (event) => {
        setCityName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (cityName.trim() !== '') {
            setCityName(cityName.trim());
        }
    };

    return (
        <div>
            <form className="d-flex" onSubmit={handleSubmit}>
                <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search a City Name"
                    aria-label="Search"
                    value={cityName}
                    onChange={handleCityNameChange}
                />
                <button className="btn btn-primary" type="submit" disabled={cityName.trim() === ''}>
                    Search
                </button>
            </form>
            {error && (<div className="alert alert-danger my-5" role="alert">
               {error}
            </div>)}
            {weather && (
                <div className='my-3'>
                    <h2 style={{'background':"#9dc0f4"}}>Weather details of city: {weather.name}</h2>
                    <h3  style={{'background':"#dc818a"}}  >Current Temp: {weather.main.temp}</h3>
                    <h3>
                        Temperature range: {weather.main.temp_min} to {weather.main.temp_max}
                    </h3>
                    <h3>Humidity: {weather.main.humidity}</h3>
                    <h3>Ground Level: {weather.main.grnd_level}</h3>
                    <h3>Sea Level: {weather.main.sea_level}</h3>
                </div>
            )}
            <div className='container my-5'>
                <h2 className='text-start'>Last 3 city Searches:</h2>
                <ul className="list-group list-group-flush">
                    {lastCities.map((city, index) => (
                        <li className='list-group-item text-start' key={index}>{city}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Search;
