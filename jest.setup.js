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

// mock chart.js Bar component ...
jest.mock("react-chartjs-2", () => ({
  Bar: jest.fn(() => <div data-testid="bar-chart" />),
}));

// mock react secure storage ...
jest.mock("react-secure-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}));

// mock validateClientPermissions ...
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

// mock AIconButton ...
jest.mock("common/AIconButton", () => ({
  __esModule: true,
  default: ({ children, ...props }) => (
    <button data-testid="AIconButton" {...props}>
      {children}
    </button>
  ),
}));

// mock Abutton ...
jest.mock("common/AButton", () => ({
  __esModule: true,
  default: ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));

// mock TextFieldWithLabel ...
jest.mock("common/TextFieldWithLabel", () => ({
  __esModule: true,
  default: ({ label, id, placeholder, errorMsg }) => (
    <div data-testid={id}>
      <label>{label}</label>
      <input placeholder={placeholder} />
      {errorMsg && <span>{errorMsg}</span>}
    </div>
  ),
}));

// mock RowHeader ...
jest.mock("common/RowHeader/RowHeader", () => ({
  __esModule: true,
  default: ({ title, caption }) => (
    <div data-testid="row-header">
      <h1>{title}</h1>
      <p>{caption}</p>
    </div>
  ),
}));

// mock EmptyComponent ...
jest.mock("common/EmptyComponent", () => ({
  __esModule: true,
  default: ({
    title = "Sorry, no matching records found.",
    caption,
    ...props
  }) => (
    <div {...props}>
      <div>{title}</div>
      <div>{caption}</div>
    </div>
  ),
}));

// mock functions in utils ...
jest.mock("common/utils", () => ({
  __esModule: true,
  pluralize: jest.fn(),
  parseJsonUtility: jest.fn(),
  noramlizeDetailsTableData: jest.fn((data) => data),
}));

// mock material react table ...
jest.mock("material-react-table", () => ({
  MaterialReactTable: ({ table }) => (
    <div data-testid="mock-table">Mock Table ({table.data.length} rows)</div>
  ),
  useMaterialReactTable: jest.fn((config) => config),
}));

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
