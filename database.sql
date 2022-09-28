create database tracker_app;
create role tracker_admin login password 'tracker123';
grant all privileges on database tracker_app to tracker_admin;