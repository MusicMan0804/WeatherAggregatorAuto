function titleAnimation(averageTemp) {
  const h1Element = document.querySelector("h1");
  if (parseFloat(averageTemp) > 15) {
    h1Element.classList.remove("below-15");
    h1Element.classList.add("above-15");
  } else {
    h1Element.classList.remove("above-15");
    h1Element.classList.add("below-15");
  }
}
export default titleAnimation;
