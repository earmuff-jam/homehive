import React, { useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { TourProvider } from "@reactour/tour";
import { buildAppRoutes } from "common/ApplicationConfig";
import ScrollTopProvider from "common/ScrollTop/ScrollTopProvider";
import { GeneratedTourSteps } from "common/TourSteps";
import Layout from "features/Layout/Layout";
import { MainAppRoutes } from "src/Routes";
import { darkTheme, lightTheme, neoBrutalistTheme } from "src/Theme";

function App() {
  const [currentThemeIdx, setCurrentThemeIdx] = useState(
    localStorage.getItem("theme") || 0,
  );

  const applyTheme = (key) => {
    switch (key) {
      case 0:
        return lightTheme;
      case 1:
        return darkTheme;
      case 2:
        return neoBrutalistTheme;
    }
  };

  return (
    <ThemeProvider theme={applyTheme(Number(currentThemeIdx))}>
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
                {buildAppRoutes(MainAppRoutes)}
              </Route>
            </Routes>
          </BrowserRouter>
        </ScrollTopProvider>
      </TourProvider>
    </ThemeProvider>
  );
}

export default App;
