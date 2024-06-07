import "./MainLayout.css";
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";

export const MainLayout = () => {
  return (
    <div className="h-full">
      <Navbar />
      <div className="main-layout-outlet_container">
        <Outlet />
      </div>
    </div>
  );
};
