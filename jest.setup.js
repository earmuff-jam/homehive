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
  Line: jest.fn(() => <div data-testid="line-chart" />),
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
  default: ({
    label = "label",
    id = 1,
    value = "value",
    handleChange = jest.fn(),
    placeholder = "placeholder",
    errorMsg,
    multiline = false,
    maxRows = 0,
    onBlur = jest.fn(),
  }) => (
    <div data-testid={id}>
      <label>{label}</label>
      {maxRows === 0 ? (
        <input
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          multiple={multiline}
        />
      ) : (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          rows={maxRows}
        />
      )}
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
    children,
    ...props
  }) => (
    <div {...props} data-testid="empty-component">
      <div>{title}</div>
      <div>{caption}</div>
      {children}
    </div>
  ),
}));

// mock functions in utils ...
jest.mock("common/utils", () => ({
  __esModule: true,
  pluralize: jest.fn(),
  numberFormatter: jest.fn(),
  isBannerVisible: jest.fn(),
  parseJsonUtility: jest.fn(),
  normalizeDetailsTableData: jest.fn((data) => data),
}));

// mock material react table ...
jest.mock("material-react-table", () => ({
  MaterialReactTable: ({ table }) => (
    <div data-testid="mock-table">Mock Table ({table.data.length} rows)</div>
  ),
  useMaterialReactTable: jest.fn((config) => config),
}));

// mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: () => jest.fn(),
  useOutletContext: () => [false], // mock value for showWatermark
}));

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
