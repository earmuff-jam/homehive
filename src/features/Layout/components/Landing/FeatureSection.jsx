import React from "react";

import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { LANDING_PAGE_DETAILS } from "features/Layout/components/Landing/constants";

export default function FeatureSection() {
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
          Features Designed for Efficiency
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 8, maxWidth: "800px", mx: "auto" }}
        >
          Our application focuses on what matters: getting you paid faster with
          minimal effort.
        </Typography>

        <Grid container spacing={4}>
          {LANDING_PAGE_DETAILS.features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                sx={{
                  height: "100%",
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-8px)", boxShadow: 6 },
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
