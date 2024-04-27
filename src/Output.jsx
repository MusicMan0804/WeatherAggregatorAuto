function Output(props) {
  if (props.value !== null) {
    let symbols = [];
    for (let i = 0; i < props.diffs.length; i++) {
      if (props.diffs[i] > 0) {
        symbols[i] = "+";
      } else {
        symbols[i] = "";
      }
    }
    return (
      <div>
        <br></br>
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
        <h2>Differences</h2>
        <p>
          Open Meteo: {symbols[0]}
          {props.diffs[0]} {props.unit}
        </p>
        <p>
          Weather API: {symbols[1]}
          {props.diffs[1]} {props.unit}
        </p>
        <p>
          Open Weather: {symbols[2]}
          {props.diffs[2]} {props.unit}
        </p>
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
