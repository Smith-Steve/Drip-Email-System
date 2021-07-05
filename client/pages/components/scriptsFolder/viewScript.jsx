import React from 'react';
import AppContext from '../../lib/app-context';
import EmailTable from './emailComponents/emailTable';

export default class ViewScript extends React.Component {
  constructor(props) {
    super(props);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.state = { emails: {} };
  }

  componentDidMount() {
    this.getEmails();
  }

  handlePageChange() {
    window.location.hash = 'Email';
  }

  getEmails = () => {
    const initGetEmails = { method: 'GET', headers: { 'Content-Type': 'application/json' } };
    fetch(`/api/emails/${this.props.script.scriptId}`, initGetEmails)
      .then(response => response.json())
      .then(returnedResponse => {
        this.setState({ emails: returnedResponse });
      });
  }

  renderPrompt = emailListLength => {
    return (emailListLength > 0 ? <span className="specialText view-script">{this.props.script.scriptName} has {emailListLength} email(s) attached to it.</span> : <span className="specialText view-script">{this.props.script.scriptName} is a new script to which there are no e-mails attached</span>);
  }

  render() {
    const { activeScript } = this.context;
    const emailList = this.state.emails;
    return (
      <div className="view-script-component">
        <div className="view-script">
          <div className="row">
            <div className="col">
                <span className="specialText prompt">Manage Script: {activeScript.scriptName} </span>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="lg flexContainer">
                <div className="row view-script">
                  <div className="col">
                    {this.renderPrompt(emailList.length)}
                    <div className="align-right">
                      <button className="createEmail purpleButton" onClick={this.handlePageChange}>Create Email</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {emailList.length > 0 ? <EmailTable emailList={emailList} scriptName={this.props.script.scriptName}></EmailTable> : null}
      </div>
    );
  }
}

ViewScript.contextType = AppContext;
