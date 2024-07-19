import { CSSProperties } from "react";
import "./MainLayout.css";
import { Outlet } from "react-router-dom";

const style: CSSProperties = {
  backgroundImage: `url("${window.origin}/background.png")`,
  backgroundSize: 'cover'
};

export const MainLayout = () => {
  return (
    <div className="h-full">
      <div style={style} className="main-layout-outlet_container">
        <Outlet />
      </div>
    </div>
  );
};
