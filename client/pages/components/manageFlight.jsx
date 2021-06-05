import React from 'react';

class ManageFlight extends React.Component {
  constructor(props) {
    super(props);
    this.controlChange = this.controlChange.bind(this);
    this.getContacts = this.getContacts.bind(this);
    this.state = { script: '', contacts: [], selectedContactId: '', contactsAssignedToFlight: [], final: [] };
  }

  componentDidMount() {
    this.getFlightScript();
    this.getContacts();
    this.contactsAssignedToFlight();
  }

  addNewContactToFlight = newContact => {
    this.setState(state => {
      for (let i = 0; i < this.state.contacts.length; i++) {
        const activeContact = this.state.contacts[i];
        for (const key in activeContact) {
          if (activeContact[key] === parseInt(newContact.contactId, 10)) {
            const updateListOfContactsInFlight = [activeContact, ...this.state.contactsAssignedToFlight];
            return {
              contactsAssignedToFlight: updateListOfContactsInFlight
            };
          }
        }
      }
    });
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

  launchFlight = () => {
    const initGetLaunchFlight = { method: 'GET', headers: { 'Conent-Type': 'application/json' } };
    fetch(`/api/email/${this.props.flight.flightId}`, initGetLaunchFlight)
      .then(response => response.json())
      .then(returnedResponse => {
        this.setState({ final: returnedResponse });
      }).catch(error => {
        console.error(error);
      });
  }

  getContacts = () => {
    const initGetContacts = { method: 'GET', headers: { 'Conent-Type': 'application/json' } };
    fetch('/api/contacts', initGetContacts)
      .then(response => response.json())
      .then(returnedResponse => {
        this.setState({ contacts: returnedResponse });
      }
      ).catch(error => console.error(error));
  }

  contactsAssignedToFlight = () => {
    const initGetContacts = { method: 'GET', headers: { 'Conent-Type': 'application/json' } };
    fetch(`/api/contacts/flightAssignment/${this.props.flight.flightId}`, initGetContacts)
      .then(response => response.json())
      .then(returnedResponse => {
        this.setState({ contactsAssignedToFlight: returnedResponse });
      }
      ).catch(error => console.error(error));
  }

  mappedContacts = contact => {
    return <option key={contact.contactId} id={contact.contactId} value={contact.contactId} name="selectedContactId">{contact.firstName + ' ' + contact.lastName} </option>;
  }

  clearForm = () => this.setState({ selectedContactId: '' })

  controlChange(event) {
    this.setState({ selectedContactId: event.target.value });
  }

  blankElement() {
    return (
    <div className="row flex">
      <span className="specialText prompt blankElement">No Contacts in {this.props.flight.flightName} Presently </span>
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
        this.addNewContactToFlight(returnedResponse);
        this.clearForm();
      }).catch(error => console.error(error));
  }

  buildTable(contactList) {
    const contactRow = contactList.map(contact => {
      return <tr key={contact.contactId}><td key={contact.contactId}> <span className="tableText">{contact.firstName + ' ' + contact.lastName}</span></td><td id={contact.contactId + 1}><span className="tableText">{contact.company}</span></td><td id={contact.contactId + 2}><span className="tableText">{contact.email}</span></td></tr>;
    });
    return (<React.Fragment>
            <div className="row">
        <div className="col">
          <div className="table-container lg">
            <table id="contact_list">
              <thead>
                <tr>
                  <th><span className="specialText align-left">Contact Name</span></th>
                  <th><span className="specialText align-right">Contact Company </span></th>
                  <th><span className="specialText align-right">Contact Email </span></th>
                </tr>
              </thead>
              <tbody>
                {contactRow}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    <div className="align-right">
          <button onClick={this.launchFlight}>Begin Flight</button>
    </div>
    </React.Fragment>
    );
  }

  render() {
    const contactList = this.state.contacts;
    const contactFlightList = this.state.contactsAssignedToFlight;
    return (
      <div className="flights">
        <div className="row flex">
            <span className="specialText prompt">Managing Flight - {this.props.flight.flightName}</span> <span className="specialText prompt manageFlightScriptPrompt">Script Name: {this.state.script.scriptName}</span>
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
        {contactFlightList.length > 0 ? this.buildTable(contactFlightList) : this.blankElement()}
      </div>
    );
  }
}

export default ManageFlight;
