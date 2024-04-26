function Output(props) {
  if (props.value !== null) {
    return (
      <div>
        <h2>{props.text}</h2>
        <p>
          {props.value} {props.unit}
          {props.value2 !== "N/A" ? (
            <div>
              <br></br>
              {props.value2} {props.unit2}
            </div>
          ) : (
            ""
          )}
          {props.value3 !== "N/A" ? (
            <div>
              <br></br>
              {props.value3} {props.unit3}
            </div>
          ) : (
            ""
          )}
        </p>
        <p>Open Meteo: -1.5</p>
        <p>Weather API: +0.4</p>
        <p>Open Weather: -3.3</p>
      </div>
    );
  } else {
    return (
      <div>
        <br></br>
        <h2>{props.text}</h2>
        <p>{props.text} Appears Here!!!</p>
      </div>
    );
  }
}
export default Output;
