import React from 'react';
import { launchFlight, removeContact } from './flight-functions';

function triggerButton(flightId) {
  launchFlight(flightId);
  window.location.hash = 'Flights';
}

function triggerButtonRemoveContact(flightIdentity, contact) {
  removeContact(flightIdentity, contact.contactId);
}

function FlightTable({ contactList, flightId, deleteContact }) {
  const contactRow = contactList.map(contact => {
    return <tr key={contact.contactId}><td key={contact.contactId}> <span className="table-text">{contact.firstName + ' ' + contact.lastName}</span></td><td id={contact.contactId + 2}><span className="table-text align-left">{contact.email}</span></td><td id={contact.contactId + 2}><button onClick={function () { triggerButtonRemoveContact(flightId, contact); deleteContact(contact); } } className="remove-contact align-right">Remove</button></td></tr>;
  });
  return (<React.Fragment>
            <div className="row">
        <div className="col">
          <div className="table-container lg">
            <table id="contact_list">
              <thead>
                <tr>
                  <th><span className="special-text align-left">Contact Name</span></th>
                  <th><span className="special-text align-left">Contact Email </span></th>
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
          <button onClick={ function () { triggerButton(flightId); }}>Begin Flight</button>
    </div>
    </React.Fragment>
  );
}

function BlankElement({ flightName }) {
  return (
    <div className="row flex">
      <span className="special-text prompt blank-element">No Contacts in {flightName} Presently </span>
    </div>);
}

export { FlightTable, BlankElement };
