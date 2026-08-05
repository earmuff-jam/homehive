// calculatePropertyHealth ...
// defines a function that is used to calculate the health of your property
export const useCalculatePropertyHealth = (properties = []) => {
  const totalProperties = properties?.length;
  const vacantProperties = properties?.filter(
    (property) => property.rentee?.length === 0,
  )?.length;

  return {
    totalProperties: totalProperties,
    vacantProperties: vacantProperties,
  };
};
