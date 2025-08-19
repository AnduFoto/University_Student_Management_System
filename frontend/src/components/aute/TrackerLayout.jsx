import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function TrackerLayout() {
  const location = useLocation();

  useEffect(() => {
    const excludedPaths = ["/login", "/register"];
    if (!excludedPaths.includes(location.pathname)) {
      localStorage.setItem("lastPage", location.pathname);
    }
  }, [location]);

  return <Outlet />;
}
