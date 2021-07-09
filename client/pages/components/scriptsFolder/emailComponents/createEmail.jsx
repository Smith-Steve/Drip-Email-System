import React from 'react';

class CreateEmail extends React.Component {
  constructor(props) {
    super(props);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { subject: '', emailBody: '', numberOfEmailsInScript: '' };
  }

  componentDidMount() {
    this.getCount();
  }

  handleFormChange(event) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  }

  clearForm = () => this.setState({ subject: '', emailBody: '' })

  handleSubmit(event) {
    event.preventDefault();
    const formTimeInfo = new FormData(event.target);
    const date = formTimeInfo.get('date'); const time = formTimeInfo.get('time');
    const dateInformation = date.split('-'); const timeInformation = time.split(':');
    // eslint-disable-next-line no-unused-vars
    const [year, month, day] = dateInformation; const [hour, minute] = timeInformation;
    // fetch defaults to 1. So if there are more than 1 emails in script, than the number of emails is entered into the body of the init method
    // so that it does not default to 1. Elsewise, as it must be the first email, 1 is put in.
    const emailSubmission = { subject: this.state.subject, emailBody: this.state.emailBody, scriptId: this.props.script.scriptId, emailNumberInSequence: this.state.emailNumberInSequence };
    const initMethod = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(emailSubmission) };

    fetch('/api/emails', initMethod)
      .then(response => response.json())
      .then(returnedResponse => {
        if (returnedResponse) alert('email submitted!');
        this.clearForm();
        window.location.hash = localStorage.getItem('Active-Route'); // not correct
      })
      .catch(error => {
        if (error) alert('Please check submission and try again.');
        console.error(error);
      });
  }

  getCount = () => {
    const initGetCount = { method: 'GET', headers: { 'Conent-Type': 'application/json' } };
    fetch(`/api/scripts/count/${this.props.script.scriptId}`, initGetCount)
      .then(response => response.json())
      .then(returnedResponse => {
        this.setState({ numberOfEmailsInScript: parseInt(returnedResponse.count, 10) });
      })
      .catch(error => {
        console.error(error);
      });
  }

  renderSelectInput = emailNumber => {
    return (<div className="align-right">
      <span className="specialText">E-mail Number#: {emailNumber}</span>
    </div>);
  }

  render() {
    const emailsInActiveScript = this.state.numberOfEmailsInScript;
    return (
      <div className="create-email">
        <div className="row">
          <div className="col">
            <span className="specialText">Manage Script - {this.props.script.scriptName}</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-container lg">
              {emailsInActiveScript > 0 ? this.renderSelectInput(emailsInActiveScript) : null}
              <form className="create-email" onSubmit={this.handleSubmit}>
                <div className="input-row">
                  <label>Subject:</label>
                <div className="emailInputContainer">
                  <input className="subjectInputField" value={this.state.subject} onChange={this.handleFormChange} type="text" name="subject" required/>
                </div>
                </div>
                <div className="input-row">
                  <label>Body:</label>
                <div className="emailInputContainer">
                  <textarea className="emailBodyField" value={this.state.emailBody} onChange={this.handleFormChange} type="text" rows="8" name="emailBody" required/>
                </div>
                </div>
                <div className="align-right">
                  <button className="scripts purpleButton" onSubmit={this.handleSubmit}>Create Email</button>
                </div>
                <div className="align-left">
                <div className="input-row">
                  <label>Date: </label>
                  <input type="date" className="date" required/>
                </div>
              </div>
              <div className="align-left sendOn-row">
                <div className="input-row">
                  <label>Time: </label>
                  <input type="time" className="time" required/>
                </div>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateEmail;
