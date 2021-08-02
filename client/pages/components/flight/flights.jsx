import React from 'react';
import AppContext from '../../lib/app-context';

export default class Flights extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.submitFlight = this.submitFlight.bind(this);
    this.state = { flightName: '', topics: '', scripts: [], selectedScriptId: '', flights: [] };
  }

  componentDidMount() {
    this.getListOfScripts();
    this.getListOfFlights();
  }

  getListOfScripts() {
    const initGetScripts = { method: 'GET', headers: { 'Conent-Type': 'application/json' } };
    fetch('/api/scripts/', initGetScripts)
      .then(response => response.json())
      .then(returnedResponse => {
        this.setState({ scripts: returnedResponse });
      }).catch(error => {
        console.error(error);
      });
  }

  getFlightInfo(flight) {
    this.props.getFlight(flight);
    window.localStorage.setItem('Active-Flight', JSON.stringify(flight));
  }

  getListOfFlights() {
    const initGetScripts = { method: 'GET', headers: { 'Conent-Type': 'application/json' } };
    fetch('/api/flights/', initGetScripts)
      .then(response => response.json())
      .then(returnedResponse => {
        this.setState({ flights: returnedResponse });
      }).catch(error => {
        console.error(error);
      });
  }

  handleChange(event) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  }

  clearForm() {
    this.setState({ flightName: '', topics: '', selectedScriptId: '' });
  }

  addFlight(newFlight) {
    this.setState(state => {
      const completeFlightList = [newFlight, ...this.state.flights];
      return {
        flights: completeFlightList
      };
    });
  }

  submitFlight(event) {
    event.preventDefault();
    const flightBody = {
      flightName: this.state.flightName,
      topics: this.state.topics
    };
    const initMethod = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(flightBody) };
    fetch(`/api/flights/${this.state.selectedScriptId}`, initMethod)
      .then(response => response.json())
      .then(returnedResponse => {
        if (returnedResponse) alert('Flight Submitted!');
        this.clearForm();
        this.addFlight(returnedResponse);
      }).catch(error => {
        console.error(error);
      });
  }

  buildTable(flightsList) {
    const flightRow = flightsList.map(flight => {
      return <tr key={flight.flightId}><td key={flight.flightId}> <span className="table-text" key={flight.flightId + 1}>{flight.flightName}</span></td><td id={flight.flightId + 2}><a href={`#ManageFlight/FlightId/${flight.flightId}`}><button className="manageFlights alignRight" onClick={() => this.getFlightInfo(flight)} key={flight.flightId + 2}>Manage Flight</button></a></td></tr>;
    });

    return (
      <div className="row">
        <div className="col">
          <div className="table-container lg">
            <table id="flights-list">
              <thead>
                <tr>
                  <th><span className="special-text align-left">Flight Name:</span></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {flightRow}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  mappedSelectionScripts(script) {
    return <option key={script.scriptId} id={script.scriptId} value={script.scriptId} name="selectedScriptId">{script.scriptName}</option>;
  }

  render() {
    const scriptList = this.state.scripts;
    const flightList = this.state.flights;
    return (
      <div className="flights">
        <div className="row">
          <div className="col">
            <span className="special-text prompt">Flight Set Up: </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-container lg">
              <form onSubmit={this.submitFlight}>
                <div className="input-row">
                  <label>Flight Name:</label>
                  <input type="text" name="flightName" value={this.state.flightName} onChange={this.handleChange} required></input>
                </div>
                <div className="input-row">
                  <label>Flight Topic(s): </label>
                  <input name="topics" value={this.state.topics} onChange={this.handleChange} required></input>
                </div>
                <div className="input-row">
                  <label>Choose Script: </label>
                  <select id="scripts" value={this.state.selectedScriptId} onChange={this.handleChange} name="selectedScriptId">
                    <option value="" className="default-option">Select a Script Here</option>
                    {scriptList.map(this.mappedSelectionScripts)}
                  </select>
                </div>
                <div className="align-right">
                  <button className="purple-button" onSubmit={this.submitFlight}>Create</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {flightList.length > 0 ? this.buildTable(flightList) : null}
      </div>
    );
  }
}

Flights.contextType = AppContext;
