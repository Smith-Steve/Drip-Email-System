import React from 'react';

export default function HomeComponent() {
  return (
    <React.Fragment>
      <div className="home-component-container">
        <div className="row">
          <div className="col">
            <div className="home-component-container-textbox">
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
}
