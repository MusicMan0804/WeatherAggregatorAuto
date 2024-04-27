import "./styles.css";
import React, { useState } from "react";
import axios from "axios";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [averageTemperature, setAverageTemperature] = useState(null);
  const [averageWindSpeeds, setAverageWindSpeeds] = useState(null);
  const [averageHumidity, setAverageHumidity] = useState(null);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const apiKey = "a68fcc53181bfaec09e740708d952020"; // for open weather map
  const apiKey2 = "5e2c7e0967a947d0a35201701240103"; //for weather api

  //longitude and latitude constants
  let coordMap = {
    //"City": (Latitude, Longitude)
    Cairo: [30.0444, 31.2357],
    Tokyo: [35.6895, 139.6917],
    Mumbai: [19.076, 72.8777],
    Karachi: [24.8607, 67.0011],
    London: [51.509865, -0.1180921],
    Beijing: [39.9042, 116.4074],
    Sydney: [-33.865143, 151.2099],
    "New York": [40.7128, -74.006],
    Paris: [48.8566, 2.3522],
    Bangkok: [13.0827, 80.2707],
    Moscow: [55.7558, 37.6173],
    Dublin: [53.3498, -6.2603],
    Berlin: [52.52, 13.405],
    Lima: [-12.0464, -77.0428],
    Seoul: [37.5665, 126.978],
  };
  function getCoords(city) {
    const [latitude, longitude] = coordMap[city];
    setLatitude(latitude);
    setLongitude(longitude);
    setCity(city);
  }

  const getMeteoTemperature = async (apiEndpoint) => {
    try {
      const response = await axios.get(apiEndpoint);
      console.log(response.data);
      console.log("meteo " + response.data.current.temperature_2m);
      console.log("meteo wind " + response.data.current.wind_speed_10m);
      let wind = response.data.current.wind_speed_10m;
      return [response.data.current.temperature_2m, wind];
    } catch (error) {
      console.error("Error fetching meteo temperature:", error);
      return null;
    }
  };

  //doesn't currently work, activate the dang key WeatherMap!
  const getOpenWeatherTemperature = async (apiEndpoint) => {
    try {
      const response = await axios.get(apiEndpoint); //it sends it in kelvin for some stupid reason
      let actualTemp = response.data.main.temp - 273.15;
      console.log("Open Weather " + actualTemp);
      console.log("Open Weather wind " + response.data.wind.speed);
      console.log("Open Weather humidity " + response.data.main.humidity);
      let humidity = response.data.main.humidity;
      let wind = response.data.wind.speed;

      return [actualTemp, wind, humidity];
    } catch (error) {
      console.error("Error fetching openWeather temperature:", error);
      return null;
    }
  };
  const getWeatherApiTemperature = async (apiEndpoint) => {
    try {
      const response = await axios.get(apiEndpoint);
      console.log("weatherApi " + response.data.current.temp_c);
      console.log("weatherApi wind " + response.data.current.wind_kph);
      console.log("weatherApi humidity " + response.data.current.humidity);

      let wind = response.data.current.wind_kph;
      let humidity = response.data.current.humidity;
      return [response.data.current.temp_c, wind, humidity];
    } catch (error) {
      console.error("Error fetching weatherApi temperature:", error);
      return null;
    }
  };

  const fetchTemperatures = async () => {
    let temperatures = [];
    let windSpeeds = [];
    let humidities = [];

    //collect openMeteo data
    let openMeteo = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`;
    let [temp1, wind1] = await getMeteoTemperature(openMeteo);
    temperatures.push(await temp1);
    windSpeeds.push(await wind1);

    //collect openWeather data
    let openWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric,uk&APPID=${apiKey}`;
    let [temp2, wind2, humidity2] =
      await getOpenWeatherTemperature(openWeather);
    temperatures.push(await temp2);
    windSpeeds.push(await wind2);
    humidities.push(await humidity2);
    //collect weatherApi data
    let weatherApi = `https://api.weatherapi.com/v1/current.json?key=${apiKey2}&q=${city}`;
    let [temp3, wind3, humidity3] = await getWeatherApiTemperature(weatherApi);
    temperatures.push(await temp3);
    windSpeeds.push(await wind3);
    humidities.push(await humidity3);

    try {
      const filteredWindSpeeds = windSpeeds.filter((wind) => wind !== null);
      const filteredTemperatures = temperatures.filter((temp) => temp !== null); //filter removes null values
      const filteredHumidities = humidities.filter(
        (humidity) => humidity !== null,
      );

      let total = 0;
      for (let i = 0; i < filteredTemperatures.length; i++) {
        total += filteredTemperatures[i];
      }

      let windTotal = 0;
      for (let i = 0; i < filteredWindSpeeds.length; i++) {
        windTotal += filteredWindSpeeds[i];
      }

      let humidityTotal = 0;
      for (let i = 0; i < filteredHumidities.length; i++) {
        humidityTotal += filteredHumidities[i];
      }

      let averageWindSpeed = windTotal / filteredWindSpeeds.length;
      let averageTemp = total / filteredTemperatures.length;

      setAverageHumidity(humidityTotal / filteredHumidities.length);
      setAverageWindSpeeds(averageWindSpeed.toFixed(2));
      setAverageTemperature(averageTemp.toFixed(2)); //tofixed rounds to 2 decimal places

      //changing the highlight for title based off temperature
      const h1Element = document.querySelector("h1");
      if (parseFloat(averageTemp) > 15) {
        h1Element.classList.remove("below-15");
        h1Element.classList.add("above-15");
      } else {
        h1Element.classList.remove("above-15");
        h1Element.classList.add("below-15");
      }
    } catch (error) {
      console.error("Error fetching temperatures:", error);
    }
  };

  return (
    <div>
      <h1>Weather Aggregator</h1>
      <table>
        <thead>
          <tr></tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <button onClick={() => getCoords("Cairo")}>Cairo</button>
            </td>
            <td>
              <button onClick={() => getCoords("London")}>London</button>
            </td>
            <td>
              <button onClick={() => getCoords("Beijing")}>Beijing</button>
            </td>
            <td>
              <button onClick={() => getCoords("Sydney")}>Sidney</button>
            </td>
          </tr>
          <tr>
            <td>
              <button onClick={() => getCoords("Mumbai")}>Mumbai</button>
            </td>

            <td>
              <button onClick={() => getCoords("Tokyo")}>Tokyo</button>
            </td>
            <td>
              <button onClick={() => getCoords("New York")}>New York</button>
            </td>
            <td>
              <button onClick={() => getCoords("Paris")}>Paris</button>
            </td>
          </tr>
          <tr>
            <td>
              <button onClick={() => getCoords("Bangkok")}>Bangkok</button>
            </td>
            <td>
              <button onClick={() => getCoords("Karachi")}>Karachi</button>
            </td>
            <td>
              <button onClick={() => getCoords("Moscow")}>Moscow</button>
            </td>
            <td>
              <button onClick={() => getCoords("Berlin")}>Berlin</button>
            </td>
          </tr>
          <tr>
            <td>
              <button onClick={() => getCoords("Dublin")}>Dublin</button>
            </td>
            <td>
              <button onClick={() => getCoords("Seoul")}>Seoul</button>
            </td>
            <td>
              <button onClick={() => getCoords("Lima")}>Lima</button>
            </td>
          </tr>
        </tbody>
      </table>
      <br></br>
      <br></br>
      <label>
        <input type="text" value={city} />
      </label>
      <br></br>
      <br></br>
      <button onClick={fetchTemperatures}>Get Averages</button>

      {averageTemperature !== null ? (
        <div>
          <h2>Average Temperature</h2>
          <p>{averageTemperature} °C</p>
        </div>
      ) : (
        <div>
          <h2>Average Temperature</h2>
          <p>Results Appear Here!!</p>
        </div>
      )}
      {averageWindSpeeds !== null ? (
        <div>
          <h2>Average Wind Speed</h2>
          <p>{averageWindSpeeds} kph</p>
        </div>
      ) : (
        <div>
          <h2>Average Wind Speed</h2>
          <p>Results Appear Here!!</p>
        </div>
      )}

      {averageHumidity !== null ? (
        <div>
          <h2>Average humidity</h2>
          <p>{averageHumidity} %</p>
        </div>
      ) : (
        <div>
          <h2>Average Humidity</h2>
          <p>Results Appear Here!!</p>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <WeatherApp />
    </div>
  );
}
