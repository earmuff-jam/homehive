import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Alert, Box, Grid2, Stack, Typography } from "@mui/material";
import AButton from "common/AButton";
import { isUserLoggedIn } from "common/utils";
import { useAuthenticateMutation } from "features/Api/firebaseUserApi";
import {
  OwnerRole,
  TenantRole,
} from "features/Layout/components/Landing/constants";

export default function HeroSection() {
  const navigate = useNavigate();
  const isLoggedIn = isUserLoggedIn();

  const [
    authenticate,
    {
      isSuccess: isAuthSuccess,
      isLoading: isAuthLoading,
      isError: isAuthError,
    },
  ] = useAuthenticateMutation();

  const handleCreateUser = (role = TenantRole) => {
    authenticate(role);
  };

  useEffect(() => {
    if (!isAuthLoading && isAuthSuccess) {
      window.location.reload();
    }
  }, [isAuthLoading]);

  if (isAuthError)
    return (
      <Alert severity="error">
        <Typography>Error during log in. Please try again later.</Typography>
      </Alert>
    );

  return (
    <Box
      padding="1rem"
      sx={{
        bgcolor: "primary.light",
        color: "primary.contrastText",
        pt: { xs: 8, sm: 12, md: 16 },
        pb: { xs: 8, sm: 12, md: 16 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Grid2
        container
        spacing={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid2 item xs={12} sm={6}>
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Effortless rent management
          </Typography>
          <Typography variant="h5">
            Take control of your rentals in seconds — no clutter, no confusion.
          </Typography>

          <Stack>
            <Stack direction="row" spacing={1} margin="4rem 0rem 1rem 0rem">
              {!isLoggedIn && (
                <AButton
                  label="Manage Properties"
                  variant="contained"
                  size="large"
                  onClick={() => handleCreateUser(OwnerRole)}
                />
              )}
              <AButton
                label="Manage Invoices"
                variant="contained"
                size="large"
                onClick={() => navigate("invoice/view")}
              />
            </Stack>
            {!isLoggedIn && (
              <Stack direction="row">
                <Typography variant="h6">
                  Renting with us?
                  <Box
                    component="span"
                    color="secondary.main"
                    onClick={() => handleCreateUser(TenantRole)}
                    sx={{
                      cursor: "pointer",
                      margin: "0rem 0.5rem",
                    }}
                  >
                    Access your account
                  </Box>
                </Typography>
              </Stack>
            )}
          </Stack>
        </Grid2>
        <Grid2 item xs={12} sm={6}>
          <Box
            sx={{
              width: "100%",
              height: { xs: "200px", sm: "250px", md: "300px" },
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 8,
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/logo.png"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
}
