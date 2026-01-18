import { useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { TourProvider } from "@reactour/tour";
import ScrollTopProvider from "common/ScrollTop/ScrollTopProvider";
import { GeneratedTourSteps } from "common/Tour/TourSteps";
import Layout from "features/Layout/Layout";
import { useBuildAppRoutes } from "hooks/useBuildAppRoutes";
import { MainAppRoutes } from "src/Routes";
import { darkTheme, lightTheme } from "src/Theme";
import { TThemeIdx } from "src/types";

function App() {
  const [currentThemeIdx, setCurrentThemeIdx] = useState<TThemeIdx>(
    (localStorage.getItem("theme") || "0") as TThemeIdx,
  );

  return (
    <ThemeProvider theme={currentThemeIdx === "0" ? lightTheme : darkTheme}>
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
                {useBuildAppRoutes(MainAppRoutes)}
              </Route>
            </Routes>
          </BrowserRouter>
        </ScrollTopProvider>
      </TourProvider>
    </ThemeProvider>
  );
}

export default App;
