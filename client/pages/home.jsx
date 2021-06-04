import React from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import CreateContact from './components/createContact';
import Scripts from './components/scripts';
import Flights from './components/flights';
import ViewScript from './components/viewScript';
import CreateEmail from './components/createEmail';
import ManageFlight from './components/manageFlight';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.setActiveScript = this.setActiveScript.bind(this);
    this.setFlight = this.setFlight.bind(this);
    this.state = { route: '', activeScript: null, activeFlight: null };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: window.location.hash.replace('#', '') });
    });
  }

  setActiveScript(selectedScript) {
    this.setState({ activeScript: selectedScript });
  }

  setFlight(selectedFlight) {
    this.setState({ activeFlight: selectedFlight });
  }

  renderComponent() {
    const activeRoute = this.state.route;
    if (activeRoute === 'Contacts') {
      return <CreateContact/>;
    } else if (activeRoute === 'Scripts') {
      return <Scripts setActiveScript={this.setActiveScript}/>;
    } else if (activeRoute.slice(0, 6) === 'Script') {
      return this.state.activeScript === null ? null : <ViewScript script={this.state.activeScript}/>;
    } else if (activeRoute === 'Flights') {
      return <Flights getFlight={this.setFlight}/>;
    } else if (activeRoute === 'Email') {
      return <CreateEmail script={this.state.activeScript}/>;
    } else if (activeRoute.slice(0, 12) === 'ManageFlight') {
      return <ManageFlight flight={this.state.activeFlight}/>;
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
