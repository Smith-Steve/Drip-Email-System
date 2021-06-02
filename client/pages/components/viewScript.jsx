import React from 'react';

class ViewScript extends React.Component {
  constructor(props) {
    super(props);
    this.state = { route: '', activeScript: null };
  }

  render() {
    return (
      <div className="manage-scripts">
        <div className="row">
          <div className="col">
              <span className="specialText">Manage Script: {this.props.script.scriptName} </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="lg flexContainer">
              <div className="row">
                <span className="specialText">{this.props.script.scriptName} is a new script to which there are no e-mails attached</span>
              </div>
            <div className="align-right">
              <button className="viewScripts">Create Email</button>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewScript;
