import React from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import CreateContact from './createContact';

class Home extends React.Component {

  render() {

    return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <Topbar/>
        </div>
        <div className="row">
          <div className="column side-bar">
            <Sidebar/>
          </div>
          <div className="column component">
            <CreateContact/>
          </div>
        </div>
      </div>
    </React.Fragment>
    );
  }
}
export default Home;
