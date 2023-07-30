import sqlite3 from "sqlite3";
import connect, { sql } from '@databases/sqlite';
sqlite3.verbose()

const source = "db.sqlite";
const dbLite = connect('./db.sqlite');

const db_system = new sqlite3.Database(source, (err) => {
    if (err) {
        console.log(err.message);
        throw err;
    } else {
        // console.log("Database connected");
    }
});

export { db_system };
