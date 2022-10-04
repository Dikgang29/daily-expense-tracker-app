create database tracker_app;
create role tracker_admin login password 'tracker123';
grant all privileges on database tracker_app to tracker_admin;


-- // hopefully will use this tabe
create database expense_tracker;
create role tracker login password 'tracker123';
grant all privileges on database expense_tracker to tracker;




GRANT ALL PRIVILEGES on SEQUENCES registrations_id_seq TO tracker;
