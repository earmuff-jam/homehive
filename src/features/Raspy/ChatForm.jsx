export default function ChatForm() {}
//   const user = fetchLoggedInUser();

//   const {
//     data: properties = [],
//     isLoading: isPropertiesListLoading,
//     isSuccess: isPropertiesListSuccess,
//   } = useGetPropertiesByUserIdQuery(user.uid, {
//     skip: !user?.uid,
//   });

//   const [getExistingTenants, getExistingTenantsResult] =
//     useLazyGetTenantsByPropertiesArrQuery();

//   const [getExistingRents, getExistingRentsResult] =
//     useLazyGetRentsByPropertiesQuery();

//   const [handleRaspyMessage, handleRaspyMessageResult] = useGetAnswerMutation();
//   const [decodeUserIntent, decodeUserIntentResult] = useDecodeIntentMutation();

//   const [showSnackbar, setShowSnackbar] = useState(false);

//   const commonChipLabels = [
//     "Property Stats",
//     "Rental Stats",
//     "Recommended Actions",
//   ];

//   const [formattedRaspyResponseDetails, setFormattedRaspyResponseDetails] =
//     useState(null);

//   const handleChipSelection = (value) => {
//     const requestObj = {
//       email: user?.email,
//       properties: properties || [],
//       rents: getExistingRentsResult?.data || [],
//       tenants: getExistingTenantsResult?.data || [],
//       message: value,
//       updatedOn: dayjs().toISOString(),
//     };

//     decodeUserIntent(requestObj);
//   };

//   // const { transcript, listening, browserSupportsSpeechRecognition } =
//   //   useSpeechRecognition();

//   // const {
//   //   register,
//   //   handleSubmit,
//   //   setValue,
//   //   formState: { errors },
//   // } = useForm({
//   //   mode: "onChange",
//   //   defaultValues: {
//   //     message: "",
//   //   },
//   // });

//   // const handleAudioRecording = (transcript) => {
//   //   setValue("message", transcript, {
//   //     shouldValidate: true,
//   //     shouldDirty: true,
//   //   });
//   // };

//   // const submit = (formData) => {
//   //   formData["email"] = user?.email;
//   //   formData["properties"] = properties || [];
//   //   formData["rents"] = getExistingRentsResult?.data || [];
//   //   formData["tenants"] = getExistingTenantsResult?.data || [];
//   //   formData["message"] = formData?.message.trim();
//   //   formData["updatedOn"] = dayjs().toISOString();

//   //   decodeUserIntent(formData);
//   // };

//   // const loading =
//   //   handleRaspyMessageResult.isLoading || decodeUserIntentResult.isLoading;

//   // useEffect(() => {
//   //   if (transcript?.length > 0) {
//   //     handleAudioRecording(transcript);
//   //   }
//   // }, [listening]);

//   useEffect(() => {
//     if (!isPropertiesListLoading && isPropertiesListSuccess) {
//       const propertiesIds = properties?.map((property) => property.id);
//       getExistingTenants({ propertyIds: propertiesIds, isActive: true });
//       getExistingRents({ propertyIds: propertiesIds, isActive: true });
//     }
//   }, [isPropertiesListLoading]);

//   useEffect(() => {
//     if (decodeUserIntentResult.isSuccess) {
//       const responseData = decodeUserIntentResult.data;
//       const originalArgs = decodeUserIntentResult.originalArgs;

//       handleRaspyMessage({
//         ...originalArgs,
//         intent: responseData?.intent || "Other",
//       });
//     }
//   }, [decodeUserIntentResult.isLoading]);

//   if (
//     isPropertiesListLoading ||
//     getExistingTenantsResult.isLoading ||
//     getExistingRentsResult.isLoading
//   ) {
//     return <Skeleton height="10rem" />;
//   }

//   return (
//     <Stack spacing={1}>
//       <Stack spacing={1}>
//         {commonChipLabels.map((item) => {
//           return (
//             <Box>
//               <Chip
//                 key={item}
//                 label={item}
//                 clickable
//                 size="small"
//                 variant="outlined"
//                 onClick={(el) => handleChipSelection(item)}
//                 sx={{
//                   fontWeight: 600,
//                   borderStyle: "solid",
//                   borderWidth: 2,
//                   transition: "all 0.15s ease",
//                 }}
//               />
//             </Box>
//           );
//         })}
//       </Stack>

//       {handleRaspyMessageResult?.isSuccess ? (
//         <Paper variant="outlined" sx={{ padding: 2 }}>
//           <ResponseDetails data={formattedRaspyResponseDetails} />
//         </Paper>
//       ) : null}
//       <CustomSnackbar
//         showSnackbar={showSnackbar}
//         setShowSnackbar={setShowSnackbar}
//         title="Changes saved."
//       />
//     </Stack>
//   );
// }

