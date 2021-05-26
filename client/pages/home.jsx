import React from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 300, height: '100vh' };
  }

  render() {

    return (
    <React.Fragment>
      <div className="container">
        <Topbar/>
        <Sidebar/>
      </div>
    </React.Fragment>
    );
  }
}
export default Home;
