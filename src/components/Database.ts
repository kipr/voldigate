import PouchDB from 'pouchdb';

export const db = new PouchDB('http://admin:botball@localhost:5984');

export const userDB = new PouchDB('http://admin:botball@localhost:5984/wombat_users');


