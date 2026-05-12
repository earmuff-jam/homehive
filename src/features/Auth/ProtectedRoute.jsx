import React from "react";

import { Navigate } from "react-router-dom";

import { Skeleton } from "@mui/material";
import { HomeRouteUri } from "common/utils";

// ProtectedRoute ...
// defines a component that guards against unauthorized use
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Skeleton height="100%" />;

  if (!user) {
    return <Navigate to={HomeRouteUri} replace />;
  }

  return children;
};

export default ProtectedRoute;
