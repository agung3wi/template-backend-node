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

exports.up = async function(db) {
    await db.createTable('roles', {
        id: { type: 'bigint', primaryKey: true, autoIncrement: true },
        role_code: {
            type: 'string',
            unique: true,
            length: 30
        },
        role_name: {
            type: 'string',
            length: 100
        },
        role_description: {
            type: 'string',
            length: 200
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