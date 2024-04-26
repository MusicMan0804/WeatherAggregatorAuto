function Output(props) {
  if (props.value !== null) {
    return (
      <div>
        <br></br>
        <h2>{props.text}</h2>
        <p>
          {props.value} {props.unit}
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
