import sqlite3 from "sqlite3";
import connect, { sql } from '@databases/sqlite';

sqlite3.verbose()

const source = "db.sqlite";

const dbLite = connect('./db.sqlite');


const SQL_USER_CREATE = `
    CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName TEXT,
        birthdayDate TEXT,
        anniversaryDate TEXT,
        location TEXT,
        email TEXT
    )`;

const SQL_BIRTHDAY_CREATE = `
    CREATE TABLE birthdayStatus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        userEmail TEXT,
        birthdayDate TEXT,
        birthdayYear TEXT,
        birthdayStatus BOOLEAN CHECK (birthdayStatus IN (0, 1)) DEFAULT 0
    )`;

// const SQL_TRIGGER_UPDATEDATE = `
//     CREATE TRIGGER IF NOT EXISTS update_birthdayDate AFTER UPDATE ON user
//     BEGIN 
//         UPDATE birthdayStatus SET birthdayDate = new....
//     END;
//     `

// const SQL_Anniversary_CREATE = `
//     CREATE TABLE anniversaryStatus (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         userId INTEGER,
//         userEmail TEXT,
//         status BOOLEAN CHECK (status IN (0, 1))
//     )`;

const db_system = new sqlite3.Database(source, (err) => {
  if (err) {
    console.log(err.message);
    throw err;
  } else {
    console.log("Database connected");
  }
});

const db = new sqlite3.Database(source, (err) => {
  if (err) {
    console.log(err.message);
    throw err;
  } else {
    console.log("Database connected");


    db.run(SQL_BIRTHDAY_CREATE, (err) => {
      if (err) {
        console.log("Table birthdayStatus already exists");
      } else {
        console.log("Table birthdayStatus created successfully");
      }
    });

    // db.run(SQL_Anniversary_CREATE, (err) => {
    //   if (err) {
    //     console.log("Table anniversaryStatus already exists");
    //   } else {
    //     console.log("Table anniversaryStatus created successfully");
    //   }
    // });

    db.run(SQL_USER_CREATE, (err) => {
      if (err) {
        console.log("Table User already exists");
      } else {
        console.log("Table User created successfully");
      }
    });

  }
});



const databaseClear = async () => {
  db.serialize(function() {
    db.run("DELETE FROM user");
    db.run("DELETE FROM birthdayStatus");
  })
}




export { db, db_system, sql, dbLite, databaseClear };
