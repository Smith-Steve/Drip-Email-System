import React from 'react';

class ViewScript extends React.Component {
  constructor(props) {
    super(props);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.state = { scriptName: this.props.script.scriptName, scriptId: this.props.script.scriptId };
  }

  handlePageChange() {
    window.location.hash = 'Email';
  }

  render() {
    return (
      <div className="view-script">
        <div className="row">
          <div className="col">
              <span className="specialText prompt">Manage Script: {this.props.script.scriptName} </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="lg flexContainer">
              <div className="row view-script">
                <div className="col">
                  <span className="specialText view-script">{this.props.script.scriptName} is a new script to which there are no e-mails attached</span>
                  <div className="align-right">
                    <button className="createEmail" onClick={this.handlePageChange}>Create Email</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewScript;