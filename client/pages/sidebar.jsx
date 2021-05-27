import React from 'react';

const Sidebar = ({ returnRoute }) => {
  const goToSelectedComponent = () => {
    returnRoute();
  };
  return (
    <div className="side-bar lg">
      <React.Fragment>
        <div className="col textContainer-side-bar">
          <div className="sidenav">
            <h1>Manage</h1>
            <a href="#Contacts" onClick={goToSelectedComponent}><h4>Contacts</h4></a>
            <a href="#Company" onClick={goToSelectedComponent}><h4>Company</h4></a>
            <a href="#Flights" onClick={goToSelectedComponent}><h4>Flights</h4></a>
            <a href="#Scripts" onClick={goToSelectedComponent}><h4>Scripts</h4></a>
          </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default Sidebar;
