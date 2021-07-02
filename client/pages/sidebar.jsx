
import React from 'react';

const Sidebar = ({ sideBarState, removeSideBar }) => {

  const handleClick = event => {
    const targetElement = event.target.tagName;
    if (targetElement === 'H4' || targetElement === 'A') {
      if (event.target.closest('.sidenav')) removeSideBar();
    }
  };

  return (
      <div className={`side-bar lg ${sideBarState}`}>
        <React.Fragment>
          <div className={`col textContainer-side-bar ${sideBarState}`}>
            <div className={`sidenav ${sideBarState}`} onClick={handleClick}>
              <a href=""><h1>Home</h1></a>
              <a href="#Contacts" ><h4>Contacts</h4></a>
              <a href="#Flights"><h4>Flights</h4></a>
              <a href="#Scripts" ><h4>Scripts</h4></a>
            </div>
          </div>
        </React.Fragment>
      </div>);
};

// Company. MyAccount

export default Sidebar;
