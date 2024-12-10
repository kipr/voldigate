import PouchDB from 'pouchdb';

//const COUCHDB_HOST = process.env.COUSHDB_HOST || 'http://127.0.0.1:5984';   //Uncomment for PRODUCTION

const COUCHDB_HOST ='http://127.0.0.1:5984'; //Uncomment for DEVELOPMENT
console.log('COUCHDB_HOST:', COUCHDB_HOST);

export const db = new PouchDB(`${COUCHDB_HOST}`, {
  auth: {
    username: "admin", 
    password: "botball", 
  },
});

export const userDB = new PouchDB(`${COUCHDB_HOST}/wombat_users`, {
  auth: {
    username: "admin",
    password: "botball",
  },
});



