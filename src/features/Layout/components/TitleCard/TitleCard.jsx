import React, { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AccessBadge from "features/Layout/components/TitleCard/AccessBadge";

const DefaultChipStyles = (theme) => [
  {
    backgroundColor: theme.palette.primary.main + "15", // ~10% opacity
    color: theme.palette.primary.dark,
    border: `1px solid ${theme.palette.primary.main}25`,
  },
  {
    backgroundColor: theme.palette.warning.main + "15",
    color: theme.palette.warning.dark,
    border: `1px solid ${theme.palette.warning.main}30`,
  },
  {
    backgroundColor: theme.palette.secondary.main + "15",
    color: theme.palette.secondary.dark,
    border: `1px solid ${theme.palette.secondary.main}25`,
  },
  {
    backgroundColor: theme.palette.info.main + "15",
    color: theme.palette.info.dark,
    border: `1px solid ${theme.palette.info.main}25`,
  },
];

export default function TitleCard({
  title,
  subtitle,
  icon,
  chipLabels,
  showLoginRequired = false,
  sx = {},
  onClick = () => {},
}) {
  const theme = useTheme();
  const chipStyles = DefaultChipStyles(theme);
  const smScreenSizeAndHigher = useMediaQuery(theme.breakpoints.up("md"));

  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card
      elevation={0}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={{
        ...sx,
        position: "relative",
        width: smScreenSizeAndHigher ? "30rem" : "inherit",
        cursor: "pointer",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent sx={{ p: 4, textAlign: "center" }}>
        {showLoginRequired && isHovering && <AccessBadge />}
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
        <Typography variant="body2" color="textSecondary" gutterBottom>
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
          {chipLabels?.map((label, index) => (
            <Chip
              key={label}
              label={
                <Typography variant="caption" fontSize="0.725rem">
                  {label}
                </Typography>
              }
              sx={{
                padding: "0.2rem 0.8rem",
                fontSize: "0.75rem",
                borderRadius: "0.3rem",
                ...chipStyles[index % chipStyles.length],
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
