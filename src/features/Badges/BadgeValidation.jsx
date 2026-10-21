import { useGetBadgeValidationByBadgeKeysQuery } from "features/Api/firebaseUserApi";

// BadgeValidation ...
// used to validate if a user has a selected badge
const BadgeValidation = (user, badgeKeys = []) => {
  const { data: allBadgesExists = false } =
    useGetBadgeValidationByBadgeKeysQuery(
      { user: user, keys: badgeKeys },
      {
        skip: badgeKeys?.length <= 0 || !user,
      },
    );

  return allBadgesExists;
};

export default BadgeValidation;
