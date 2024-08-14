import React, { CSSProperties } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./utils/translation/i18n";
import "/node_modules/primeflex/primeflex.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import reportWebVitals from "./reportWebVitals";
import { PrimeReactProvider } from "primereact/api";
import { ToastContextProvider } from "./shared/components/toast/context/ToastContextProvider";

const style: CSSProperties = {
  backgroundImage: `url("${window.origin}/background.png")`,
  backgroundSize: "cover",
  backgroundAttachment: "fixed",
  minHeight: '100%'
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <PrimeReactProvider>
    <ToastContextProvider style={{ fontFamily: "Caroline" }}>
      <div style={style}>
        <App />
      </div>
    </ToastContextProvider>
  </PrimeReactProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
