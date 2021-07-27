const launchFlight = flightId => {
  const initGetLaunchFlight = { method: 'GET', headers: { 'Content-Type': 'application/json' } };
  fetch(`/api/email/${flightId}`, initGetLaunchFlight)
    .then(response => response.json())
    .then(alert('Flight Launched!'))
    .catch(error => {
      console.error(error);
    });
};

const removeContact = (flightId, contactId) => {
  const removeContactIdBody = { contactId: contactId };
  const init = { method: 'Delete', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(removeContactIdBody) };
  fetch(`/api/flightAssignments/${flightId}`, init)
    .then(response => {
      if (response) alert('removed from flight');
    }).catch(error => console.error(error));
};

export { launchFlight, removeContact };
