import { useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { TourProvider } from "@reactour/tour";
import ScrollTopProvider from "common/ScrollTop/ScrollTopProvider";
import { GeneratedTourSteps } from "common/Tour/TourSteps";
import { buildAppRoutes } from "common/ValidateClientPermissions";
import Layout from "features/Layout/Layout";
import { MainAppRoutes } from "src/Routes";
import { darkTheme, lightTheme } from "src/Theme";

function App() {
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
