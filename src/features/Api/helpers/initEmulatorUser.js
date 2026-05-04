import { getEmulatorUser } from "features/Api/helpers/getEmulatorUser";
import { Role } from "features/Auth/AuthHelper";

export const initEmulatorUser = async (type, isEsign = false) => {
  console.debug("Initializing emulated user. Please wait ...", type);

  switch (type) {
    case Role.Owner: {
      const emulatedUser = await getEmulatorUser(Role.Owner, isEsign);
      return emulatedUser;
    }

    case Role.Tenant:
      break;

    case Role.User:
      break;

    default:
      break;
  }
};
