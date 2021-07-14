set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "contacts" (
  "contactId" serial,
  "firstName" text      not null,
  "lastName" text       not null,
  "company" text        not null,
  "email" text          not null,
  "phoneNumber" text    not null,
  "createdAt" timestamptz(5) not null default now(),
  primary key ("contactId")
);

create table "scripts" (
  "scriptId" serial,
  "scriptName" text not null,
  primary key ("scriptId")
);

create table "flights" (
  "flightId" serial,
  "flightName" text not null,
  "topics" text not null,
  "scriptId" INT not null,
  "createdAt" timestamptz(5) not null default now(),
  primary key ("flightId"),
  constraint "scriptId"
   foreign key ("scriptId")
   references "scripts"("scriptId")
);

create table "emails" (
  "emailId" serial,
  "subject" text not null,
  "emailBody" text not null,
  "scriptId" INT not null,
  "emailNumberInSequence" INT default 1,
  "sendOn" timestamp with time zone,
  "createdAt" timestamptz(5) not null default now(),
  primary key ("emailId"),
  constraint "scriptId"
   foreign key ("scriptId")
   references "scripts"("scriptId")
);

create table "flightAssignments" (
  "flightId" int not null,
  "contactId" INT not null,
  unique("contactId", "flightId"),
  constraint "flightId"
   foreign key ("flightId")
   references "flights"("flightId"),
  constraint "contactId"
   foreign key ("contactId")
   references "contacts"("contactId")
)

