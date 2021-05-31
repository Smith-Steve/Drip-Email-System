import React from 'react';

class Scripts extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { scriptName: '' };
  }

  handleChange = event => this.setState({ scriptName: event.target.value });

  clearForm = () => this.setState({ scriptName: '' })

  handleSubmit(event) {
    event.preventDefault();
    const initMethod = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.state) };
    fetch('/api/scripts', initMethod)
      .then(response => response.json())
      .then(returnedResponse => {
        if (returnedResponse) {
          alert('Script Submitted');
          this.clearForm();
        } else {
          alert('Not submitted.');
        }
      });
  }

  render() {
    return (
      <div className="scripts">
        <div className="row">
          <div className="col">
            <span className="specialText">Script E-mail Chain Set Up:</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-container lg">
              <form onSubmit={this.handleSubmit} className="scripts">
                <div>
                  <label>Script Chain Name:</label>
                </div>
                <div className="scriptInputContainer">
                  <input className="scriptInputField" type="text" name="scriptName" value={this.state.scriptName} onChange={this.handleChange} required/>
                </div>
                <div className="align-right">
                  <button className="scripts" onSubmit={this.handleSubmit}>Create Script</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Scripts;
