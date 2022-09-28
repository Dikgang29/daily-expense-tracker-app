-- USER CREDENTIALS TABLE 
CREATE TABLE users
(
id serial not null primary key,
FirstName varchar(255),
LastName varchar(255),
EmailAdress varchar(255),
UserPassword varchar(255)
);