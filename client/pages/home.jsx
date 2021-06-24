import React from 'react';
import Sidebar from './sidebar';
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
    this.state = { route: parseRoute(window.location.hash), activeScript: null, activeFlight: null };
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
    if (activeRoute.path === 'Contacts') {
      return <CreateContact/>;
    } else if (activeRoute.path === 'Scripts') {
      return <Scripts setActiveScript={this.setActiveScript}/>;
    } else if (activeRoute.path.slice(0, 6) === 'Script') {
      return this.state.activeScript.path === null ? null : <ViewScript script={this.state.activeScript}/>;
    } else if (activeRoute.path === 'Flights') {
      return <Flights getFlight={this.setFlight}/>;
    } else if (activeRoute.path === 'Email') {
      return <CreateEmail script={this.state.activeScript}/>;
    } else if (activeRoute.path.slice(0, 12) === 'ManageFlight') {
      return <ManageFlight flight={this.state.activeFlight}/>;
    }
    return <HomeComponent/>;
  }

  render() {
    return (
    <React.Fragment>
      <div className="container">
        <div className="row">
            <Sidebar/>
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
