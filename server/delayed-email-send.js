const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./lib/error-middleware');
const textCreator = require('./lib/textCreator');
const db = require('./lib/database-config');

const app = express();
app.use(express.json());
app.use(staticMiddleware);
app.use(errorMiddleware);

app.get('/api/email/:flightId', (request, response) => {
  const flightId = parseInt(request.params.flightId, 10);
  const sqlEmailGetQuery = `select "f"."flightName" as "flightName", "s"."scriptName", "e"."subject", "e"."emailBody",
                            (select json_agg (json_build_object('firstName', "c"."firstName", 'lastName', "c"."lastName", 'company',"c"."company", 'email', "c"."email"))
                              from "contacts" as "c"
                              inner join "flightAssignments" as "fa" on "c"."contactId" = "fa"."contactId"
                              where "fa"."flightId" = 1)
                            from "flightAssignments" as "fA"
                            join "contacts" as "c" on "fA"."contactId" = "c"."contactId"
                            inner join "flights" as "f" on "fA"."flightId" = "f"."flightId"
                            inner join "scripts" as "s" on "f"."scriptId" = "s"."scriptId"
                            inner join "emails" as "e" on "s"."scriptId" = "e"."scriptId"
                            where "e"."sendOn" > now()`;
  const param = [flightId];
  db.query(sqlEmailGetQuery, param)
    .then(result => {
      const flightInfo = result.rows[0];
      textCreator(flightInfo);
    }).catch(error => {
      console.error(error);
      response.status(500).json({ error: 'an unexpected error occured.' });
    });
});