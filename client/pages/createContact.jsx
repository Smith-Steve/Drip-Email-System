import React from 'react';

class CreateContact extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { userInput: '' };
  }

  handleChange(event) {
    this.setState({ userInput: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <form>
        <label>
          First Name:
          <input type="text" value={this.state.userInput} onChange={this.handleChange}/>
          <button onSubmit={this.handleSubmit}>Submit</button>
        </label>
      </form>
    );
  }
}

export default CreateContact;
