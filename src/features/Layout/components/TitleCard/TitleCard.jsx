import React from "react";

import { Box, Card, CardContent, Chip, Typography } from "@mui/material";

export default function TitleCard({
  title,
  subtitle,
  icon,
  chipLabels,
  onClick = () => {},
}) {
  return (
    <Card
    elevation={0}
    onClick={onClick}
      sx={{
        cursor: "pointer",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent sx={{ p: 4, textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          {icon}
          <Typography variant="h4">{title}</Typography>
        </Box>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {subtitle}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {chipLabels?.map((label) => (
            <Chip key={label} label={label} size="small" />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
