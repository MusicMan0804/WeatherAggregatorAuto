function RegionButton(props) {
  return (
    <button className="Regional" onClick={() => props.onClick(props.value)}>
      {props.region}
    </button>
  );
}

export default RegionButton;
