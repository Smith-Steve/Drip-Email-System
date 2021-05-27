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
  primary key ("contactId")
);

create table "scripts" (
  "scriptId" serial,
  "scriptName" text not null,
  primary key ("scriptId")
)
