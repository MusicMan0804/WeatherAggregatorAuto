function InputBar(props) {
  const uniformWidth = {
    width: "100px",
  };
  return (
    <div>
      <br></br>
      <label>{props.label}</label>
      <input type="text" value={props.value} />
    </div>
  );
}

export default InputBar;
