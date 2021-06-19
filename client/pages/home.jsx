import React from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import parseRoute from './lib/parse-route';
import CreateContact from './components/contacts/createContact';
import Scripts from './components/scriptsFolder/scripts';
import Flights from './components/flight/flights';
import ViewScript from './components/scriptsFolder/viewScript';
import CreateEmail from './components/createEmail';
import ManageFlight from './components/manageFlight/manageFlight';
import HomeComponent from './homeComponent';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.setActiveScript = this.setActiveScript.bind(this);
    this.setFlight = this.setFlight.bind(this);
    this.state = { route: '', activeScript: null, activeFlight: null };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      const activeRoute = parseRoute(window.location.hash);
      this.setState({ route: activeRoute });
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
    console.log(activeRoute); // eslint-disable-line no-console
    if (activeRoute === 'Contacts') {
      return <CreateContact/>;
    } else if (activeRoute === 'Scripts') {
      return <Scripts setActiveScript={this.setActiveScript}/>;
    } else if (activeRoute === 'Script') {
      return this.state.activeScript === null ? null : <ViewScript script={this.state.activeScript}/>;
    } else if (activeRoute === 'Flights') {
      return <Flights getFlight={this.setFlight}/>;
    } else if (activeRoute === 'Email') {
      return <CreateEmail script={this.state.activeScript}/>;
    } else if (activeRoute.slice(0, 12) === 'ManageFlight') {
      return <ManageFlight flight={this.state.activeFlight}/>;
    }
    return <HomeComponent/>;
  }

  render() {
    return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <Topbar/>
        </div>
        <div className="row">
          <div className="column side-bar lg">
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
