import React from 'react';

class CreateContact extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { firstName: '', lastName: '', company: '', email: '', phoneNumber: '' };
  }

  handleChange(event) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    // will come back to this code, and add toaster to provide user feedback around entry.

    const initMethod = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.state) };
    fetch('/api/contacts/', initMethod)
      .then(response => response.json())
      // eslint-disable-next-line no-console
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div className="row create-contact">
        <span><img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="generic contact"></img></span>
        <div className="column picture">
        </div>
        <div className="column form">
          <form onSubmit={this.handleSubmit}>
            <label>
              <span>First Name:</span>
              <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange}/>
              Last Name:
              <input type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange}/>
              Company:
              <input type="text" name="company" value={this.state.company} onChange={this.handleChange}/>
              E-mail:
              <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
              Phone Number:
              <input type="text" name="phoneNumber" value={this.state.phoneNumber} onChange={this.handleChange}/>
              <button onSubmit={this.handleSubmit}>Submit</button>
            </label>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateContact;
