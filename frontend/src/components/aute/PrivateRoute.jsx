import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ allowedRoles }) {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}



// import { Navigate, Outlet, useLocation } from "react-router-dom";

// export default function PrivateRoute({ allowedRoles }) {
//     const token = localStorage.getItem("access");
//     const role = localStorage.getItem("role");
//     const location = useLocation();

//     // If no token, send to login and preserve where they came from
//     if (!token) {
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }

//     // If user doesn't have permission
//     if (allowedRoles && !allowedRoles.includes(role)) {
//         return <Navigate to="/unauthorized" replace />;
//     }

//     // If everything is fine, render child routes
//     return <Outlet />;
// }
