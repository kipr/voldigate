"use strict";
exports.__esModule = true;
exports.userDB = exports.db = void 0;
var pouchdb_1 = require("pouchdb");

const PouchDB = require('pouchdb');

exports.db = new PouchDB('http://admin:botball@localhost:5984');
exports.userDB = new PouchDB('http://admin:botball@localhost:5984/wombat_users');
// exports.db = new pouchdb_1["default"]('http://admin:botball@localhost:5984');
// exports.userDB = new pouchdb_1["default"]('http://admin:botball@localhost:5984/wombat_users');
