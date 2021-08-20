require('dotenv/config');
const express = require('express');
const ClientError = require('./lib/client-error');
const errorMiddleware = require('./lib/error-middleware');
const db = require('./lib/database-config');
const staticMiddleware = require('./static-middleware');
const handleEmail = require('./lib/handleEmail');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const app = express();
const jsonMiddleWare = express.json();
app.use(jsonMiddleWare);
app.use(staticMiddleware);
app.use(errorMiddleware);

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
  const sqlGetQuery = `select * from "contacts"
                       where "contactId" = $1`;
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
  const sqlGetQuery = `select * from "contacts"
                       order by "firstName" desc;`;
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
  const sqlGetQuery = `select * from "contacts" as "c"
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
  const sqlDeleteQuery = `delete from "contacts"
                           where "contactId" = $1`;
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
  const sqlGetAllScriptsQuery = `select * from "scripts"
                                 order by "scriptName" desc;`;
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
  const sqlGetQuery = `select * from "flights"
                       order by "flightName" desc;`;
  db.query(sqlGetQuery)
    .then(result => {
      const flights = result.rows;
      response.status(200).json(flights);
    }).catch(error => {
      console.error(error);
      response.status(500).json({ error: 'an unexpected error occurred.' });
    });
});

app.post('/api/flights/:scriptId', (request, response) => {
  const { flightName, topics } = request.body;
  const scriptId = parseInt(request.params.scriptId, 10);

  if (!Number.isInteger(scriptId) || scriptId <= 0) {
    throw new ClientError('400', 'Invalid Script.');
  }

  const sqlPostFlightsInsert = `insert into "flights" ("flightName", "topics", "scriptId")
                                 values ($1, $2, $3) returning*;`;
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

app.get('/api/scripts/:scriptId', (req, res, next) => {
  const scriptId = parseInt(req.params.scriptId, 10);
  if (!Number.isInteger(scriptId) || scriptId <= 0) {
    throw new ClientError('400', 'Invalid Script.');
  }
  const sqlGetQuery = `select * from "scripts"
                       where "scriptId" = $1`;
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

app.post('/api/emails', (request, response) => {
  const { subject, emailBody, emailNumberInSequence, sendOn } = request.body;
  const scriptId = parseInt(request.body.scriptId, 10);

  if (!Number.isInteger(scriptId) || scriptId <= 0) {
    throw new ClientError('400', 'Invalid Script.');
  }

  const sqlPostEmailsInsert = `insert into "emails" ("subject", "emailBody", "scriptId", "emailNumberInSequence", "sendOn")
                               values ($1, $2, $3, $4, $5) returning*;`;
  const sqlPostEmailsParams = [subject, emailBody, scriptId, emailNumberInSequence, sendOn];
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
  const sqlGetQuery = `select * from "scripts"
                       where "scriptId" = $1`;
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

  const sqlPostEmailsInsert = `insert into "flightAssignments" ("flightId", "contactId")
                               values ($1, $2) returning*;`;
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

app.delete('/api/flightAssignments/:flightId', (request, response) => {
  const flightId = parseInt(request.params.flightId, 10);
  const { contactId } = request.body;
  if ((!Number.isInteger(contactId) || contactId <= 0) && (!Number.isInteger(flightId) || flightId <= 0)) {
    throw new ClientError('400', 'Invalid Flight');
  }
  const sqlDelete = `delete from "flightAssignments"
                    where "contactId" = $1 and "flightId" = $2`;
  const sqlParameters = [contactId, flightId];
  db.query(sqlDelete, sqlParameters)
    .then(result => {
      const [reducedFlightNo] = result.rows;
      response.status(204).json(reducedFlightNo);
    }).catch(error => {
      console.error(error);
      response.status(500).json({ error: 'please review entered parameters and try again. ' });
    });
});

app.get('/api/email/:flightId', (request, response) => {
  const flightId = parseInt(request.params.flightId, 10);
  if (!Number.isInteger(flightId) || flightId <= 0) {
    throw new ClientError('400', 'Invalid flight');
  }
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
                            where "f"."flightId" = "fA"."flightId" and "fA"."flightId" = $1 and "e"."sendOn" is NULL`;
  const param = [flightId];
  db.query(sqlEmailGetQuery, param)
    .then(result => {
      const flightInfo = result.rows[0];
      handleEmail(flightInfo);// be careful where youu group functaionality together.
      module.FlightUpdateInfo = flightInfo;
    }).then(() => {
      const flightId = parseInt(request.params.flightId, 10);
      if (!Number.isInteger(flightId) || flightId <= 0) {
        throw new ClientError('400', 'Invalid flight');
      }
      const sqlFlightLaunchedOnUpdate = `update "flights"
                                         set "sentOn" = now(), "flightActive" = true, "flightComplete" = false
                                         where "flightId" = $1`;
      const param = [flightId];
      db.query(sqlFlightLaunchedOnUpdate, param)
        .catch(err => {
          console.error(err);
        });
    }).catch(error => {
      console.error(error);
      response.status(500).json({ error: 'an unexpected error occured.' });
    });
});

