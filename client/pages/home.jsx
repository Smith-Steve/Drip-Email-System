import React from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import CreateContact from './createContact';
import Scripts from './scripts';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.getRoute = this.getRoute.bind(this);
    this.state = { route: '' };
  }

  getRoute() {
    this.setState({ route: window.location.hash });
  }

  render() {

    return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <Topbar/>
        </div>
        <div className="row">
          <div className="column side-bar">
            <Sidebar returnRoute={this.getRoute}/>
          </div>
          <div className="column component">
            <Scripts data-view="scripts"/>
          </div>
        </div>
      </div>
    </React.Fragment>
    );
  }
}
export default Home;
