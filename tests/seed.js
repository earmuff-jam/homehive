// eslint-disable-next-line
const isPlaywrightEnvEnabled = process.env.VITE_ENABLE_PLAYWRIGHT_ENV === "true";

// initializeTestUser ...
// defines a function that creates new test users
const initializeTestUser = (role) => {
  const userWithRole = {
    uid: "test-uid",
    role: role,
    email: "testUser@test.com",
  };

  return { data: userWithRole };
};

// seedEmulatedUser ...
// defines a function that allows the app to seed emulated user
export const seedEmulatedUser = async (page, role) => {
  const emulatedUser = initializeTestUser(role);

  await page.addInitScript((data) => {
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(data));
  }, emulatedUser);
};
