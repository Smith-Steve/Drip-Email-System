require('dotenv/config');
const db = require('./lib/database-config');
const handleEmail = require('./lib/handleEmail');

const sqlEmailGetQuery = `select DISTINCT on ("e"."emailId") "f"."flightName" as "flightName", "e"."emailId" as "emailId", "s"."scriptName", "e"."subject", "e"."emailBody",
                            (select json_agg (json_build_object('firstName', "c"."firstName", 'lastName', "c"."lastName", 'company',"c"."company", 'email', "c"."email"))
                              from "contacts" as "c"
                              inner join "flightAssignments" as "fas" on "c"."contactId" = "fas"."contactId"
                              )
                            from "flightAssignments" as "fA"
                            join "contacts" as "c" on "fA"."contactId" = "c"."contactId"
                            inner join "flights" as "f" on "fA"."flightId" = "f"."flightId"
                            inner join "scripts" as "s" on "f"."scriptId" = "s"."scriptId"
                            inner join "emails" as "e" on "s"."scriptId" = "e"."scriptId"
                            where "e"."sendOn" is NOT NULL and "e"."sendOn" < now() and "e"."sentAt" is NULL`;

db.query(sqlEmailGetQuery)
  .then(result => {
    const flightInfo = result.rows[0];
    handleEmail(flightInfo);
    module.flightInformation = flightInfo;
  })
  .then(() => {
    const sqlSentOnUpdate = `update "emails"
                        set "sentAt" = now()
                        where "emailId" = $1`;
    const param = [module.flightInformation.emailId];
    db.query(sqlSentOnUpdate, param)
      .catch(err => {
        console.error(err);
      });
  })
  .catch(error => {
    console.error(error);
  });
