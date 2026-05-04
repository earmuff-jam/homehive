// getEmulatorUser ...
import { Role } from "features/Auth/AuthHelper";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { authenticatorApp } from "src/config";

// getEmulatedUser ...
// defines a function that returns emulator user determined by the playwright tests
export const getEmulatorUser = async (userRole, isEsign = false) => {
  console.debug("Using emulator for testing user workflow. Please wait ...");

  const emulatorEmail = "testuser@test.com";
  const emulatorPwd = "password123";

  try {
    const isValidRole = Object.values(Role).includes(userRole);
    if (!isValidRole) {
      console.debug(
        "Found unrecognized role for selected test instance. Quitting.",
      );
      throw new Error("Unable to proceed with unrecognized role");
    }
  } catch (error) {
    console.debug("Unable to proceed with unrecognized role.", error);
    return error;
  }

  try {
    await createUserWithEmailAndPassword(
      authenticatorApp,
      emulatorEmail,
      emulatorPwd,
    );
  } catch (error) {
    // eat the exception; if the user exists, same error is thrown
    console.debug("Unable to create user with email and password ", error);
  }

  const authResponse = await signInWithEmailAndPassword(
    authenticatorApp,
    emulatorEmail,
    emulatorPwd,
  );

  const userData = authResponse.user;
  const userWithRole = {
    uid: userData?.uid,
    role: Role.Owner,
    email: userData?.email,
  };

  return { data: userWithRole, isEsign };
};
