import { keyframes } from "@mui/material";

export const SCALE = 1.5;

export const COLOR_ENUM_VALUES = ["#dc2626", "#9333ea", "#ea580c", "#0891b2"];

// INITIAL_SIGNER_ENUM_VALUES ...
// defines a constant default signer option when a new pdf is added to esign
export const INITIAL_SIGNER_ENUM_VALUES = [
  {
    id: "creator",
    role: "Creator",
    name: "",
    email_address: "",
    color: "#2563eb",
    order: 0,
  },
];

// GLITTER_KEYFRAMES ...
// defines a function with keyframes
export const GLITTER_KEYFRAMES = keyframes`
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 0px rgba(255,255,255,0));
  }
  50% {
    transform: scale(1.25);
    filter: drop-shadow(0 0 6px rgba(255,215,0,0.8));
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0px rgba(255,255,255,0));
  }
`;
