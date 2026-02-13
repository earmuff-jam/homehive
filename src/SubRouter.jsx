import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";

import { buildAppRoutes } from "common/ApplicationConfig";

const SubAppRouter = ({ routes, fallbackPath = "/" }) => {
  const builtRoutes = buildAppRoutes(routes);

  return (
    <Routes>
      {builtRoutes}
      <Route path="*" element={<Navigate to={fallbackPath} replace />} />
    </Routes>
  );
};

export default SubAppRouter;
