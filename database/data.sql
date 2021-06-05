insert into "contacts" ("firstName", "lastName", "company", "email", "phoneNumber")
values ('Jeff', 'Lewis', 'Travel Co', 'Steve.A.Dore@outlook.com', '7038914575');

insert into "scripts" ("scriptName")
values ('May BBM Script #1');

insert into "flights" ("flightName", "topics", "scriptId")
values ('May BBM flight #1', 'Nice', 1);

insert into "emails" ("subject", "emailBody", "scriptId")
values ('Data Update', 'Hello Blank, hope you are doing well. Sounds like you are having a great day today.', 1);

insert into "flightAssignments" ("flightId", "contactId")
values (1, 1);
