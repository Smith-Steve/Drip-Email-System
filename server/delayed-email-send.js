const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./lib/error-middleware');
const db = require('./lib/database-config');
const handleEmail = require('./lib/handleEmail');

const app = express();
app.use(express.json());
app.use(staticMiddleware);
app.use(errorMiddleware);

const sqlEmailGetQuery = `select "f"."flightName" as "flightName", "s"."scriptName", "e"."subject", "e"."emailBody",
                            (select json_agg (json_build_object('firstName', "c"."firstName", 'lastName', "c"."lastName", 'company',"c"."company", 'email', "c"."email"))
                              from "contacts" as "c"
                              inner join "flightAssignments" as "fa" on "c"."contactId" = "fa"."contactId"
                              )
                            from "flightAssignments" as "fA"
                            join "contacts" as "c" on "fA"."contactId" = "c"."contactId"
                            inner join "flights" as "f" on "fA"."flightId" = "f"."flightId"
                            inner join "scripts" as "s" on "f"."scriptId" = "s"."scriptId"
                            inner join "emails" as "e" on "s"."scriptId" = "e"."scriptId"
                            where "e"."sendOn" > now()`;
db.query(sqlEmailGetQuery)
  .then(result => {
    const flightInfo = result.rows[0];
    handleEmail(flightInfo);
  }).catch(error => {
    console.error(error);
  });
