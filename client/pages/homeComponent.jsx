import React from 'react';

const HomeComponent = () => {
  return (
    <React.Fragment>
      <div className="homeComponentContainer">
        <div className="row">
          <div className="col">
            <div className="homeComponentContainer-textBox">
              <div className="homeHeader">
                <i className="fa fa-envelope fa-4x"></i><h1>Unleash Your Message</h1>
              </div>
              <h2>Where Mass Emails look, feel and &lsquo;taste&rsquo; like personalized email messages.</h2>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HomeComponent;
