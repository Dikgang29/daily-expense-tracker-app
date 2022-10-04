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

-- table that would store the expense dor a certain day
Create table expenses(
    id serial primary key,
    code_id VARCHAR ( 50 ) not null,
    category_id integer,
    expense_date date not null default current_date,
    daily_expense decimal(5,2),
    FOREIGN KEY (code_id) REFERENCES user_reg(code),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);