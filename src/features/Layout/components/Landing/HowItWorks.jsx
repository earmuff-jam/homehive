import React from "react";

import { Box, Container, Grid, Typography } from "@mui/material";
import { LANDING_PAGE_DETAILS } from "features/Layout/components/Landing/constants";

export default function HowItWorks() {
  return (
    <Box sx={{ py: { xs: 8, sm: 12 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          fontWeight="medium"
        >
          How It Works
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 8, maxWidth: "800px", mx: "auto" }}
        >
          Get started in minutes with our simple four-step process.
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {LANDING_PAGE_DETAILS.howItWorks.map((step, idx) => (
            <Grid item xs={12} md={6} lg={3} key={idx}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    mb: 3,
                    mx: "auto",
                  }}
                >
                  {idx + 1}
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  fontWeight="bold"
                >
                  {step.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {step.description}
                </Typography>

                {idx < LANDING_PAGE_DETAILS.howItWorks.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: "none", lg: "block" },
                      position: "absolute",
                      top: "50px",
                      right: "-16px",
                      width: "30px",
                      height: "2px",
                      bgcolor: "grey.300",
                      zIndex: 1,
                    }}
                  />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
