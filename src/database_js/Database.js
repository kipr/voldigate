"use strict";
exports.__esModule = true;
exports.userDB = exports.db = void 0;
const PouchDB = require('pouchdb').default || require('pouchdb');


//const COUCHDB_HOST = process.env.COUSHDB_HOST || 'http://127.0.0.1:5984'; // Uncomment for PRODUCTION
const COUCHDB_HOST = 'http://127.0.0.1:5984'; // Uncomment for DEVELOPMENT


console.log('COUCHDB_HOST:', COUCHDB_HOST);

exports.db = new PouchDB(`${COUCHDB_HOST}`, {
  auth: {
    username: "admin", 
    password: "botball", 
  },
});
exports.userDB = new PouchDB(`${COUCHDB_HOST}/wombat_users`, {
  auth: {
    username: "admin",
    password: "botball",
  },
});
