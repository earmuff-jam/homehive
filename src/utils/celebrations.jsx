import confetti from "canvas-confetti";

// celebrations ...
//
// defines a util handler to populate confetti based on user selection
export const celebrations = {
  commonConfetti: () => {
    confetti({
      particleCount: 150,
      spread: 100,
      colors: ["#4F46E5", "#22C55E", "#FACC15"],
      origin: { y: 0.6 },
    });
  },
  leaseSigned: () => {},
};
