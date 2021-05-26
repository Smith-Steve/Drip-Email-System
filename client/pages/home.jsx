import React from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import CreateContact from './createContact';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 300, height: '100vh' };
  }

  render() {

    return (
    <React.Fragment>
      <div className="container">
        <div className="universal">
        <Topbar/>
        <Sidebar/>
        </div>
        <div className="component window">
          <CreateContact/>
        </div>
      </div>
    </React.Fragment>
    );
  }
}
export default Home;
