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
    await db.createTable('api_token', {
        user_id: {
            type: 'bigint'
        },
        api_token: {
            type: 'string',
            length: 50
        }
    });
    await db.addIndex('api_token', 'user_api_token_key', ['api_token', 'user_id']);
};

exports.down = function(db) {
    return null;
};

exports._meta = {
    "version": 1
};