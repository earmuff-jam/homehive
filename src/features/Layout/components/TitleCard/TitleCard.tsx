import { ReactNode } from "react";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

// DefaultChipColors ...
const DefaultChipColors = [
  "primary.light",
  "info.light",
  "warning.light",
  "secondary.light",
] as const;

// TTitleCardProps ...
type TitleCardProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  chipLabels?: string[];
  onClick?: () => void;
};

export default function TitleCard({
  title,
  subtitle,
  icon,
  chipLabels,
  onClick = () => {},
}: TitleCardProps) {
  const theme = useTheme();
  const smScreenSizeAndHigher = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        width: smScreenSizeAndHigher ? "30rem" : "inherit",
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
            gap: 1,
          }}
        >
          {icon}
          <Typography variant="h4">{title}</Typography>
        </Box>

        {subtitle && (
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {subtitle}
          </Typography>
        )}

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
              size="small"
              sx={{
                color: "black",
                backgroundColor:
                  DefaultChipColors[index % DefaultChipColors.length],
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
