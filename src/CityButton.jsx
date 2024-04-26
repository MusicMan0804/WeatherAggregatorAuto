function CityButton(props) {
  return (
    <button onClick={() => props.onClick(props.city)}>{props.city}</button>
  );
}

export default CityButton;
