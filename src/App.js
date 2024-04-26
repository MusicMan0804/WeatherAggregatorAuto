import "./styles.css";
import React, { useState } from "react";
import axios from "axios";
import Output from "./Output";
import Row from "./Row";
import RegionButton from "./RegionButton";
import InputBar from "./InputBar";

const WeatherApp = () => {
  const [city, setCity] = useState("Null Island");
  const [averageTemperature, setAverageTemperature] = useState(null);
  const [averageWindSpeeds, setAverageWindSpeeds] = useState(null);
  const [averageHumidity, setAverageHumidity] = useState(null);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [rowDisplay, setRowDisplay] = useState(null);
  const apiKey = "a68fcc53181bfaec09e740708d952020"; // for open weather map
  const apiKey2 = "5e2c7e0967a947d0a35201701240103"; //for weather api

  const rowOc = ["Sidney", "Melbourne", "Port Moresby", "Suva", "Auckland"];
  const rowAs = ["Beijing", "Mumbai", "Karachi", "Tokyo", "Bangkok"];
  const rowSa = ["Brasilia", "Lima", "Caracas", "Recife", "Buenos Aires"];
  const rowEu = ["Athens", "Dublin", "Berlin", "London", "Paris"];
  const rowNa = ["Chicago", "New York", "Mexico City", "Ottawa", "Montreal"];

  //longitude and latitude constants
  let coordMap = {
    //"City": (Latitude, Longitude)
    Cairo: [30.0444, 31.2357],
    Tokyo: [35.6895, 139.6917],
    Mumbai: [19.0761, 72.8777],
    Karachi: [24.8607, 67.0011],
    London: [51.5098, -0.118],
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
    "Mexico City": [19.4326, -99.1332],
    Ottawa: [45.4215, -75.6972],
    "Port Moresby": [-9.4431, 147.1807],
    Recife: [-8.0533, -34.8811],
    Caracas: [10.4806, -66.9036],
    "Buenos Aires": [-34.6037, -58.3816],
    Sidney: [-33.8688, 151.2093],
    Auckland: [-36.8485, 174.7633],
    Athens: [37.9838, 23.7275],
    Chicago: [41.8781, -87.6298],
    Montreal: [45.5089, -73.5617],
    Brasilia: [-15.7782, -47.9294],
    Suva: [-18.1333, 178.4417],
    Melbourne: [-37.8136, 144.9631],
    "Null Island": [0, 0],
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
      console.log(
        "meteo humidity " + response.data.current.relative_humidity_2m
      );
      let wind = response.data.current.wind_speed_10m;
      let humidity = response.data.current.relative_humidity_2m;
      return [response.data.current.temperature_2m, wind, humidity];
    } catch (error) {
      console.error("Error fetching meteo temperature:", error);
      return null;
    }
  };

  //doesn't currently work, activate the dang key WeatherMap!
  const getOpenWeatherTemperature = async (apiEndpoint) => {
    try {
      const response = await axios.get(apiEndpoint);
      let actualTemp = response.data.main.temp - 273.15; //it sends it in kelvin for some stupid reason
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

  const fetchAverages = async () => {
    let temperatures = [];
    let windSpeeds = [];
    let humidities = [];

    //collect openMeteo data

    let openMeteo = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`;
    let [temp1, wind1, Humidity1] = await getMeteoTemperature(openMeteo);
    temperatures.push(await temp1);
    windSpeeds.push(await wind1);
    humidities.push(await Humidity1);

    if (city !== "Null Island") {
      //collect openWeather data
      let openWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric,uk&APPID=${apiKey}`;
      let [temp2, wind2, humidity2] = await getOpenWeatherTemperature(
        openWeather
      );
      temperatures.push(await temp2);
      windSpeeds.push(await wind2);
      humidities.push(await humidity2);
      //collect weatherApi data
      let weatherApi = `https://api.weatherapi.com/v1/current.json?key=${apiKey2}&q=${city}`;
      let [temp3, wind3, humidity3] = await getWeatherApiTemperature(
        weatherApi
      );
      temperatures.push(await temp3);
      windSpeeds.push(await wind3);
      humidities.push(await humidity3);
    }

    try {
      const filteredWindSpeeds = windSpeeds.filter((wind) => wind !== null);
      const filteredTemperatures = temperatures.filter((temp) => temp !== null); //filter removes null values
      const filteredHumidities = humidities.filter(
        (humidity) => humidity !== null
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
      let averageHumidity = humidityTotal / filteredHumidities.length;
      setAverageHumidity(averageHumidity.toFixed(2));
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
      <br />
      <RegionButton onClick={setRowDisplay} region="Asia" value="As" />
      <RegionButton onClick={setRowDisplay} region="N. America" value="Na" />
      <RegionButton onClick={setRowDisplay} region="S. America" value="Sa" />
      <RegionButton onClick={setRowDisplay} region="Europe" value="Eu" />
      <RegionButton onClick={setRowDisplay} region="Oceania" value="Oc" />
      {rowDisplay === "As" ? (
        <Row names={rowAs} onClick={getCoords} />
      ) : rowDisplay === "Na" ? (
        <Row names={rowNa} onClick={getCoords} />
      ) : rowDisplay === "Sa" ? (
        <Row names={rowSa} onClick={getCoords} />
      ) : rowDisplay === "Eu" ? (
        <Row names={rowEu} onClick={getCoords} />
      ) : rowDisplay === "Oc" ? (
        <Row names={rowOc} onClick={getCoords} />
      ) : null}
      <div>
        <InputBar label="Name: " value={city} />
        <InputBar label="Latitude: " value={latitude} />
        <InputBar label="Longitude: " value={longitude} />
      </div>
      <br />
      <br />
      <button onClick={fetchAverages}>Get Averages</button>
      <Output text="Average Temperature" value={averageTemperature} unit="°C" />
      <Output text="Average Wind Speed" value={averageWindSpeeds} unit="kph" />
      <Output text="Average Humidity" value={averageHumidity} unit="%" />
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