app.get('/api/emails/:scriptId', (req, res, next) => {
  const scriptId = parseInt(req.params.scriptId, 10);
  if (!Number.isInteger(scriptId) || scriptId <= 0) {
    throw new ClientError('400', 'Invalid Script.');
  }
  const sqlGetQuery = `select * from "emails"
                        where "scriptId" = $1
                        order by "createdAt" asc`;
  const params = [scriptId];
  db.query(sqlGetQuery, params)
    .then(result => {
      const emails = result.rows;
      res.status(200).json(emails);
    }).catch(error => {
      console.error(error);
      res.status(500).json({ error: 'an unexpected error occurred.' });
    });
});

app.get('/api/scripts/count/:scriptId', (request, response) => {
  const scriptId = parseInt(request.params.scriptId, 10);
  if (!Number.isInteger(scriptId) || scriptId <= 0) {
    throw new ClientError('400', 'Invalid Script');
  }
  const sqlGetScriptEmailCount = `select COUNT ("emailId")
                                  from "emails"
                                  where "scriptId" = $1`;
  const params = [scriptId];
  db.query(sqlGetScriptEmailCount, params)
    .then(result => {
      response.status(200).json(result.rows[0]);
    }).catch(error => {
      console.error(error);
      response.status(500).json({ error: 'an unexpected error occurred.' });
    });
});

// sign-up.

app.post('/api/authorization/sign-up', (request, response, next) => {
  const { userName, userEmail, password } = request.body;
  if (!userName || !userEmail || !password) {
    throw new ClientError(400, 'username, email and password are required.');
  }

  argon2
    .hash(password)
    .then(hashedPassword => {
      const sqlInsertUser = `insert into "users"("userName", "userEmail", "hashedPassword")
                              values ($1, $2, $3)
                              returning "userName", "userEmail", "hashedPassword"`;
      const parameters = [userName, userEmail, hashedPassword];
      return db.query(sqlInsertUser, parameters);
    })
    .then(result => {
      const [user] = result.rows;
      response.status(201).json(user);
    }).catch(err => next(err));
});

app.post('/api/authorization/sign-in', (request, response, next) => {
  const { username, password } = request.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }

  const sqlGet = 'select "userId", "hashedPassword" from "users" where "username" = $1';
  const sqlGetParams = [username];
  db.query(sqlGet, sqlGetParams)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'cannot find username.');
      } else {
        const { userId, hashedPassword } = user;
        argon2
          .verify(hashedPassword, password)
          .then(isMatching => {
            if (!isMatching) {
              throw new ClientError(401, 'invalid login');
            }
            const payload = { userId, username };
            const token = jwt.sign(payload, process.env.TOKEN_SECRET);
            response.json({ token, user: payload });
          })
          .catch(err => next(err));
      }
    });
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
