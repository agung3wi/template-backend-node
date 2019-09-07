'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function(db) {
    return db.createTable('users', {
        id: { type: 'bigint', primaryKey: true, autoIncrement: true },
        username: {
            type: 'string',
            unique: true,
            length: 25
        },
        email: {
            type: 'string',
            length: 200,
            unique: true
        },
        full_name: {
            type: 'string',
            length: 200
        },
        role_id: {
            type: 'bigint',
            default: -1,
        },
        password: {
            type: 'string',
            length: 255,
        },
        created_by: {
            type: 'bigint'
        },
        updated_by: {
            type: 'bigint'
        },
        created_at: {
            type: 'string',
            length: 26,
        },
        updated_at: {
            type: 'string',
            length: 26,
        },
        version: {
            type: 'bigint'
        },
    });
};

exports.down = function(db) {
    return null;
};

exports._meta = {
    "version": 1
};