import { StrictMode } from "react";
import { createRoot } from "react-dom";

import App from "./src/App.jsx";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
