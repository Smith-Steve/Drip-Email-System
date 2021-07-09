import React from 'react';
import Email from '../../../lib/email-post';

class CreateEmail extends React.Component {
  constructor(props) {
    super(props);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { subject: '', emailBody: '', emailNumberInSequence: '' };
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
    const form = new FormData(event.target);
    const dateInfo = form.get('date'); const timeInfo = form.get('time');
    const dateArray = dateInfo.split('-'); const timeArray = timeInfo.split(':');
    const [year, month, day] = dateArray; const [hour, minute] = timeArray;
    const emailSubmission2 = new Email(this.state.subject, this.state.emailBody, this.props.script.scriptId, this.state.emailNumberInSequence, new Date(year, month - 1), day, hour, minute);
    const initMethod = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(emailSubmission2) };
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
        this.setState({ emailNumberInSequence: parseInt(returnedResponse.count, 10) });
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
    const emailsInActiveScript = this.state.emailNumberInSequence;
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
                  <input className="subjectInputField" name="subjectInputField" value={this.state.subject} onChange={this.handleFormChange} type="text" required/>
                </div>
                </div>
                <div className="input-row">
                  <label>Body:</label>
                <div className="emailInputContainer">
                  <textarea className="emailBodyField" name="emailBodyField" value={this.state.emailBody} onChange={this.handleFormChange} type="text" rows="8" required/>
                </div>
                </div>
                <div className="align-right">
                  <button className="scripts purpleButton" onSubmit={this.handleSubmit}>Create Email</button>
                </div>
                <div className="align-left">
                <div className="input-row">
                  <label>Date: </label>
                  <input type="date" className="date" name="date" required/>
                </div>
              </div>
              <div className="align-left sendOn-row">
                <div className="input-row">
                  <label>Time: </label>
                  <input type="time" className="time" name="time" required/>
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
