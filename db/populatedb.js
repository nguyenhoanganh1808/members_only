// #! /usr/bin/env node
require("dotenv").config();

const { Client } = require("pg");

const SQL = `
CREATE TABLE users (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, first_name VARCHAR(100), last_name VARCHAR(100), username VARCHAR(255) NOT NULL UNIQUE, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255), membership_status BOOLEAN);

CREATE TABLE posts (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, title TEXT, timestamp DATE, content TEXT, creator_id INT, FOREIGN KEY(creator_id) REFERENCES users(id));

INSERT INTO posts (title, content, creator_id) VALUES
('Welcome to the Clubhouse', 'This is the first post in our exclusive clubhouse!', 1),
('An Interesting Day', 'Today was full of unexpected events and surprises.', 1);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DB_URI,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
