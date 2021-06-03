import React from 'react';

class ManageFlight extends React.Component {
  constructor(props) {
    super(props);
    this.controlChange = this.controlChange.bind(this);
    this.state = { script: '', contacts: [], selectedContactId: '' };
  }

  componentDidMount() {
    this.getFlightScript();
    this.getContacts();
  }

  getFlightScript = () => {
    const initGetScripts = { method: 'GET', headers: { 'Conent-Type': 'application/json' } };
    fetch(`/api/scripts/${this.props.flight.scriptId}`, initGetScripts)
      .then(response => response.json())
      .then(returnedResponse => {
        this.setState({ script: returnedResponse });
      }).catch(error => {
        console.error(error);
      });
  };

  getContacts = () => {
    const initGetContacts = { method: 'GET', headers: { 'Conent-Type': 'application/json' } };
    fetch('/api/contacts', initGetContacts)
      .then(response => response.json())
      .then(returnedResponse => {
        this.setState({ contacts: returnedResponse });
      }
      ).catch(error => console.error(error));
  }

  mappedContacts = contact => {
    return <option key={contact.contactId} id={contact.contactId} value={contact.contactId} name="selectedContactId">{contact.firstName + ' ' + contact.lastName} </option>;
  }

  clearForm = () => this.setState({ selectedContactId: null })

  controlChange(event) {
    this.setState({ selectedContactId: event.target.value });
  }

  blankElement() {
    return (
    <div className="row flex">
      <span className="specialText prompt blankElement">No Contacts in {this.props.flight.name} Presently </span>
    </div>);
  }

  submitFlightAssignment = event => {
    event.preventDefault();
    const flightAssignmentBody = {
      flightId: this.props.flight.flightId,
      contactId: this.state.selectedContactId
    };
    const initMethod = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(flightAssignmentBody) };
    fetch('/api/flightAssignments', initMethod)
      .then(response => response.json())
      .then(returnedResponse => {
        if (returnedResponse) alert('added to flight!');
        this.clearForm();
      }).catch(error => console.error(error));
  }

  buildTable(contactList) {
    const contactRow = contactList.map(contact => {
      return <tr key={contact.contactId}><td key={contact.contactId}> <span className="tableText">{contact.firstName + ' ' + contact.lastName}</span></td><td id={contact.contactId + 1}><span className="tableText">0</span></td><td id={contact.contactId + 2}><span className="tableText">{contact.email}</span></td></tr>;
    });
    return (
            <div className="row">
        <div className="col">
          <div className="table-container lg">
            <table id="contact_list">
              <thead>
                <tr>
                  <th><span className="specialText align-left">Contact Name</span></th>
                  <th><span className="specialText align-right">Contact Company </span></th>
                  <th><span className="specialText align-right">Contact Company </span></th>
                </tr>
              </thead>
              <tbody>
                {contactRow}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const contactList = this.state.contacts;
    return (
      <div className="flights">
        <div className="row flex">
            <span className="specialText prompt">Managing Flight - {this.props.flight.name}</span> <span className="specialText prompt manageFlightScriptPrompt">Script Name: {this.state.script.scriptName}</span>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-container lg">
              <form onSubmit={this.submitFlightAssignment}>
                <div className="row">
                    <label>Select Contact: </label>
                    <select id="Scripts" value={this.state.selectedContactId} onChange={this.controlChange} name="selectedContactId">
                    <option value="" className="defaultOption">Select a contact here</option>
                    {contactList.map(this.mappedContacts)}
                    </select >
                </div>
                 <div className="align-right">
                  <button onSubmit={this.submitFlightAssignment}>Add Contact</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {contactList.length > 10 ? this.buildTable(contactList) : this.blankElement()}
      </div>
    );
  }
}

export default ManageFlight;
