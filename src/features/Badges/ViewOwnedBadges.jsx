import React from "react";

import { EmojiEventsOutlined } from "@mui/icons-material";
import {
  Box,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import { fetchLoggedInUser, pluralize } from "common/utils";
import { useGetUserOwnedBadgesQuery } from "features/Api/firebaseUserApi";
import { BADGES_LIST } from "features/Rent/constants";

const ViewOwnedBadges = () => {
  const user = fetchLoggedInUser();
  const { data: ownedBadges = [], isLoading } = useGetUserOwnedBadgesQuery(
    user?.uid,
    {
      skip: !user?.uid,
    },
  );

  const displayBadgesWithIcon = BADGES_LIST?.filter((badge) =>
    ownedBadges?.includes(badge?.value),
  );

  if (isLoading) return <Skeleton height="8rem" />;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        textAlign="left"
        alignContent="center"
        justifyContent="space-between"
      >
        <Stack>
          <Typography variant="h5" fontWeight="medium">
            Your Achievements
          </Typography>
          <Typography variant="subtitle2">
            A collection of milestones you&apos;ve accomplished
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <EmojiEventsOutlined color="warning" />
          <Typography variant="body2" color="text.secondary">
            {`${displayBadgesWithIcon.length} ${pluralize(displayBadgesWithIcon.length, "badge")} earned`}
          </Typography>
        </Stack>
      </Stack>

      {displayBadgesWithIcon?.length === 0 ? (
        <EmptyComponent caption="Complete quests to earn your first badge!" />
      ) : (
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {displayBadgesWithIcon.map((badge, index) => (
            <Tooltip title={badge.title} key={badge.value}>
              <Paper
                elevation={0}
                sx={{
                  width: { xs: 68, sm: 105 },
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: 3,
                  textAlign: "center",
                  background: [
                    "linear-gradient(145deg, #FFF3C4, #FFD166)",
                    "linear-gradient(145deg, #D7F3FF, #74C0FC)",
                    "linear-gradient(145deg, #E5DBFF, #B197FC)",
                    "linear-gradient(145deg, #D3F9D8, #69DB7C)",
                  ][index % 4],
                  border: "1px solid rgba(255,255,255,0.7)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
                  transition: "all 0.25s ease",
                  cursor: "default",
                  "&:hover": {
                    transform: "translateY(-7px) scale(1.05)",
                    boxShadow: "0 10px 22px rgba(0,0,0,0.18)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: { xs: 48, sm: 58 },
                    height: { xs: 48, sm: 58 },
                    mx: "auto",
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  {React.cloneElement(badge.icon, {
                    sx: {
                      fontSize: { xs: 30, sm: 36 },
                      color: badge.icon.props.sx?.color || "primary.main",
                    },
                  })}
                </Box>
              </Paper>
            </Tooltip>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default ViewOwnedBadges;
