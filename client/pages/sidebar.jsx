import React from 'react';

const Sidebar = () => {
  return (
    <div className="side-bar lg">
      <React.Fragment>
        <div className="col textContainer-side-bar">
          <div className="sidenav">
            <a href=""><h1>Home</h1></a>
            <a href="#Contacts" ><h4>Contacts</h4></a>
            <h4>Company</h4>
            <a href="#Flights"><h4>Flights</h4></a>
            <a href="#Scripts" ><h4>Scripts</h4></a>
          </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default Sidebar;
