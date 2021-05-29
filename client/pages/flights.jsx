import React from 'react';

class Flights extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.getListOfScripts = this.getListOfScripts.bind(this);
    this.mappedSelectionScripts = this.mappedSelectionScripts.bind(this);
    this.state = { name: '', topics: '', scripts: [], selectedScriptId: '' };
  }

  componentDidMount() {
    this.getListOfScripts();
  }

    getListOfScripts = () => {
      const initGetScripts = { method: 'GET', headers: { 'Conent-Type': 'application/json' } };
      fetch('/api/scripts/', initGetScripts)
        .then(response => response.json())
        .then(returnedResponse => {
          this.setState({ scripts: returnedResponse });
        }).catch(error => {
          error.log(error);
        });
    }

    handleChange(event) {
      const name = event.target.name;
      this.setState({ [name]: event.target.value });
    }

    clearForm = () => this.setState({ name: '', topics: '', selectedScriptId: '' })

  submitFlight = event => {
    event.preventDefault();
    const flightBody = {
      name: this.state.name,
      topics: this.state.topics
    };
    const initMethod = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(flightBody) };
    fetch(`/api/flights/${this.state.selectedScriptId}`, initMethod)
      .then(response => response.json())
      .then(returnedResponse => {
        if (returnedResponse) alert('Flight Submitted!');
        this.clearForm();
      }).catch(error => {
        if (error) throw error;
      });
  }

  mappedSelectionScripts = script => {
    return <option key={script.scriptId} id={script.scriptId} value={script.scriptId} name="selectedScriptId">{script.scriptName}</option>;
  }

  render() {
    const scriptList = this.state.scripts;
    return (
      <div className="flights">
        <div className="row">
          <div className="col">
            <span className="specialText">Flight Set Up: </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-container lg">
              <form onSubmit={this.submitFlight}>
                <div className="row">
                  <label>Flight Name:</label>
                  <input className="margin" type="text" name="name" value={this.state.name} onChange={this.handleChange} required></input>
                </div>
                <div className="row">
                  <label>Flight Topic(s): </label>
                  <input name="topics" value={this.state.topics} onChange={this.handleChange} required></input>
                </div>
                <div className="row">
                  <label>Choose Script: </label>
                  <select id="scripts" value={this.state.selectedScriptId} onChange={this.handleChange} name="selectedScriptId">
                    <option value="" className="defaultOption">Select a Script Here</option>
                    {scriptList.map(this.mappedSelectionScripts)}
                  </select>
                </div>
                <div className="align-right">
                  <button onSubmit={this.submitFlight}>Create</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Flights;
