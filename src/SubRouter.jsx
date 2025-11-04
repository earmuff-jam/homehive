import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";

import { buildAppRoutes } from "common/ValidateClientPerms";

const SubAppRouter = ({ routes, role = "", fallbackPath = "/" }) => {
  const builtRoutes = buildAppRoutes(routes, role);

  return (
    <Routes>
      {builtRoutes}
      <Route path="*" element={<Navigate to={fallbackPath} replace />} />
    </Routes>
  );
};

export default SubAppRouter;
