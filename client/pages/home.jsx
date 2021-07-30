import React from 'react';
import Sidebar from './sidebar';
import parseRoute from './lib/parse-route';
import CreateContact from './components/contacts/create-contact';
import Scripts from './components/scripts-folder/scripts';
import ViewScript from './components/scripts-folder/view-script';
import CreateEmail from './components/scripts-folder/email-components/create-email';
import Flights from './components/flight/flights';
import ManageFlight from './components/manage-flight/manage-flight';
import HomeComponent from './home-component';
import AppContext from './lib/app-context';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.setActiveScript = this.setActiveScript.bind(this);
    this.setFlight = this.setFlight.bind(this);
    this.closeSideBar = this.closeSideBar.bind(this);
    this.state = { route: parseRoute(window.location.hash), activeScript: JSON.parse(localStorage.getItem('Active-Script')) || null, activeFlight: JSON.parse(localStorage.getItem('Active-Flight')) || null, sideBar: 'closed-open-first-time', arrowVisibility: 'visible' };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      const activeRoute = parseRoute(window.location.hash);
      this.setState({ route: activeRoute });
      localStorage.setItem('Active-Route', this.state.route.path);
    });

    window.addEventListener('mousemove', () => {
      if (event.clientX < 100) {
        this.setState({ sideBar: 'open' });
      } else if (event.clientX > 100) {
        this.setState({ sideBar: 'closed' });
      }
    });
  }

  setActiveScript(selectedScript) {
    this.setState({ activeScript: selectedScript });
  }

  setFlight(selectedFlight) {
    this.setState({ activeFlight: selectedFlight });
  }

  closeSideBar() {
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
    const contextValue = { activeScript, activeFlight, route };
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
