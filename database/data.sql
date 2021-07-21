insert into "contacts" ("firstName", "lastName", "company", "email", "phoneNumber")
values ('Jeff', 'Lewis', 'Travel Co', 'Steve.A.Dore@outlook.com', '7038914575'), ('Alexandre', 'Dumas', 'Ainsworths Magazine', 'AlexandreDumas@dispostable.com', '2154981116'),
('Thomas', 'Bill', 'Pinkerton Security', 'ThomasBill@dispostable.com', '2154981116'), ('Billy', 'Slick', 'Dispostable', 'BillySlick@dispostable.com', '2154981116');

insert into "scripts" ("scriptName")
values ('Script #1'),('Script #2');

insert into "flights" ("flightName", "topics", "scriptId")
values ('Flight #1', 'Nice', 1), ('Flight #2', 'Nice', 2);

insert into "emails" ("subject", "emailBody", "scriptId")
values ('Email #1', 'Hello {{PersonName}}, Hope you are doing well. We are offering some new penn testing services. We feel this is a great opportunity for you and you all over at {{Company}} to have your software reviewed by some quality consultants.', 1),
('Email #1', 'Hello {{PersonName}}, Email #1', 2);

insert into "flightAssignments" ("flightId", "contactId")
values (1, 1), (2, 2), (2, 3), (2, 4);
