import React, { useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { TourProvider } from "@reactour/tour";
import ScrollTopProvider from "common/ScrollTop/ScrollTopProvider";
import { darkTheme, lightTheme } from "common/Theme";
import { GeneratedTourSteps } from "common/Tour/TourSteps";
import { buildAppRoutes } from "common/ValidateClientPerms";
import Layout from "features/Layout/Layout";
import { fetchLoggedInUser } from "features/Rent/common/utils";
import { MainAppRoutes } from "src/Routes";

function App() {
  const user = fetchLoggedInUser();
  const [currentThemeIdx, setCurrentThemeIdx] = useState(
    localStorage.getItem("theme") || 0,
  );

  return (
    <ThemeProvider
      theme={Number(currentThemeIdx) === 0 ? lightTheme : darkTheme}
    >
      <CssBaseline />
      <TourProvider steps={GeneratedTourSteps}>
        <ScrollTopProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout
                    routes={MainAppRoutes}
                    currentThemeIdx={currentThemeIdx}
                    setCurrentThemeIdx={setCurrentThemeIdx}
                  />
                }
              >
                {buildAppRoutes(MainAppRoutes, user?.role)}
              </Route>
            </Routes>
          </BrowserRouter>
        </ScrollTopProvider>
      </TourProvider>
    </ThemeProvider>
  );
}

export default App;
