require('dotenv/config');
const express = require('express');
const pg = require('pg');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');

const app = express();
app.use(express.json());

app.use(staticMiddleware);

app.use(errorMiddleware);

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.post('/api/contacts', (req, res, next) => {
  const { firstName, lastName, company, email, phoneNumber } = req.body;
  if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof company !== 'string' || typeof phoneNumber !== 'string') {
    throw new ClientError('400', 'please enter text for all fields');
  }
  if (!firstName || !lastName || !company || !email || !phoneNumber) {
    throw new ClientError('400', 'all fields are required in order to register a user.');
  }
  const sqlPostContactsQuery = `insert into "contacts"
                        ("firstName", "lastName", "company", "email", "phoneNumber")
                        values ($1, $2, $3, $4, $5)
                        returning*;`;
  const sqlPostContactsParams = [firstName, lastName, company, email, phoneNumber];
  db.query(sqlPostContactsQuery, sqlPostContactsParams)
    .then(result => {
      const contact = result.rows[0];
      res.status(201).json(contact);
    }).catch(error => {
      console.error(error);
      res.status(500).json({ error: 'please see the entered parameters and try again.' });
    });
});
app.post('/api/scripts', (requests, response, next) => {
  const { scriptName } = requests.body;
  if (typeof scriptName !== 'string' || !scriptName) throw new ClientError('400', 'invalid input');
  const sqlPostScriptsInsert = `insert into "scripts"
                                ("scriptName")
                                values ($1)
                                returning*;`;
  const sqlPostScriptsParams = [scriptName];
  db.query(sqlPostScriptsInsert, sqlPostScriptsParams)
    .then(result => {
      const script = result.rows[0];
      response.status(201).json(script);
    }).catch(error => {
      console.error(error);
      response.status(500).json({ error: 'please review entered parameters and try again.' });
    });
});

app.get('/api/contacts/:contactId', (req, res, next) => {
  const contactId = parseInt(req.params.contactId, 10);
  if (!Number.isInteger(contactId) || contactId <= 0) {
    throw new ClientError('400', 'must enter a legitimate contact.');
  }
  const sqlGetQuery = 'select * from "contacts" where "contactId" = $1';
  const params = [contactId];
  db.query(sqlGetQuery, params)
    .then(result => {
      const contact = result.rows[0];
      res.status(200).json(contact);
    }).catch(error => {
      console.error(error);
      res.status(500).json({ error: 'an unexpected error occurred.' });
    });
});

app.delete('/api/contacts/:contactId', (req, res, next) => {
  const contactId = parseInt(req.params.contactId, 10);
  if (!Number.isInteger(contactId) || contactId <= 0) {
    throw new ClientError('400', 'must enter a legitimate contact.');
  }
  const sqlDeleteQuery = 'delete from "contacts" where "contactId" = $1';
  const deleteParams = [contactId];
  db.query(sqlDeleteQuery, deleteParams)
    .then(result => {
      res.status(204).send();
    }).catch(error => {
      console.error(error);
      res.status(500).json({ error: 'an unexpected error occured.' });
    });
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
