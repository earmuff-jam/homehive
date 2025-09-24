import { useState } from "react";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { TourProvider } from "@reactour/tour";
import ScrollTopProvider from "common/ScrollTop/ScrollTopProvider";
import { darkTheme, lightTheme } from "common/Theme";
import { GeneratedTourSteps } from "common/Tour/TourSteps";
import { buildAppRoutes } from "common/validatePerms";
import Layout from "features/Layout/Layout";
import { fetchLoggedInUser } from "features/RentWorks/common/utils";
import { AppRoutes } from "src/Routes";

function App() {
  const user = fetchLoggedInUser();
  const [currentThemeIdx, setCurrentThemeIdx] = useState(
    localStorage.getItem("theme") || 0,
  );

  return (
    <TourProvider steps={GeneratedTourSteps}>
      <ThemeProvider
        theme={Number(currentThemeIdx) === 0 ? lightTheme : darkTheme}
      >
        <CssBaseline />
        <ScrollTopProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout
                    allValidRoutes={AppRoutes}
                    currentThemeIdx={currentThemeIdx}
                    setCurrentThemeIdx={setCurrentThemeIdx}
                  />
                }
              >
                {buildAppRoutes(AppRoutes, user?.role)}
              </Route>
              {/* force navigate to main page when routes are not found but wait until we have routes built first; prevents redirect in refresh */}
              {buildAppRoutes(AppRoutes).length > 0 && (
                <Route path="/*" element={<Navigate to="/" replace />} />
              )}
            </Routes>
          </BrowserRouter>
        </ScrollTopProvider>
      </ThemeProvider>
    </TourProvider>
  );
}

export default App;
