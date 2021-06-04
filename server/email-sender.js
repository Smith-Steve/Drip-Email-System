'user strict';
// const nodemailer = require('nodemailer');
const pg = require('pg');
const express = require('express');
// const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');

const app = express();
app.use(express.use());
app.use(errorMiddleware);
app.use(staticMiddleware);

const database = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  SSL: { rejectUnauthorized: false }
});

app.get('/api/email/:scriptId', (request, response) => {
  const flightId = parseInt(response.body.flightId, 10);
  const sqlEmailGetQuery = 'select * from "emails" where "scriptId" = $1';
  const param = [flightId];
  database.query(sqlEmailGetQuery, param)
    .then(result => {
      const email = result.body;
      response.status(200).json(email);
    }).catch(error => {
      console.error(error);
      response.status(500).json({ error: 'an unexpected error occured.' });
    });
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
