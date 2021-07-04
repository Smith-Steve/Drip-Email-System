require('dotenv/config');
const express = require('express');
const nodemailer = require('nodemailer');
const pg = require('pg');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const handleText = require('./textCreator');

const app = express();
app.use(express.json());

app.use(staticMiddleware);

app.use(errorMiddleware);

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/api/emails/:scriptId', (request, response) => {
  response.send(request);
  const scriptId = parseInt(request.params.scriptId, 10);
  const sqlGetEmailsQuery = 'select * from "emails" where "scriptId" = $1';
  const dbParam = [scriptId];
  db.query(sqlGetEmailsQuery, dbParam)
    .then(result => {
      const emails = result.rows;
      response.status(201).json(emails);
    }).catch(error => {
      console.error(error);
      response.status(500).json({ error: 'an unexpected error occured.' });
    });
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

app.get('/api/contacts', (req, res) => {
  const sqlGetQuery = 'select * from "contacts" order by "firstName" desc;';
  db.query(sqlGetQuery)
    .then(result => {
      const contacts = result.rows;
      res.status(200).json(contacts);
    }).catch(error => {
      console.error(error);
      res.status(500).json({ error: 'an unexpected error occurred.' });
    });
});

app.get('/api/contacts/flightAssignment/:flightId', (request, response) => {
  const flightId = parseInt(request.params.flightId, 10);
  if (!Number.isInteger(flightId) || flightId <= 0) {
    throw new ClientError('400', 'must enter legitimate flight');
  }
  const sqlGetQuery = `select *
                      from "contacts" as "c"
                      join "flightAssignments" as "fa" using("contactId")
                      where "c"."contactId" = "fa"."contactId" and "fa"."flightId" = $1`;

  const getContactFlightAssigmentQueryParameters = [flightId];
  db.query(sqlGetQuery, getContactFlightAssigmentQueryParameters)
    .then(result => {
      const contacts = result.rows;
      response.status(200).json(contacts);
    }).catch(error => {
      console.error(error);
      response.status(500).json({ error: 'an unexpected error occurred.' });
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

app.get('/api/scripts', (requests, response) => {
  const sqlGetAllScriptsQuery = 'select * from "scripts" order by "scriptName" desc;';
  db.query(sqlGetAllScriptsQuery)
    .then(result => {
      const scripts = result.rows;
      response.status(200).json(scripts);
    }).catch(error => {
      console.error(error);
      response.status(500).json({ error: 'an unexpected error occured.' });
    });
});

app.get('/api/flights', (request, response) => {
  const sqlGetQuery = 'select * from "flights" order by "flightName" desc;';
  db.query(sqlGetQuery)
    .then(result => {
      const flights = result.rows;
      response.status(200).json(flights);
    }).catch(error => {
      console.error(error);
      response.status(500).json({ error: 'an unexpected error occurred.' });
    });
});

app.get('/api/scripts/:scriptId', (req, res, next) => {
  const scriptId = parseInt(req.params.scriptId, 10);
  if (!Number.isInteger(scriptId) || scriptId <= 0) {
    throw new ClientError('400', 'Invalid Script.');
  }
  const sqlGetQuery = 'select * from "scripts" where "scriptId" = $1';
  const params = [scriptId];
  db.query(sqlGetQuery, params)
    .then(result => {
      const script = result.rows[0];
      res.status(200).json(script);
    }).catch(error => {
      console.error(error);
      res.status(500).json({ error: 'an unexpected error occurred.' });
    });
});

app.post('/api/flights/:scriptId', (request, response) => {
  const { flightName, topics } = request.body;
  const scriptId = parseInt(request.params.scriptId, 10);

  if (!Number.isInteger(scriptId) || scriptId <= 0) {
    throw new ClientError('400', 'Invalid Script.');
  }

  const sqlPostFlightsInsert = 'insert into "flights" ("flightName", "topics", "scriptId") values ($1, $2, $3) returning*;';
  const sqlPostFlightsParams = [flightName, topics, scriptId];
  db.query(sqlPostFlightsInsert, sqlPostFlightsParams)
    .then(result => {
      const flight = result.rows[0];
      response.status(201).json(flight);
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: 'please review entered parameters and try again.' });
    });
});

app.post('/api/emails', (request, response) => {
  const { subject, emailBody } = request.body;
  const scriptId = parseInt(request.body.scriptId, 10);

  if (!Number.isInteger(scriptId) || scriptId <= 0) {
    throw new ClientError('400', 'Invalid Script.');
  }

  const sqlPostEmailsInsert = 'insert into "emails" ("subject", "emailBody", "scriptId") values ($1, $2, $3) returning*;';
  const sqlPostEmailsParams = [subject, emailBody, scriptId];
  db.query(sqlPostEmailsInsert, sqlPostEmailsParams)
    .then(result => {
      const flight = result.rows[0];
      response.status(201).json(flight);
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: 'please review entered parameters and try again. ' });
    });
});

