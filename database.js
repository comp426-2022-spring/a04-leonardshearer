"use strict"

import Database from 'better-sqlite3/lib/database.js';

const db = new Database('log.db')

const isInitialized = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`)

if (isInitialized.get() === undefined) {
    const sql = `
        CREATE TABLE accesslog ( 
            id INTEGER PRIMARY KEY, remoteaddr STRING, remoteuser STRING,
            time STRING, method STRING, url STRING, protocol STRING,
            httpversion STRING, status INTEGER, referer STRING, useragent STRING
        );
    `
    db.exec(sql)
    console.log('Database created.')
} else {
    console.log('Database found.')
}

export function getDb() {
    return db
}