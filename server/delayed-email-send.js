require('dotenv/config');
const db = require('./lib/database-config');
// const connectionString = 'postgres://dev:dev@localhost/dripEmailDataBase';
const handleEmail = require('./lib/handleEmail');

// const db = new pg.Pool({
//   connectionString: connectionString,
//   ssl: { rejectUnauthorized: false }
// });

// async function handleEmail2(flightInfo) {
//   const contactList = flightInfo.json_agg;
//   for (let i = 0; i < contactList.length; i++) {
//     const contact = contactList[i];
//     const messageBody = textCreator(flightInfo, contact);
//     const msg = {
//       from: process.env.EMAIL_USER,
//       to: contact.email,
//       subject: flightInfo.subject,
//       text: messageBody
//     };
//     await transporter.sendMail(msg).catch(error => {
//       console.error(error.code);
//     });
//   }
// }

// function textCreator(emailInfo, contact) {
//   const emailTextLines = emailInfo.emailBody.split('\n');
//   const emailArray = [];
//   for (let i = 0; i < emailTextLines.length; i++) {
//     const line = emailTextLines[i];
//     if (line.includes('{{PersonName}}')) {
//       const newLine = line.replace('{{PersonName}}', contact.firstName);
//       emailArray.push(newLine);
//     } else if (line.includes('')) {
//       const removedNonText = line.replace('', '\n');
//       emailArray.push(removedNonText);
//     } else {
//       emailArray.push(line);
//     }
//   }
//   const finalEmail = emailArray.join('');
//   return finalEmail;
// }

const sqlEmailGetQuery = `select DISTINCT on ("f"."flightId") "f"."flightName" as "flightName", "s"."scriptName", "e"."subject", "e"."emailBody",
                            (select json_agg (json_build_object('firstName', "c"."firstName", 'lastName', "c"."lastName", 'company',"c"."company", 'email', "c"."email"))
                              from "contacts" as "c"
                              inner join "flightAssignments" as "fas" on "c"."contactId" = "fas"."contactId"
                              )
                            from "flightAssignments" as "fA"
                            join "contacts" as "c" on "fA"."contactId" = "c"."contactId"
                            inner join "flights" as "f" on "fA"."flightId" = "f"."flightId"
                            inner join "scripts" as "s" on "f"."scriptId" = "s"."scriptId"
                            inner join "emails" as "e" on "s"."scriptId" = "e"."scriptId"
                            where "e"."sendOn" < now()`;

db.query(sqlEmailGetQuery)
  .then(result => {
    const flightInfo = result.rows[0];
    handleEmail(flightInfo);
  }).catch(error => {
    console.error(error);
  });
