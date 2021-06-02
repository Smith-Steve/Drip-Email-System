import React from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import CreateContact from './components/createContact';
import Scripts from './components/scripts';
import Flights from './components/flights';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { route: '' };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: window.location.hash.replace('#', '') });
    });
  }

  renderComponent() {
    const activeRoute = this.state.route;
    if (activeRoute === 'Contacts') {
      return <CreateContact/>;
    } else if (activeRoute === 'Scripts') {
      return <Scripts/>;
    } else if (activeRoute === 'Flights') {
      return <Flights/>;
    }
    return null;
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
            <Sidebar/>
          </div>
          <div className="column component-container">
            {this.renderComponent()}
          </div>
        </div>
      </div>
    </React.Fragment>
    );
  }
}
export default Home;
