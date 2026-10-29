import React from "react";

import { Paper, Skeleton, Stack, Tooltip } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import { fetchLoggedInUser } from "common/utils";
import { useGetUserOwnedBadgesQuery } from "features/Api/firebaseUserApi";
import { BADGES_LIST } from "features/Rent/constants";

const ViewOwnedBadges = () => {
  const user = fetchLoggedInUser();
  const { data: ownedBadges = [], isLoading: isGetUserOwnedBadgesLoading } =
    useGetUserOwnedBadgesQuery(user?.uid, {
      skip: !user?.uid,
    });

  const displayBadgesWithIcon = BADGES_LIST?.filter((badge) =>
    ownedBadges?.includes(badge?.value),
  );

  if (isGetUserOwnedBadgesLoading) return <Skeleton height="5rem" />;

  return (
    <Stack spacing={1}>
      <RowHeader
        title="View Badges"
        caption="View your owned badges"
        sxProps={{
          textAlign: "left",
          color: "text.secondary",
        }}
      />
      {ownedBadges?.length <= 0 ? (
        <EmptyComponent caption="Complete quests to get badges" />
      ) : (
        <Stack direction="row" spacing={1}>
          {displayBadgesWithIcon?.map((badge) => (
            <Tooltip title={badge?.title}>
              <Paper key={badge?.title} elevation={1} sx={{ padding: 1 }}>
                {React.cloneElement(badge.icon, {
                  fontSize: "large",
                  color: "secondary",
                })}
              </Paper>
            </Tooltip>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default ViewOwnedBadges;
