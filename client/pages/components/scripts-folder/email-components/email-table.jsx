import React from 'react';

function EmailTable({ emailList, scriptName }) {
  const emailRow = emailList.map(email => {
    return <tr key={email.emailId}><td key={email.emailId}> <span className="table-text">{scriptName}</span></td><td id={Math.floor(Math.random() * email.emailId)}><span className="table-text align-left">{email.subject}</span></td></tr>;
  });

  return (
    <React.Fragment>
    <div className="row">
        <div className="col">
          <div className="table-container rounded-corners lg">
            <table id="contact_list">
              <thead>
                <tr>
                  <th><span className="special-text align-left">Script Name</span></th>
                  <th><span className="special-text align-left">Email Subject </span></th>
                </tr>
              </thead>
              <tbody>
                {emailRow}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default EmailTable;