app.get('/api/scripts/:scriptId', (req, res, next) => {
  const scriptId = parseInt(req.params.scriptId, 10);
  if (!Number.isInteger(scriptId) || scriptId <= 0) {
    throw new ClientError('400', 'Invalid Script.');
  }
  const sqlGetQuery = 'select * from "scripts" where "scriptId" = $1';
  const params = [scriptId];
  db.query(sqlGetQuery, params)
    .then(result => {
      const script = result.rows[0];
      res.status(200).json(script);
    }).catch(error => {
      console.error(error);
      res.status(500).json({ error: 'an unexpected error occurred.' });
    });
});

app.post('/api/flightAssignments', (request, response) => {
  const { flightId, contactId } = request.body;

  const sqlPostEmailsInsert = 'insert into "flightAssignments" ("flightId", "contactId") values ($1, $2) returning*;';
  const sqlPostEmailsParams = [flightId, contactId];
  db.query(sqlPostEmailsInsert, sqlPostEmailsParams)
    .then(result => {
      const flight = result.rows[0];
      response.status(201).json(flight);
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: 'please review entered parameters and try again. ' });
    });
});

const transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtp-mail.outlook.com',
  secureConnection: false,
  maxConnections: 1,
  port: 587,
  secure: false,
  tls: { ciphers: 'SSLv3' },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.get('/api/email/:flightId', (request, response) => {
  const flightId = parseInt(request.params.flightId, 10);
  const sqlEmailGetQuery = `select DISTINCT on ("f"."flightId") "f"."flightName" as "flightName", "s"."scriptName", "e"."subject", "e"."emailBody",
                            (select json_agg (json_build_object('firstName', "c"."firstName", 'lastName', "c"."lastName", 'company',"c"."company", 'email', "c"."email"))
                              from "contacts" as "c"
                              inner join "flightAssignments" as "fa" on "c"."contactId" = "fa"."contactId"
                              where "fa"."flightId" = $1)
                            from "flightAssignments" as "fA"
                            join "contacts" as "c" on "fA"."contactId" = "c"."contactId"
                            inner join "flights" as "f" on "fA"."flightId" = "f"."flightId"
                            inner join "scripts" as "s" on "f"."scriptId" = "s"."scriptId"
                            inner join "emails" as "e" on "s"."scriptId" = "e"."scriptId"
                            where "f"."flightId" = "fA"."flightId" and "fA"."flightId" = $1`;
  const param = [flightId];
  db.query(sqlEmailGetQuery, param)
    .then(result => {
      const flightInfo = result.rows[0];
      handleEmail(flightInfo);
    }).catch(error => {
      console.error(error);
      response.status(500).json({ error: 'an unexpected error occured.' });
    });
});

async function handleEmail(flightInfo) {
  const contactList = flightInfo.json_agg;
  for (let i = 0; i < contactList.length; i++) {
    const contact = contactList[i];
    const messageBody = handleText(flightInfo, contact);
    const msg = {
      from: process.env.EMAIL_USER,
      to: contact.email,
      subject: flightInfo.subject,
      text: messageBody
    };
    await transporter.sendMail(msg).catch(error => {
      console.error(error);
    });
  }
}

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
