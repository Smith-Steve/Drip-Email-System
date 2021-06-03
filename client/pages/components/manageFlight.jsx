import React from 'react';

class ManageFlight extends React.Component {
  constructor(props) {
    super(props);
    this.state = { flight: this.props.flight, script: '' };
  }

  componentDidMount() {
  }

  getListOfScripts = () => {
    const initGetScripts = { method: 'GET', headers: { 'Conent-Type': 'application/json' } };
    fetch('/api/scripts/', initGetScripts)
      .then(response => response.json())
      .then(returnedResponse => {
        this.setState({ scripts: returnedResponse });
      }).catch(error => {
        console.error(error);
      });
  };

  render() {
    return (
      <div className="flights">
        <div className="row">
          <div className="col">
            <span className="specialText">Managing Flight - </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-container lg">
              <form>
                <div className="row">
                  <label>Add Contact:</label>
                  <input className="margin" type="text" name="contact" required></input>
                </div>
                <div className="align-right">
                  <button >Add Contact</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageFlight;
