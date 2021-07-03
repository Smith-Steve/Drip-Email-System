import React from 'react';
import WelcomeMessage from './welcomeMessage';

const HomeComponent = () => {
  return (
    <React.Fragment>
      <div className="homeComponentContainer">
        <div className="row">
          <div className="col">
            <div className="homeComponentContainer-textBox">
              <span className="specialText-home"><h1>Unleash Your Message</h1></span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HomeComponent;
