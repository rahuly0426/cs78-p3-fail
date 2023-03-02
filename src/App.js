import { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("Austin");
  const [latitude, setLatitude] = useState(30.29);
  const [longitude, setLongitude] = useState(-97.75);
  const [data, setData] = useState(null);
  const [latInput, setLatInput] = useState("");
  const [lonInput, setLonInput] = useState("");

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  
  useEffect(() => {
    fetchWeatherData();
  }, [city, latitude, longitude]);
  
  const handleCityChange = useCallback(
    (newCity) => {
      setCity(newCity);
      switch (newCity) {
        case "Dallas":
          setLatitude(32.78);
          setLongitude(-96.80);
          break;
        case "Houston":
          setLatitude(29.76);
          setLongitude(-95.37);
          break;
        default:
          setLatitude(30.29);
          setLongitude(-97.75);        
      }
      fetchWeatherData();  
  },
  [setCity, setLatitude, setLongitude, fetchWeatherData]
  );

  const handleLatInput = (event) => {
    setLatInput(event.target.value);
  };

  const handleLonInput = (event) => {
    setLonInput(event.target.value);
  };

  const handleCoordsSubmit = () => {
    const newLat = parseFloat(latInput);
    const newLon = parseFloat(lonInput);
    if (isNaN(newLat) || isNaN(newLon)) {
      alert("Error, cannot find the weather at those coordinates. Please make sure you are using the proper coordinates.");
      return;
    }
    setLatitude(newLat);
    setLongitude(newLon);
    setCity(newLat + " " + newLon);
  };


  
  return (
    <div className="App">
      <div className="button-group">
        <button onClick={() => handleCityChange("Austin")}>Austin</button>
        <button onClick={() => handleCityChange("Dallas")}>Dallas</button>
        <button onClick={() => handleCityChange("Houston")}>Houston</button>
      </div>
      <div>
          <input type="text" value={latInput} onChange={handleLatInput} placeholder="Enter latitude" />
          <input type="text" value={lonInput} onChange={handleLonInput} placeholder="Enter longitude" />
          <button onClick={handleCoordsSubmit}>Submit</button>
        </div>
      {data ? (
        <div className="weather-data">
          <h2>Weather for {city}</h2>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Temperature</th>
              </tr>
            </thead>
            <tbody>
              {data.hourly.temperature_2m.slice(0,12).map((temperature, index) => (
                <tr key={index}>
                  <td>{new Date(data.hourly.time[index]).toLocaleTimeString([], {hour: '2-digit'})}</td>
                  <td>{temperature}°C</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>Waiting on Data...</div>
      )}
    </div>
  );
}

export default App;
