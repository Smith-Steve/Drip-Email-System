import React from 'react';
import { launchFlight } from './flightFunctions';

const triggerButton = flightId => {
  launchFlight(flightId);
};

function FlightTable({ contactList, flightId }) {
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
          <button onClick={ function () { triggerButton(flightId); }}>Begin Flight</button>
    </div>
    </React.Fragment>
  );
}

function BlankElement({ flightName }) {
  return (
    <div className="row flex">
      <span className="specialText prompt blankElement">No Contacts in {flightName} Presently </span>
    </div>);
}

export { FlightTable, BlankElement };