import CityButton from "./CityButton";
function Row(props) {
  return (
    <div>
      <CityButton city={props.names[0]} onClick={props.onClick} />
      <CityButton city={props.names[1]} onClick={props.onClick} />
      <CityButton city={props.names[2]} onClick={props.onClick} />
      <CityButton city={props.names[3]} onClick={props.onClick} />
      <CityButton city={props.names[4]} onClick={props.onClick} />
    </div>
  );
}

export default Row;
