import React from 'react';

class CreateEmail extends React.Component {
  constructor(props) {
    super(props);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { subject: '', emailBody: '' };
  }

  handleFormChange(event) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  }

  clearForm = () => this.setState({ subject: '', emailBody: '' })

  handleSubmit(event) {
    event.preventDefault();
    const emailSubmission = { subject: this.state.subject, emailBody: this.state.emailBody, scriptId: this.props.script.scriptId };
    const initMethod = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(emailSubmission) };

    fetch('/api/emails', initMethod)
      .then(response => response.json())
      .then(returnedResponse => {
        if (returnedResponse) alert('email submitted!');
        this.clearForm();
      })
      .catch(error => {
        if (error) alert('Please check submission and try again.');
        console.error(error);
      });
  }

  render() {
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
              <form className="create-email" onSubmit={this.handleSubmit}>
                <div>
                  <label>Subject:</label>
                </div>
                <div className="emailInputContainer">
                  <input className="subjectInputField" value={this.state.subject} onChange={this.handleFormChange} type="text" name="subject" required/>
                </div>
                <div>
                  <label>Body:</label>
                </div>
                <div className="emailInputContainer">
                  <textarea className="emailBodyField" value={this.state.emailBody} onChange={this.handleFormChange} type="text" rows="8" name="emailBody" required/>
                </div>
                <div className="align-right">
                  <button className="scripts purpleButton" onSubmit={this.handleSubmit}>Create Email</button>
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
