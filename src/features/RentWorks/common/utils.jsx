/**
 * Utility file for properties
 */
import dayjs from "dayjs";

import { getAuth, signOut } from "firebase/auth";
import { authenticatorConfig } from "src/config";

// enum values
export const PaidRentStatusEnumValue = "paid";

/**
 * Email Validators
 */
const emailValidators = [
  {
    validate: (value) => value.trim().length <= 0,
    message: "Email address is required",
  },
  {
    validate: (value) => value.trim().length >= 150,
    message: "Email address should be less than 150 characters",
  },
  {
    validate: (value) => !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value),
    message: "Email address is not valid",
  },
];

/**
 * isValid ...
 *
 * function used to determine if an email is valid or not
 *
 * @param {string} email
 * @returns boolean - true / false
 */
export const isValid = (email) => {
  for (const validator of emailValidators) {
    if (validator.validate(email)) {
      return false;
    }
  }
  return true;
};

/**
 * fetchLoggedInUser ...
 *
 * used to retrieve the logged in userId.
 *
 * @returns string - the logged in userId
 */
export const fetchLoggedInUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

/**
 * logoutUser ...
 *
 * used to log the user out of the system. function is
 * asyncronous in nature to ensure that the logout is
 * succesful
 *
 * @returns string - the logged in userId
 */
export const logoutUser = async () => {
  const auth = getAuth(authenticatorConfig);
  try {
    await signOut(auth);
    localStorage.removeItem("user");
  } catch (error) {
    /* eslint-disable no-console */
    console.error("Error signing out:", error);
  }
};

/**
 * updateDateTime function
 *
 * util function used to updateDateTime. used to update the
 * next projected rent due date
 *
 * @param {string} startDate - the start date of the event
 * @returns updatedDateTime with a month added.
 */
export const updateDateTime = (startDate) => {
  const today = dayjs();
  const monthsSinceStart = today.diff(startDate, "month");
  const nextDueDate = startDate.add(monthsSinceStart + 1, "month");
  return dayjs(nextDueDate).toISOString();
};

/**
 * formatCurrency ...
 *
 * used to format the current passed in amount.
 *
 * @param {Number} amount - the amount that needs to be formatted, default 0
 *
 * @returns {Number} formatted result
 */
export const formatCurrency = (amt = 0) => {
  return `$${parseInt(amt).toLocaleString()}`;
};

/**
 * derieveTotalRent
 *
 * function used to retrieve the total rent of any given property. For homes
 * with a SoR, rent are calculated per room. The property unit as a whole can have
 * additional charges.
 *
 * @param {Object} property - the property object
 * @param {Array} tenants - the array of tenants that are residing in the property
 * @param {Boolean} isAnyTenantSoR - true / false - determine if the property is single occupancy or not
 *
 * @returns {Number} - amount of rent in US Dollars
 */
export const derieveTotalRent = (property, tenants, isAnyTenantSoR) => {
  const totalRent = Number(property?.rent) + Number(property?.additional_rent); // can have additional charges

  if (isAnyTenantSoR) {
    return tenants.reduce(
      (total, tenant) =>
        total +
        parseInt(tenant.rent || 0) +
        parseInt(property?.additional_rent),
      0,
    );
  } else {
    return totalRent || 0;
  }
};

/**
 * getOccupancyRate ...
 *
 * function used to determine the occupancy rate of the selected
 * property.
 *
 * @param {Object} property - the property object
 * @param {Array} tenants - the array of tenants that are residing in the property
 * @param {Boolean} isAnyTenantSoR - true / false - determine if the property is single occupancy or not
 *
 * @returns {Number} - the percent of the occupancy of the selected property
 */
export const getOccupancyRate = (property, tenants, isAnyTenantSoR) => {
  if (isAnyTenantSoR) {
    const totalUnits = parseInt(property?.units || 0);
    const occupiedUnits = tenants.length;
    return totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  } else {
    // if !SoR, all tenants count as 1 household member. hence 100% occupancy rate
    return tenants?.length > 0 ? 100 : 0;
  }
};

/**
 * getNextMonthlyDueDate ...
 *
 *
 * function used to return next due date (monthly) based on the original lease start date.
 *
 * @param {string | Date} startDate - The tenant's lease start date.
 * @returns {string} - The next due date in YYYY-MM-DD format.
 */
export function getNextMonthlyDueDate(startDate) {
  if (!startDate) return "";

  const original = dayjs(startDate);
  const today = dayjs();
  const targetDay = original.date();

  const nextDue =
    today.date() <= targetDay
      ? today.set("date", targetDay)
      : today.add(1, "month").set("date", targetDay);

  return nextDue.format("YYYY-MM-DD");
}

/**
 * Checks if rent is currently due.
 *
 * @param {string} startDate - The lease start date in MM-DD-YYYY format.
 * @param {number} gracePeriodDays - Number of grace days before rent is due each month.
 * @param {Array} currentMonthRent - Rent details if exists, for the current month.
 *
 * @returns {boolean} - True if rent is currently due.
 */

export const isRentDue = (startDate, gracePeriod = 3, currentMonthRent) => {
  const today = dayjs();
  const leaseStart = dayjs(startDate, "MM-DD-YYYY");

  if (today.isBefore(leaseStart, "day")) return false;

  const graceDate = today.startOf("month").add(gracePeriod, "day");
  const pastGracePeriod = today.isAfter(graceDate, "day");

  const currentMonth = today.format("MMMM");
  const rentPaid =
    currentMonthRent?.rentMonth === currentMonth &&
    currentMonthRent.status?.toLowerCase() === "paid";
  return pastGracePeriod && !rentPaid;
};

/**
 * getRentStatus ...
 *
 * function used to get the rent status
 * @param {Object} { isPaid, isLate } - object containing these values
 * @returns Object containing the color and label. Eg, { color: "warning", label: "Unpaid" }
 */
export function getRentStatus({ isPaid, isLate }) {
  if (isPaid) return { color: "success", label: "Paid" };
  if (isLate) return { color: "error", label: "Overdue" };
  return { color: "warning", label: "Unpaid" };
}

/**
 * getCurrentMonthPaidRent ...
 *
 * fn used to get the current month rent.
 *
 * @param {Array} allRents - list of all the rents for the given property
 * @returns {Object} - current month rent
 */
export function getCurrentMonthPaidRent(allRents = []) {
  const currentMonth = dayjs().format("MMMM"); // e.g. "July"

  return allRents.find(
    (rent) =>
      rent.rentMonth === currentMonth && rent.status?.toLowerCase() === "paid",
  );
}
