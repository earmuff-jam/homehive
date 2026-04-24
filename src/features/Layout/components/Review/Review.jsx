import React from "react";

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

const reviews = [
  {
    id: 1,
    title:
      "Been using it for a couple of months, and hands down I simply love how its super customizable.",
    rating: 4,
    avatar: "JL",
    bgColor: "primary.main",
    fullName: "Jamie L.",
  },
  {
    id: 2,
    title:
      "Love the look and feel of the app. The automatic system managing email notifications is top tier.",
    rating: 5,
    avatar: "MR",
    bgColor: "warning.main",
    fullName: "Marcus R.",
  },
  {
    id: 3,
    title:
      "Now I don't have to waste time creating new invoices everytime. Super helpful love it. 10 by 10 would recommend.",
    rating: 4,
    avatar: "SK",
    bgColor: "secondary.main",
    fullName: "Sara K.",
  },
];

export default function Review() {
  return (
    <Stack
      direction={{ md: "row", xs: "column" }}
      spacing={2}
      useFlexGap
      flexGrow={1}
    >
      {reviews.map((v) => (
        <Card key={v.id} sx={{ borderRadius: "1rem", padding: "1rem" }}>
          <Avatar sx={{ bgcolor: v.bgColor, width: 44, height: 44 }}>
            {v.avatar}
          </Avatar>
          <CardContent>
            <Typography variant="body2" gutterBottom>
              &quot;{v.title}&quot;
            </Typography>
          </CardContent>
          <CardActions>
            <Stack spacing={1}>
              <Typography variant="caption" fontWeight="bold">
                {v.fullName}
              </Typography>
              <Rating value={v.rating} size="small" readOnly />
            </Stack>
          </CardActions>
        </Card>
      ))}
    </Stack>
  );
}
