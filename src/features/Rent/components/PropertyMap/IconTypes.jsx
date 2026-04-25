import React from "react";

// DefaultIcons ...
const DefaultIcons = {
  school: "/icons/school.svg",
  hospital: "/icons/hospital.svg",
  police: "/icons/police.svg",
};

const IconTypes = ({ type = "unknown" }) => {
  const src = DefaultIcons[type];
  if (!src) return null;

  return <img src={src} width={24} height={24} alt={type} />;
};

export default IconTypes;
