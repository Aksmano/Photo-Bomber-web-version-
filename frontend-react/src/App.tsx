import React from "react";
import "./App.css";
import { PhotoUpload } from "./pages/photo-upload/PhotoUpload";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { MainLayout } from "./layout/main-layout/MainLayout";

const App: React.FC = () => {
  // return <PhotoUpload />;
  // return <VideoRecorder />;
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <PhotoUpload />,
        },
        // {
        //   path: "video",
        //   element: <VideoRecorder />,
        // },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
