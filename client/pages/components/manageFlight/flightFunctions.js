const launchFlight = flightId => {
  const initGetLaunchFlight = { method: 'GET', headers: { 'Content-Type': 'application/json' } };
  fetch(`/api/email/${flightId}`, initGetLaunchFlight)
    .then(response => response.json())
    .then(alert('Flight Launched!'))
    .catch(error => {
      console.error(error);
    });
};

export { launchFlight };
