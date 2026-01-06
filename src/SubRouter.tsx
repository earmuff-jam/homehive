import { Navigate, Route, Routes } from "react-router-dom";

import { buildAppRoutes } from "common/ValidateClientPermissions";

// TSubAppRouterProps ...
type TSubAppRouterProps = {
  routes: string[];
  fallbackPath: string;
};

const SubAppRouter = ({ routes, fallbackPath = "/" }: TSubAppRouterProps) => {
  const builtRoutes = buildAppRoutes(routes);

  return (
    <Routes>
      {builtRoutes}
      <Route path="*" element={<Navigate to={fallbackPath} replace />} />
    </Routes>
  );
};

export default SubAppRouter;
