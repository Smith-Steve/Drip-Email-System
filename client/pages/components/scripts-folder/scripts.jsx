import React from 'react';

class Scripts extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.buildTable = this.buildTable.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = { scriptName: '', selectedScript: null, scripts: [] };
  }

  componentDidMount() {
    this.getListOfScripts();
  }

  chosenScript(script) {
    this.props.setActiveScript(script);
    window.localStorage.setItem('Active-Script', JSON.stringify(script));
  }

  handleChange(event) {
    this.setState({ scriptName: event.target.value });
  }

  clearForm() {
    this.setState({ scriptName: '' });
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

  addScript(newScript) {
    this.setState(state => {
      const completeScriptList = [newScript, ...this.state.scripts];
      return {
        scripts: completeScriptList
      };
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const initMethod = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.state) };
    fetch('/api/scripts', initMethod)
      .then(response => response.json())
      .then(returnedResponse => {
        if (returnedResponse) {
          this.addScript(returnedResponse);
          alert('Script Submitted');
          this.clearForm();
        } else {
          alert('Not submitted.');
        }
      });
  }

  buildTable(scriptList) {
    const scriptRow = scriptList.map(script => {
      return <tr key={script.scriptId}><td key={script.scriptId}> <span className="table-text">{script.scriptName}</span></td><td id={script.scriptId + 2}><a href={`#Script/${script.scriptId}`} onClick={() => this.chosenScript(script)}><button className="manageScripts alignRight">Manage Script</button></a></td></tr>;
    });
    return (
      <div className="row">
        <div className="col">
          <div className="table-container lg">
            <table id="scripts_list">
              <thead>
                <tr>
                  <th><span className="special-text align-left">Script Name</span></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {scriptRow}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const scriptsList = [...this.state.scripts];
    return (
      <div className="scripts">
        <div className="row">
          <div className="col">
            <span className="special-text prompt">Script E-mail Chain Set Up:</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-container lg">
              <form onSubmit={this.handleSubmit}>
                <div className="input-row">
                  <label>Script Chain Name:</label>
                  <input className="scriptInputField" type="text" name="scriptName" value={this.state.scriptName} onChange={this.handleChange} required/>
                </div>
                <div className="align-right">
                  <button className="scripts purpleButton" onSubmit={this.handleSubmit}>Create Script</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {scriptsList.length > 0 ? this.buildTable(scriptsList) : null }
      </div>
    );
  }
}

export default Scripts;
