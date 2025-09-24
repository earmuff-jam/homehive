import { useNavigate } from "react-router-dom";

import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import AButton from "common/AButton";
import {
  PropertiesRouteUri,
  RentalRouteUri,
  isUserLoggedIn,
} from "common/utils";
import { useCreateUserMutation } from "features/Api/firebaseUserApi";
import { authenticateViaGoogle } from "features/Auth/AuthHelper";
import {
  OwnerRole,
  TenantRole,
} from "features/Layout/components/Landing/constants";

export default function HeroSection() {
  const navigate = useNavigate();
  const isLoggedIn = isUserLoggedIn();
  const [createUser] = useCreateUserMutation();

  // creates a user in the db
  const handleCreateUser = async (user, roleType = TenantRole) => {
    try {
      const createdUser = await createUser({
        ...user,
        role: roleType,
      }).unwrap();

      // after we create the user, we update our role to keep app in sync
      if (createdUser?.uid) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: createdUser.uid,
            role: createdUser.role,
            googleEmailAddress: createdUser?.googleEmailAddress,
          }),
        );
      }
      return createdUser;
    } catch (err) {
      /* eslint-disable no-console */
      console.error("Create failed:", err);
      throw err;
    }
  };

  const handlePropertyOwnerLogin = async () => {
    try {
      const userDetails = await authenticateViaGoogle();
      const createdUser = await handleCreateUser(userDetails, OwnerRole);

      if (createdUser) {
        // force refresh
        createdUser?.role === OwnerRole
          ? navigate(`${PropertiesRouteUri}?refresh=${Date.now()}`)
          : navigate(`${RentalRouteUri}?refresh=${Date.now()}`);
      }
    } catch (error) {
      /* eslint-disable no-console */
      console.error("Unable to login. Error: ", error);
    }
  };

  const handleTenantLogin = async () => {
    try {
      const userDetails = await authenticateViaGoogle();
      const createdUser = await handleCreateUser(userDetails, TenantRole);

      if (createdUser) {
        // force refresh
        createdUser?.role === OwnerRole
          ? navigate(`${PropertiesRouteUri}?refresh=${Date.now()}`)
          : navigate(`${RentalRouteUri}?refresh=${Date.now()}`);
      }
    } catch (error) {
      /* eslint-disable no-console */
      console.error("Unable to login. Error: ", error);
    }
  };

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
            <Typography variant="h5" sx={{ textTransform: "initial" }}>
              Create and manage rents in seconds. No complexity, just results.
            </Typography>

            <Stack>
              <Stack direction="row" spacing={1} margin="4rem 0rem 1rem 0rem">
                {!isLoggedIn && (
                  <AButton
                    label="Manage Properties"
                    variant="contained"
                    size="large"
                    onClick={handlePropertyOwnerLogin}
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
                <Stack
                  direction="row"
                  sx={{ cursor: "pointer", textTransform: "initial" }}
                  onClick={handleTenantLogin}
                >
                  <Typography variant="h6">
                    Are you a Renter?
                    <Box
                      component="span"
                      color="secondary.main"
                      sx={{ margin: "0rem 0.5rem", textTransform: "initial" }}
                    >
                      Login here
                    </Box>
                  </Typography>
                </Stack>
              )}
            </Stack>
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
               <img src="/logo.png" style={{  width: "100%", height: "auto" }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
