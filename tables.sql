-- registrations table
Create table user_reg(
code text not null primary key,
firstname text not null,
lastname text not null,
email text not null
);

-- table that would add more category 
Create table categories(
    id serial primary key, 
    category_name text not null
);