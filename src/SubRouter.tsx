import { Navigate, Route, Routes } from "react-router-dom";

import { useBuildAppRoutes } from "hooks/useBuildAppRoutes";
import { TAppRoute } from "src/types";

// TSubAppRouterProps ...
type TSubAppRouterProps = {
  routes: TAppRoute[];
  fallbackPath: string;
};

const SubAppRouter = ({ routes, fallbackPath = "/" }: TSubAppRouterProps) => (
  <Routes>
    {useBuildAppRoutes(routes)}
    <Route path="*" element={<Navigate to={fallbackPath} replace />} />
  </Routes>
);

export default SubAppRouter;
