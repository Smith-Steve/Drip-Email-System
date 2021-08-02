import React from 'react';
import { FlightTable, BlankElement } from './flight-table';

class ManageFlight extends React.Component {
  constructor(props) {
    super(props);
    this.controlChange = this.controlChange.bind(this);
    this.getContacts = this.getContacts.bind(this);
    this.submitFlightAssignment = this.submitFlightAssignment.bind(this);
    this.state = { script: '', contacts: [], selectedContactId: '', contactsAssignedToFlight: [], final: [] };
  }

  componentDidMount() {
    this.getFlightScript();
    this.getContacts();
    this.contactsAssignedToFlight();
  }

  addNewContactToFlight(newContact) {
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

  getContacts() {
    const initGetContacts = { method: 'GET', headers: { 'Conent-Type': 'application/json' } };
    fetch('/api/contacts', initGetContacts)
      .then(response => response.json())
      .then(returnedResponse => {
        this.setState({ contacts: returnedResponse });
      }
      ).catch(error => console.error(error));
  }

  contactsAssignedToFlight() {
    const initGetContacts = { method: 'GET', headers: { 'Conent-Type': 'application/json' } };
    fetch(`/api/contacts/flightAssignment/${this.props.flight.flightId}`, initGetContacts)
      .then(response => response.json())
      .then(returnedResponse => {
        this.setState({ contactsAssignedToFlight: returnedResponse });
      }
      ).catch(error => console.error(error));
  }

  mappedContacts(contact) {
    return <option key={contact.contactId} id={contact.contactId} value={contact.contactId} name="selectedContactId">{contact.firstName + ' ' + contact.lastName} </option>;
  }

  clearForm() {
    this.setState({ selectedContactId: '' });
  }

  controlChange(event) {
    this.setState({ selectedContactId: event.target.value });
  }

  submitFlightAssignment(event) {
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

  deleteContact(deletedContact) {
    this.setState(prevState => {
      const indexOfPerson = prevState.contactsAssignedToFlight.findIndex(
        contact => contact.email === deletedContact.email
      );

      const newContactList = [...prevState.contactsAssignedToFlight];
      if (indexOfPerson >= 0) {
        newContactList.splice(indexOfPerson, 1);
      }
      return {
        contactsAssignedToFlight: newContactList
      };
    });
  }

  getFlightScript() {
    const initGetScripts = { method: 'GET', headers: { 'Conent-Type': 'application/json' } };
    fetch(`/api/scripts/${this.props.flight.scriptId}`, initGetScripts)
      .then(response => response.json())
      .then(returnedResponse => {
        this.setState({ script: returnedResponse });
      }).catch(error => {
        console.error(error);
      });
  }

  render() {
    const contactList = this.state.contacts;
    const contactFlightList = this.state.contactsAssignedToFlight;
    return (
      <div className="flights">
        <div className="row flex">
            <span className="special-text prompt">Managing Flight - {this.props.flight.flightName}</span> <span className="special-text prompt manageFlightScriptPrompt">Script Name: {this.state.script.scriptName}</span>
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
                  <button className="purpleButton" onSubmit={this.submitFlightAssignment}>Add Contact</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {contactFlightList.length > 0 ? <FlightTable contactList={contactFlightList} flightId={this.props.flight.flightId} deleteContact={this.deleteContact}/> : <BlankElement flightName={this.props.flight.flightName}/>}
      </div>
    );
  }
}

export default ManageFlight;
