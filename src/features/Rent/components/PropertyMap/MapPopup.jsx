import React from "react";

import {
  DirectionsBikeRounded,
  DirectionsWalkRounded,
  DriveEtaRounded,
} from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import IconTypes from "features/Rent/components/PropertyMap/IconTypes";
import {
  calculateDistance,
  estimateTravelTime,
  formatDistance,
} from "features/Rent/utils";

const MapPopupDetails = ({
  selectedAmenity,
  propertyName,
  propertyLocation = { lat: 0, lon: 0 },
}) => {
  // prevent un-necessary renders
  if (!selectedAmenity) return null;

  // calculate distance
  const distance = calculateDistance(
    propertyLocation?.lat,
    propertyLocation?.lon,
    selectedAmenity?.lat,
    selectedAmenity?.lon,
  );
  const formattedAmenityType = `${selectedAmenity?.type[0].toUpperCase()}${selectedAmenity?.type.slice(1)}`;
  return (
    <Stack padding={1}>
      <Stack direction="row" spacing={1} marginY={1}>
        <IconTypes type={selectedAmenity?.type} />
        <Typography variant="subtitle2" fontSize="0.675rem" fontWeight="bold">
          {selectedAmenity?.name}
        </Typography>
      </Stack>
      <Typography variant="caption" fontSize="0.675rem" gutterBottom>
        {formattedAmenityType} within {formatDistance(distance)} near&nbsp;
        {propertyName}
      </Typography>

      <Stack direction="row" spacing={1} alignItems="flex-end">
        <DirectionsWalkRounded fontSize="small" color="info" />
        <Typography variant="caption" fontSize="0.575rem">
          {estimateTravelTime(distance, "walking").formatted} walk
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="flex-end">
        <DirectionsBikeRounded fontSize="small" color="success" />
        <Typography variant="caption" fontSize="0.575rem">
          {estimateTravelTime(distance, "biking").formatted} bike
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="flex-end">
        <DriveEtaRounded fontSize="small" color="error" />
        <Typography variant="caption" fontSize="0.575rem">
          {estimateTravelTime(distance, "cityDriving").formatted} by car
        </Typography>
      </Stack>
    </Stack>
  );
};

export default MapPopupDetails;
