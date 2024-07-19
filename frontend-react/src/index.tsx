import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./utils/translation/i18n";
import "/node_modules/primeflex/primeflex.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import reportWebVitals from "./reportWebVitals";
import { PrimeReactProvider } from "primereact/api";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./layout/main-layout/MainLayout";
import { ToastContextProvider } from "./shared/components/toast/context/ToastContextProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [{ index: true, element: <App /> }],
  },
]);

root.render(
  // <React.StrictMode>
  <PrimeReactProvider>
    <ToastContextProvider style={{ fontFamily: "Caroline" }}>
      <RouterProvider router={router} />
    </ToastContextProvider>
  </PrimeReactProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
