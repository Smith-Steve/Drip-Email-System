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

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: window.location.hash });
    });
  }

  getRoute() {
    const newRoute = window.location.hash.replace('#', '');
    this.setState({ route: newRoute });
  }

  renderComponent() {
    const activeRoute = this.state.route;
    if (activeRoute === 'Contacts') {
      return <CreateContact/>;
    } else if (activeRoute === 'Scripts') {
      return <Scripts/>;
    } else {
      return null;
    }
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
            {this.renderComponent()}
          </div>
        </div>
      </div>
    </React.Fragment>
    );
  }
}
export default Home;
