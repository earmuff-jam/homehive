import React from "react";

import {
  Card,
  CardContent,
  CardMedia,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

const reviews = [
  {
    id: 1,
    title:
      "Been using it for a couple of months, and hands down I simply love how its super customizable",
    rating: 4,
    src: "user1.jpg",
    alt: "Image of the person",
  },
  {
    id: 2,
    title:
      "Love the look and feel of the app. Having the previous information of clients is super helpful and time saving",
    rating: 5,
    src: "user2.jpg",
    alt: "Image of the person",
  },
  {
    id: 3,
    title:
      "Now I don't have to waste time creating new invoices everytime. Super helpful love it. 10 by 10 would recommend.",
    rating: 4,
    src: "user3.jpg",
    alt: "Image of the person",
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
        <Card key={v.id} sx={{ borderRadius: "1rem" }}>
          <CardMedia
            component="img"
            sx={{ height: "10rem", display: "flex" }}
            image={"./placeholder.jpg"}
            alt={v.alt}
          />
          <CardContent>
            <Typography variant="body2">{v.title}</Typography>
            <Rating value={v.rating} readOnly />
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
