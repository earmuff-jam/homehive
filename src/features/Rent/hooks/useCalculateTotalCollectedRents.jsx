// useCalculateTotalCollectedRents ...
import {
  CompleteRentStatusEnumValue,
  ManualRentStatusEnumValue,
  PaidRentStatusEnumValue,
} from "features/Rent/utils";

// defines a function that calculates the projected yearly rent
export const useCalculateTotalCollectedRents = (
  properties = [],
  rents = [],
) => {
  if (!properties?.length || !rents?.length) {
    return [[], [], []];
  }

  const validRents = rents.filter((r) =>
    [
      ManualRentStatusEnumValue,
      CompleteRentStatusEnumValue,
      PaidRentStatusEnumValue,
    ].includes(r.status),
  );

  const map = {};

  validRents.forEach((r) => {
    const propertyId = r.propertyId;
    const amount = Number(r.rentAmount || 0);

    if (!propertyId) return;

    map[propertyId] = (map[propertyId] || 0) + amount;
  });

  const labels = [];
  const values = [];
  const backgroundColors = [];

  const palette = [
    "rgba(153, 102, 255, 0.7)",
    "rgba(255, 99, 132, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(255, 159, 64, 0.7)",
  ];

  properties.forEach((p, i) => {
    const value = map[p.id] || 0;

    labels.push(p.name);
    values.push(value);
    backgroundColors.push(palette[i % palette.length]);
  });

  return [labels, values, backgroundColors];
};
