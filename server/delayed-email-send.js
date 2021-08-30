require('dotenv/config');
const db = require('./lib/database-config');
const handleEmail = require('./lib/handle-email');

const sqlEmailGetQuery = `select DISTINCT on ("e"."emailId") "f"."flightName" as "flightName", "e"."emailId" as "emailId", "s"."scriptName", "e"."subject", "e"."emailBody", "e"."scriptId",
                            (select json_agg (json_build_object('firstName', "c"."firstName", 'lastName', "c"."lastName", 'company',"c"."company", 'email', "c"."email"))
                              from "contacts" as "c"
                              inner join "flightAssignments" as "fas" on "c"."contactId" = "fas"."contactId"
                              )
                            from "flightAssignments" as "fA"
                            join "contacts" as "c" on "fA"."contactId" = "c"."contactId"
                            inner join "flights" as "f" on "fA"."flightId" = "f"."flightId"
                            inner join "scripts" as "s" on "f"."scriptId" = "s"."scriptId"
                            inner join "emails" as "e" on "s"."scriptId" = "e"."scriptId"
                            where "e"."sendOn" > now() and "e"."sendOn" is NOT NULL and "e"."sentAt" is Null and "f"."flightComplete" = false`;

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
  }).then(() => {
    const sqlFlightCompleteQuery = `select count ("scriptId" = $1) as "Number of Scripts", count ("sentAt" is null) as "Number of Emails Not Sent",
                                    CASE WHEN count("sentAt") = 0 then true
                                  else false end
                                  as "flightComplete"
                                  from "emails"
                                  where "scriptId" = $1`;
    const param = [module.flightInformation.scriptId];
    db.query(sqlFlightCompleteQuery, param)
      .then(result => {
        // console.log(result);
      })
      .catch(err => {
        console.error(err);
      });
  })
  .catch(error => {
    console.error(error);
  });
