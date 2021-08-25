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

  clearForm() {
    this.setState({ subject: '', emailBody: '' });
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    let emailSubmission;
    if (form.get('date') === null) {
      emailSubmission = new Email(this.state.subject, this.state.emailBody, this.props.script.scriptId);
    } else {
      const dateInfo = form.get('date'); const timeInfo = form.get('time');
      const dateArray = dateInfo.split('-'); const timeArray = timeInfo.split(':');
      const [year, month, day] = dateArray; const [hour, minute] = timeArray;
      emailSubmission = new Email(this.state.subject, this.state.emailBody, this.props.script.scriptId, this.state.emailNumberInSequence, new Date(year, month - 1, day, hour, minute));
    }
    const initMethod = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(emailSubmission) };
    fetch('/api/emails', initMethod)
      .then(response => response.json())
      .then(returnedResponse => {
        if (returnedResponse) alert('email submitted!');
        this.clearForm();
        window.location.hash = localStorage.getItem('Active-Route');
        this.setState({ emailNumberInSequence: this.state.emailNumberInSequence + 1 });
      })
      .catch(error => {
        if (error) alert('please check submission and try again');
        console.error(error);
      });
  }

  getCount() {
    const initGetCount = { method: 'GET', headers: { 'Conent-Type': 'application/json' } };
    fetch(`/api/scripts/count/${this.props.script.scriptId}`, initGetCount)
      .then(response => response.json())
      .then(returnedResponse => {
        const emailNumber = parseInt(returnedResponse.count, 10);
        this.setState({ emailNumberInSequence: emailNumber + 1 });
      })
      .catch(error => {
        console.error(error);
      });
  }

  renderSelectInput = emailNumber => {
    return (<div className="align-right">
      <span className="special-text">E-mail Number# {emailNumber}</span>
    </div>);
  }

  renderTimeFields = () => {
    return (
      <>
        <div className="align-left">
                <div className="input-row">
                  <label>Date </label>
                  <input type="date" className="date" name="date" min={new Date().toISOString().split('T')[0]} required/>
                </div>
              </div>
              <div className="align-left sendon-row">
                <div className="input-row">
                  <label>Time </label>
                  <input type="time" className="time" name="time" required/>
                </div>
              </div>
      </>
    );
  }

  render() {
    const emailsInActiveScript = this.state.emailNumberInSequence;
    return (
      <div className="create-email">
        <div className="row">
          <div className="col">
            <span className="special-text">Manage Script - {this.props.script.scriptName}</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-container rounded-corners lg">
              {emailsInActiveScript > 0 ? this.renderSelectInput(emailsInActiveScript) : null}
              <form className="create-email" onSubmit={this.handleSubmit}>
                <div className="input-row">
                  <label htmlFor="subjectInputField">Subject:</label>
                  <input className="subjectInputField" value={this.state.subject} onChange={this.handleFormChange} type="text" name="subject" required/>
                </div>
                <div className="input-row">
                  <label>Body:</label>
                  <textarea className="emailBodyField" value={this.state.emailBody} onChange={this.handleFormChange} type="text" rows="8" name="emailBody" required/>
                </div>
                <div className="align-right">
                  <button className="scripts purple-button" onSubmit={this.handleSubmit}>Create Email</button>
                </div>
                {emailsInActiveScript > 1 ? this.renderTimeFields() : null}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateEmail;
