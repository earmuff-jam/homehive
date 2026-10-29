import React from "react";

import { Skeleton, Stack } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import { fetchLoggedInUser } from "common/utils";
import { useGetUserOwnedBadgesQuery } from "features/Api/firebaseUserApi";

const ViewOwnedBadges = () => {
  const user = fetchLoggedInUser();
  const { data: ownedBadges = [], isLoading: isGetUserOwnedBadgesLoading } =
    useGetUserOwnedBadgesQuery(user?.uid, {
      skip: !user?.uid,
    });

  if (isGetUserOwnedBadgesLoading) return <Skeleton height="5rem" />;

  return (
    <Stack>
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
        JSON.stringify(ownedBadges)
      )}
    </Stack>
  );
};

export default ViewOwnedBadges;
