import React from 'react';

class CreateContact extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.state = { firstName: '', lastName: '', company: '', email: '', phoneNumber: '' };
  }

  handleChange(event) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const initMethod = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.state) };
    fetch('/api/contacts/', initMethod)
      .then(response => response.json())
      .then(returnedResponse => {
        if (returnedResponse) {
          alert('Submited!');
          this.clearForm();
        } else {
          alert('Not Submitted');
        }
      }).catch(err => {
        if (err) throw err;
      });
  }

  clearForm() {
    this.setState({ firstName: '', lastName: '', company: '', email: '', phoneNumber: '' });
  }

  render() {
    return (
      <div className="row create-contact">
        <div className="column picture">
          <span><img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="generic contact"></img></span>
        </div>
        <div className="column form">
          <form onSubmit={this.handleSubmit}>
            <div className="formBlock">
              <label> Firstname: </label>
              <input type="text" name="firstName" className="contact" value={this.state.firstName} onChange={this.handleChange} maxLength="15" required/>
            </div>
            <div className="formBlock">
              <label> Lastname: </label>
              <input type="text" name="lastName" className="contact" value={this.state.lastName} onChange={this.handleChange} maxLength="15" required/>
            </div>
            <div className="formBlock">
              <label className="companyLabel"> Company: </label>
              <input type="text" name="company" className="contact" value={this.state.company} onChange={this.handleChange} maxLength="15" required/>
            </div>
            <div className="formBlock">
              <label className="emailLabel"> E-mail: </label>
              <input type="email" name="email" className="contact" value={this.state.email} onChange={this.handleChange} maxLength="30" required/>
            </div>
            <div className="formBlock">
              <label className="phoneLabel"> Phone #: </label>
              <input type="text" name="phoneNumber" className="contact" value={this.state.phoneNumber} onChange={this.handleChange} required/>
            </div>
            <div className="align-right">
              <button className="createContact" onSubmit={this.handleSubmit}>Enter Contact</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateContact;