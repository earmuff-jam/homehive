// import app level jest settings here
import dayjs from "dayjs";

import "@testing-library/jest-dom";
import relativeTime from "dayjs/plugin/relativeTime";
import { TextDecoder, TextEncoder } from "util";

dayjs.extend(relativeTime);

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
