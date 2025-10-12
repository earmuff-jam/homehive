import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Container, Grid, Typography } from "@mui/material";
import { ViewInvoiceRouteUri } from "common/utils";
import AButton from "src/common/AButton";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: "primary.light",
        color: "primary.contrastText",
        pt: { xs: 8, sm: 12, md: 16 },
        pb: { xs: 8, sm: 12, md: 16 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Simple. Powerful. Professional.
            </Typography>
            <Typography variant="h5">
              Create and manage invoices in seconds. No complexity, just
              results.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <AButton
                label="Take me there"
                variant="contained"
                size="large"
                onClick={() => navigate(ViewInvoiceRouteUri)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ position: "relative" }}>
            <Box
              sx={{
                width: "100%",
                height: { xs: "300px", sm: "400px", md: "480px" },
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 8,
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box sx={{ p: 3, textAlign: "center" }}>
                <img src="/invoicer-logo.png" />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
