import React from "react";

import dayjs from "dayjs";

import "@testing-library/jest-dom/vitest";
import relativeTime from "dayjs/plugin/relativeTime";
import { TextDecoder, TextEncoder } from "util";
import { vi } from "vitest";

dayjs.extend(relativeTime);

function createStorageMock() {
  let store = {};
  return {
    getItem: vi.fn((key) =>
      Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null,
    ),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
}

// mock secure storage
vi.mock("react-secure-storage", () => ({
  default: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
}));

// mock feature flags
vi.mock("common/ApplicationConfig", () => ({
  __esModule: true,
  authorizedServerLevelFeatureFlags: () =>
    new Map([
      ["analytics", true],
      ["invoicer", true],
      ["esign", true],
      ["sendEmail", true],
    ]),
}));

// mock application hooks
vi.mock("hooks/useAppTitle", () => ({
  useAppTitle: vi.fn(),
}));

// mock common components
vi.mock("common/AButton", () => ({
  __esModule: true,
  default: ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));

vi.mock("common/AIconButton", () => ({
  __esModule: true,
  default: (props) => (
    <button data-testid="mock-aiconbutton" {...props}>
      {props.label}
    </button>
  ),
}));

vi.mock("common/CustomSnackbar", () => ({
  __esModule: true,
  default: ({
    showSnackbar,
    title,
    caption,
    message,
    setShowSnackbar,
    onClick,
  }) =>
    showSnackbar ? (
      <div data-testid="snackbar">
        {title && <div>{title}</div>}

        {message && <div>{message}</div>}

        {caption && <button onClick={onClick}>{caption}</button>}

        {setShowSnackbar && (
          <button aria-label="Close" onClick={() => setShowSnackbar(false)}>
            Close
          </button>
        )}
      </div>
    ) : null,
}));

Object.defineProperty(globalThis, "localStorage", {
  value: createStorageMock(),
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis, "sessionStorage", {
  value: createStorageMock(),
  writable: true,
  configurable: true,
});

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;
