import React from 'react';

class ManageFlight extends React.Component {

  render() {
    return (
      <div className="flights">
        <div className="row">
          <div className="col">
            <span className="specialText">Managing Flight - </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-container lg">
              <form>
                <div className="row">
                  <label>Add Contact:</label>
                  <input className="margin" type="text" name="contact" required></input>
                </div>
                <div className="align-right">
                  <button >Add Contact</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageFlight;
