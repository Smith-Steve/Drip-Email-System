import React from 'react';

const Sidebar = () => {
  return (
    <div className="side-bar lg">
      <React.Fragment>
        <div className="col textContainer-side-bar">
          <h1>Manage</h1>
          <h4>Contacts</h4>
          <h4>Company</h4>
          <h4>Flights</h4>
          <h4>Scripts</h4>
        </div>
      </React.Fragment>
    </div>
  );
};

export default Sidebar;