// // calculatePropertyHealth ...
// // defines a function that is used to calculate the health of your property
// const calculatePropertyHealth = (properties = []) => {
//   const totalProperties = properties?.length;
//   const vacantProperties = properties?.filter(
//     (property) => property.rentee?.length === 0,
//   )?.length;

//   return {
//     totalProperties: totalProperties,
//     vacantProperties: vacantProperties,
//   };
// };

// // calculateFinancialHealth ...
// // defines a function that is used to calculate the financial health of your property.
// const calculateFinancialHealth = (properties) => {
//   const totalMonthlyRentalIncome = properties?.reduce((acc, el) => {
//     acc += Number(el?.rent || 0);
//     acc += Number(el?.additionalRent || 0);
//     return acc;
//   }, 0);

//   const securityDepositsCollected = properties?.reduce((acc, el) => {
//     acc += Number(el?.securityDeposit || 0);
//     return acc;
//   }, 0);

//   const totalSqFt = properties?.reduce((acc, el) => {
//     acc += Number(el?.sqFt || 0);
//     return acc;
//   }, 0);

//   const averageRentPerSqFt =
//     totalSqFt > 0 ? totalMonthlyRentalIncome / totalSqFt : 0;

//   return {
//     totalMonthlyRentalIncome,
//     averageRentPerSqFt,
//     securityDepositsCollected,
//   };
// };

// // calculateProjectedRentalChange ...
// // defines a function that calculates projected rental change
// const calculateProjectedRentalChange = (
//   rents = [],
//   projectRentIncrease = 0,
//   yearsAhead = 3,
// ) => {
//   const sortedRentalPayments = rents
//     ?.filter((rent) =>
//       [
//         ManualRentStatusEnumValue,
//         CompleteRentStatusEnumValue,
//         PaidRentStatusEnumValue,
//       ].includes(rent.status),
//     )
//     .sort((a, b) => dayjs(a?.createdOn) - dayjs(b.createdOn));

//   if (sortedRentalPayments?.length <= 0) {
//     return { labels: [], historical: [], forecast: [] };
//   }

//   const yearlyMap = new Map();
//   sortedRentalPayments.forEach((rent) => {
//     const year = dayjs(rent?.createdOn).year();

//     yearlyMap.set(
//       year,
//       (yearlyMap.get(year) || 0) + Number(rent.rentAmount || 0),
//     );
//   });

//   const years = Array.from(yearlyMap.keys()).sort();
//   const rentArr = years.map((y) => yearlyMap.get(y));

//   const avgRateOfRentalPropertyChange =
//     rentArr.length > 1
//       ? (rentArr[rentArr.length - 1] - rentArr[0]) / (rentArr.length - 1)
//       : 0;

//   const forecast = [];
//   let current = rentArr[rentArr.length - 1];

//   for (let i = 0; i < yearsAhead; i++) {
//     current =
//       current +
//       avgRateOfRentalPropertyChange * 0.5 + // add market smoothing
//       projectRentIncrease;

//     forecast.push(Number(current.toFixed(2)));
//   }

//   const lastYear = years[years.length - 1];

//   const forecastYears = Array.from(
//     { length: yearsAhead },
//     (_, idx) => lastYear + idx + 1,
//   );

//   return {
//     labels: [...years, ...forecastYears],
//     historical: [...rentArr, ...Array(yearsAhead).fill(null)],
//     forecast: [...Array(rentArr.length).fill(null), ...forecast],
//   };
// };

// // calculateTotalCollectedRents ...
// // defines a function that calculates the projected yearly rent
// const calculateTotalCollectedRents = (properties, rents) => {
//   if (!properties?.length || !rents?.length) {
//     return [[], [], []];
//   }

//   const validRents = rents.filter((r) =>
//     [
//       ManualRentStatusEnumValue,
//       CompleteRentStatusEnumValue,
//       PaidRentStatusEnumValue,
//     ].includes(r.status),
//   );

//   const map = {};

//   validRents.forEach((r) => {
//     const propertyId = r.propertyId;
//     const amount = Number(r.rentAmount || 0);

//     if (!propertyId) return;

//     map[propertyId] = (map[propertyId] || 0) + amount;
//   });

//   const labels = [];
//   const values = [];
//   const backgroundColors = [];

//   const palette = [
//     "rgba(153, 102, 255, 0.7)",
//     "rgba(255, 99, 132, 0.7)",
//     "rgba(54, 162, 235, 0.7)",
//     "rgba(255, 206, 86, 0.7)",
//     "rgba(75, 192, 192, 0.7)",
//     "rgba(255, 159, 64, 0.7)",
//   ];

//   properties.forEach((p, i) => {
//     const value = map[p.id] || 0;

//     labels.push(p.name);
//     values.push(value);
//     backgroundColors.push(palette[i % palette.length]);
//   });

//   return [labels, values, backgroundColors];
// };
