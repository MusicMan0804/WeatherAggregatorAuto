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

  //diffs structured like so [meteo, Open Weather, Weather API, future APIs], using only main units for now
  const [temperatureDiffs, setTempDiffs] = useState([]);
  const [windDiffs, setWindDiffs] = useState([]);
  const [humidityDiffs, setHumidityDiffs] = useState([]);

  //keys
  const apiKey = "a68fcc53181bfaec09e740708d952020"; // for open weather map
  const apiKey2 = "5e2c7e0967a947d0a35201701240103"; //for weather api

  const rowOc = ["Sidney", "Melbourne", "Port Moresby", "Suva", "Auckland"];
  const rowOc2 = ["Perth", "Honiara", "Hawaii", "Brisbane", "Adelaide"];

  const rowAs = ["Beijing", "Mumbai", "Karachi", "Tokyo", "Bangkok"];
  const rowAs2 = ["Singapore", "Ankara", "Yangon", "Ulaanbaatar", "Tbilisi"];

  const rowSa = ["Brasilia", "Lima", "Caracas", "Recife", "Buenos Aires"];
  const rowSa2 = ["Salvador", "Fortaleza", "Curitiba", "El Alto", "Soledad"];

  const rowEu = ["Athens", "Dublin", "Berlin", "London", "Paris"];
  const rowEu2 = ["Barcelona", "Sofia", "Prague", "Odesa", "Warsaw"];

  const rowNa = ["Chicago", "New York", "Mexico City", "Ottawa", "Montreal"];
  const rowNa2 = ["Los Angeles", "Houston", "Havana", "Toronto", "Tijuana"];

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
    Perth: [-31.953512, 115.857048],
    Honiara: [-9.43333, 159.95],
    Hawaii: [19.741755, -155.844437],
    Brisbane: [-27.470125, 153.021072],
    Singapore: [1.29027, 103.851959],
    Ankara: [39.925533, 32.866287],
    Yangon: [16.80528, 96.15611],
    Tbilisi: [41.715138, 44.827096],
    Salvador: [-12.97111, -38.51083],
    Fortaleza: [-3.71722, -38.54306],
    Curitiba: [-25.42778, -49.27306],
    "El Alto": [-16.50472, -68.16333],
    Soledad: [36.42469, -121.32632],
    Barcelona: [41.3888, 2.159],
    Sofia: [42.6975, 23.32422],
    Prague: [50.05, 14.253],
    Odesa: [46.4775, 30.73264],
    Warsaw: [52.22977, 21.011785],
    "Los Angeles": [34.052235, -118.2436836],
    Houston: [29.75, -95.377],
    Havana: [23.113592, -82.3665928],
    Toronto: [43.65107, -79.3470159],
    Tijuana: [32.5027, -117.003711],
    Adelaide: [-34.92866, 138.59863],
    "Null Island": [0, 0],
    Ulaanbaatar: [47.92123, 106.918556],
  };

  //Pass in city, get coords from map
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
    let tempDiffs = [];
    let wDiffs = [];
    let humidDiffs = [];

    //collect openMeteo data
    let openMeteo = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`;
    let [temp1, wind1, Humidity1] = await getMeteoTemperature(openMeteo);
    //add data to appropriate arrays
    temperatures.push(await temp1);
    windSpeeds.push(await wind1);
    humidities.push(await Humidity1);

    if (city !== "Null Island") {
      //Null island not actual city name so apis that use names are excluded
      //collect openWeather data
      let openWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric,uk&APPID=${apiKey}`;
      let [temp2, wind2, humidity2] = await getOpenWeatherTemperature(
        openWeather
      );
      //add data to appropriate arrays
      temperatures.push(await temp2);
      windSpeeds.push(await wind2);
      humidities.push(await humidity2);

      //collect weatherApi data
      let weatherApi = `https://api.weatherapi.com/v1/current.json?key=${apiKey2}&q=${city}`;
      let [temp3, wind3, humidity3] = await getWeatherApiTemperature(
        weatherApi
      );
      //add data to appropriate arrays
      temperatures.push(await temp3);
      windSpeeds.push(await wind3);
      humidities.push(await humidity3);
    }

    try {
      //remove any failed calls from lists
      const filteredWindSpeeds = windSpeeds.filter((wind) => wind !== null);
      const filteredTemperatures = temperatures.filter((temp) => temp !== null);
      const filteredHumidities = humidities.filter(
        (humidity) => humidity !== null
      );

      //Get sums of all compiled data
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

      //calc averages
      let averageWindSpeed = windTotal / filteredWindSpeeds.length;
      let averageTemp = total / filteredTemperatures.length;
      let averageHumidity = humidityTotal / filteredHumidities.length;

      //get differences
      tempDiffs = filteredTemperatures.map((item) =>
        (averageTemp - item).toFixed(2)
      );
      //applies to function to every item in lsit, pass in an item and return that item subtracted from averagetemp and rounded
      wDiffs = filteredWindSpeeds.map((item) =>
        (averageWindSpeed - item).toFixed(2)
      );
      humidDiffs = filteredHumidities.map((item) =>
        (averageHumidity - item).toFixed(2)
      );

      setAverageHumidity(averageHumidity.toFixed(2));
      setAverageWindSpeeds(averageWindSpeed.toFixed(2));
      setAverageTemperature(averageTemp.toFixed(2));

      setTempDiffs(tempDiffs);
      setWindDiffs(wDiffs);
      setHumidityDiffs(humidDiffs);

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

  //Would like to refactor outputs in some way, passing in a lot of props
  //maybe pass an array of units and make calculations based on that in the component itself?
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
        <div>
          <Row names={rowAs} onClick={getCoords} />
          <Row names={rowAs2} onClick={getCoords} />
        </div>
      ) : rowDisplay === "Na" ? (
        <div>
          <Row names={rowNa} onClick={getCoords} />
          <Row names={rowNa2} onClick={getCoords} />
        </div>
      ) : rowDisplay === "Sa" ? (
        <div>
          <Row names={rowSa} onClick={getCoords} />
          <Row names={rowSa2} onClick={getCoords} />
        </div>
      ) : rowDisplay === "Eu" ? (
        <div>
          <Row names={rowEu} onClick={getCoords} />
          <Row names={rowEu2} onClick={getCoords} />
        </div>
      ) : rowDisplay === "Oc" ? (
        <div>
          <Row names={rowOc} onClick={getCoords} />
          <Row names={rowOc2} onClick={getCoords} />
        </div>
      ) : null}
      <div>
        <InputBar label="Name: " value={city} />
        <InputBar label="Latitude: " value={latitude} />
        <InputBar label="Longitude: " value={longitude} />
      </div>
      <br />
      <br />
      <button onClick={fetchAverages}>Get Averages</button>
      <Output
        text="Average Temperature"
        value={averageTemperature}
        unit="°C"
        value2={(averageTemperature * (9 / 5) + 32).toFixed(2)}
        unit2="°F"
        value3={(averageTemperature * 1 + 273).toFixed(2)}
        unit3="°K"
        diffs={temperatureDiffs}
      />
      <Output
        text="Average Wind Speed"
        value={averageWindSpeeds}
        unit="kph"
        value2={(averageWindSpeeds / 1.609344).toFixed(2)}
        unit2="mph"
        value3="N/A"
        diffs={windDiffs}
      />
      <Output
        text="Average Humidity"
        value={averageHumidity}
        unit="%"
        value2="N/A"
        unit2="N/A"
        value3="N/A"
        diffs={humidityDiffs}
      />
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
