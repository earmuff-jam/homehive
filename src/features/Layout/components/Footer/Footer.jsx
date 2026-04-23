import React from "react";

import { Box, Link, Stack, Typography, useTheme } from "@mui/material";

function Footer() {
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        py: 5,
        px: 2,
        background:
          "radial-gradient(ellipse, rgba(14,124,107,.09) 0%, transparent 100%)",
      }}
      className="no-print"
    >
      <Stack spacing={2} alignItems="center">
        <Typography
          sx={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "1.4rem",
            letterSpacing: "-0.02em",
          }}
        >
          Homehive
        </Typography>

        {/* Links */}
        <Stack
          direction="row"
          spacing={3}
          flexWrap="wrap"
          justifyContent="center"
        >
          {["Privacy Policy", "Terms of Service", "Contact", "Help Center"].map(
            (text) => (
              <Link
                key={text}
                href="#"
                underline="none"
                sx={{
                  fontSize: "0.85rem",
                  transition: "0.2s",
                  "&:hover": {
                    color: theme.palette.text.primary,
                  },
                }}
              >
                {text}
              </Link>
            ),
          )}
        </Stack>

        <Box
          sx={{
            width: "100%",
            maxWidth: 600,
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.08)",
            mt: 1,
          }}
        />

        <Typography sx={{ fontSize: "0.8rem", opacity: 0.7 }}>
          ©2024 Earmuffjam LLC. All rights reserved.
        </Typography>
      </Stack>
    </Box>
  );
}

export default Footer;
