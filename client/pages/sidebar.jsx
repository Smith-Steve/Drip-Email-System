
import React from 'react';
const acceptableElements = ['H4', 'A'];

export default function SideBar({ sideBarState, removeSideBar }) {
  const handleClick = event => {
    const targetElement = event.target.tagName;
    if (acceptableElements.includes(targetElement) && event.target.closest('.sidenav')) {
      removeSideBar();
    }
  };

  return (
      <div className={`side-bar lg rounded-corners ${sideBarState}`}>
        <React.Fragment>
          <div className={`col text-container-side-bar ${sideBarState}`}>
            <div className={`sidenav ${sideBarState}`} onClick={handleClick}>
              <a href=""><h1>Home</h1></a>
              <a href="#Contacts" ><h4>Contacts</h4></a>
              <a href="#Flights"><h4>Flights</h4></a>
              <a href="#Scripts" ><h4>Scripts</h4></a>
            </div>
          </div>
        </React.Fragment>
      </div>);
}
