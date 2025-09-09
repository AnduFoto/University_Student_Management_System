


import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = localStorage.getItem("access");

  if (token) {
    const lastPage = localStorage.getItem("lastPage") || "/";
    return <Navigate to={lastPage} replace />;
  }

  return <Outlet />;
}

