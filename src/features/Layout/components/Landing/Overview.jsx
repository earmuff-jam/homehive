import React from "react";

import { Box } from "@mui/material";
import FeatureSection from "features/Layout/components/Landing/FeatureSection";
import HeroSection from "features/Layout/components/Landing/HeroSection";
import HowItWorks from "features/Layout/components/Landing/HowItWorks";
import Testimonials from "features/Layout/components/Landing/Testimonials";
import { useAppTitle } from "hooks/useAppTitle";

export default function Overview() {
  useAppTitle("Home");

  return (
    <Box sx={{ flexGrow: 1 }}>
      <HeroSection />
      <FeatureSection />
      <HowItWorks />
      <Testimonials />
    </Box>
  );
}
