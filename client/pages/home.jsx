import React from 'react';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = { incrementor: 0 };
  }

  handleClick() {
    const newValue = this.state.incrementor + 1;
    this.setState({ incrementor: newValue });
  }

  render() {

    return (
    <React.Fragment>
      <div className="container">

      </div>
    </React.Fragment>
    );
  }
}
export default Home;
