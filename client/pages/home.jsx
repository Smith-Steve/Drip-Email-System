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
import AppContext from './lib/app-context';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.setActiveScript = this.setActiveScript.bind(this);
    this.setFlight = this.setFlight.bind(this);
    this.state = { route: parseRoute(window.location.hash), activeScript: JSON.parse(localStorage.getItem('Active-Script')) || null, activeFlight: JSON.parse(localStorage.getItem('Active-Flight')) || null, sideBar: 'closed-open-first-time', arrowVisibility: 'visible' };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      const activeRoute = parseRoute(window.location.hash);
      this.setState({ route: activeRoute });
    });

    window.addEventListener('mousemove', () => {
      if (event.clientX < 100) {
        this.setState({ sideBar: 'open' });
      } else if (event.clientX > 100) {
        this.setState({ sideBar: 'closed' });
      }
    });
  }

  getScript = () => {
    window.localStorage.getItem('Active-Route');
  }

  setActiveScript(selectedScript) {
    this.setState({ activeScript: selectedScript });
  }

  setFlight(selectedFlight) {
    this.setState({ activeFlight: selectedFlight });
  }

  closeSideBar = () => {
    this.setState({ sideBar: 'closed' });
  }

  renderComponent() {
    const { path } = this.state.route;
    if (path === 'Contacts') {
      return <CreateContact/>;
    } else if (path === 'Scripts') {
      return <Scripts setActiveScript={this.setActiveScript}/>;
    } else if (path.slice(0, 6) === 'Script') {
      return <ViewScript script={this.state.activeScript}/>;
    } else if (path === 'Flights') {
      return <Flights getFlight={this.setFlight}/>;
    } else if (path === 'Email') {
      return <CreateEmail script={this.state.activeScript}/>;
    } else if (path.slice(0, 12) === 'ManageFlight') {
      return <ManageFlight flight={this.state.activeFlight}/>;
    }

    return <HomeComponent/>;
  }

  render() {
    const { activeFlight, route, activeScript } = this.state;
    const { getScript } = this;
    const contextValue = { activeScript, activeFlight, route, getScript };
    return (
    <AppContext.Provider value={contextValue}>
    <React.Fragment>
      <div className={`container ${this.state.sideBar}`}>
        <div className="row parent">
          <Sidebar removeSideBar={this.closeSideBar} sideBarState={this.state.sideBar}/>
          <div className={`column component-container ${this.state.sideBar}`}>
            {route.path === '' ? <i className={`fa fa-arrow-left ${this.state.sideBar}`}></i> : null}
            {this.renderComponent()}
          </div>
        </div>
      </div>
    </React.Fragment>
    </AppContext.Provider>
    );
  }

}
export default Home;
