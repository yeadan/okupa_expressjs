CREATE TABLE IF NOT EXISTS okupas(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name text NOT NULL CHECK (name <>''),
    description text,
    created date NOT NULL
);

CREATE TABLE IF NOT EXISTS users(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    username text NOT NULL CHECK (username <>''),
    password text NOT NULL CHECK (password <>''),
    role text,
    full_name text,
    registered date NOT NULL,
);



