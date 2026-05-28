import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Page Imports
import HomePage from "./pages/home/HomePage.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import { EditResume } from "./pages/dashboard/edit-resume/[resume_id]/EditResume.jsx";
import ViewResume from "./pages/dashboard/view-resume/[resume_id]/ViewResume.jsx";
import AuthPage from "./pages/auth/customAuth/AuthPage.jsx";

// 1. ALIGNMENT FIX: Import the Cover Letter component
import CoverLetter from "./pages/dashboard/components/CoverLetter.jsx"; 

import { store } from "./store/store"; 
import { Provider } from "react-redux";

const router = createBrowserRouter([
  {
    // 2. ALIGNMENT FIX: Everything inside this 'children' array gets the Header from App.jsx!
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        // 3. ALIGNMENT FIX: Add the new Cover Letter route here
        path: "/dashboard/cover-letter",
        element: <CoverLetter />,
      },
      {
        path: "/dashboard/edit-resume/:resume_id",
        element: <EditResume />,
      },
      {
        path: "/dashboard/view-resume/:resume_id",
        element: <ViewResume />,
      },
    ],
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth/sign-in",
    element: <AuthPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);