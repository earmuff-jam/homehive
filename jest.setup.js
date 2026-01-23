/**
 *
 * Jest setup test file.
 *
 * All commonly used modules that need to be mocked can be placed here instead of
 * placing them in specific test scenarios.
 */
// import app level jest settings here
import dayjs from "dayjs";

import "@testing-library/jest-dom";
import relativeTime from "dayjs/plugin/relativeTime";
import { TextDecoder, TextEncoder } from "util";

dayjs.extend(relativeTime);

// mock react secure storage
jest.mock("react-secure-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}));

// mock validateClientPermissions
jest.mock("common/ValidateClientPermissions", () => ({
  __esModule: true,
  default: () =>
    new Map([
      ["analytics", true],
      ["invoicer", true],
      ["invoicerPro", false],
      ["userInformation", true],
      ["sendEmail", true],
    ]),
}));

global.import = {
  meta: {
    env: {
      VITE_ENABLE_ANALYTICS: "false",
    },
  },
};

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
