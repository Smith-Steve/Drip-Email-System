insert into "contacts" ("firstName", "lastName", "company", "email", "phoneNumber")
values ('Jeff', 'Lewis', 'Travel Co', 'Steve.A.Dore@outlook.com', '7038914575'), ('Alexandre', 'Dumas', 'Ainsworths Magazine', 'AlexandreDumas@dispostable.com', '2154981116'),
('Thomas', 'Bill', 'Pinkerton Security', 'ThomasBill@dispostable.com', '2154981116'), ('Billy', 'Slick', 'Dispostable', 'BillySlick@dispostable.com', '2154981116');

insert into "scripts" ("scriptName")
values ('May BBM Script #1');

insert into "flights" ("flightName", "topics", "scriptId")
values ('May BBM flight #1', 'Nice', 1);

insert into "emails" ("subject", "emailBody", "scriptId")
values ('Penn Testing', 'Hello {{PersonName}}, Hope you are doing well. We are offering some new penn testing services. We feel this is a great opportunity for you and you all over at {{Company}} to have your software reviewed by some quality consultants.', 1);

insert into "flightAssignments" ("flightId", "contactId")
values (1, 1);
