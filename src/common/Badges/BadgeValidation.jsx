const FirstPropertyValue = "first_property";
const FivePropertiesValue = "five_properties";
const TenPropertiesValue = "ten_properties";
const TwentyFivePropertiesValue = "twenty_five_properties";
const FiftyPropertiesValue = "fifty_properties";

// PropertiesBadges ...
// defines a list of badges that can be allocated in relationship to properties. 
// Should tally against the number of properties under the logged in user
export const PropertiesBadges = {
  1: FirstPropertyValue,
  5: FivePropertiesValue,
  10: TenPropertiesValue,
  25: TwentyFivePropertiesValue,
  50: FiftyPropertiesValue,
};

export const FirstIncomeReportKey = "first_income_report_key";
const FirstIncomeReportValue = "first_income_report";

// Report Badges ...
// defines a list of badges that can be allocated in relationship to a selected 
// report. Should tally against the reports generated from each property.
export const ReportBadges = {
  [FirstIncomeReportKey]: FirstIncomeReportValue,
};
