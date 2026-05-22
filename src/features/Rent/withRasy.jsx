import React, { useState } from "react";

import RaspyDialog from "features/Raspy/RaspyDialog";

// withRaspy ...
// raspy provider component
const withRaspy = (WrappedComponent) => {
  const WithRaspy = (props) => {
    const [raspyOpen, setRaspyOpen] = useState(false);

    return (
      <>
        <WrappedComponent
          {...props}
          raspyOpen={raspyOpen}
          setRaspyOpen={setRaspyOpen}
        />

        <RaspyDialog
          raspyOpen={raspyOpen}
          setRaspyOpen={setRaspyOpen}
        />
      </>
    );
  };

  // support for eslint
  WithRaspy.displayName = `withRaspy(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithRaspy;
};

export default withRaspy;