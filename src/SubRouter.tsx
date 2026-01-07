import { Navigate, Route, Routes } from "react-router-dom";

import { TAppRoute } from "common/types";
import { buildAppRoutes } from "hooks/useBuildAppRoutes";

// TSubAppRouterProps ...
type TSubAppRouterProps = {
  routes: TAppRoute[];
  fallbackPath: string;
};

const SubAppRouter = ({ routes, fallbackPath = "/" }: TSubAppRouterProps) => (
  <Routes>
    {buildAppRoutes(routes)}
    <Route path="*" element={<Navigate to={fallbackPath} replace />} />
  </Routes>
);

export default SubAppRouter;
