// seedEmulatedUser ...
// defines a function that allows the app to seed emulated user
export const seedEmulatedUser = async (page, role) => {

  const emulatedUser = {
    uid: "test-uid",
    role: role,
    email: "testUser@test.com"
  };

  await page.addInitScript((data) => {
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(data));
  }, emulatedUser);
};
