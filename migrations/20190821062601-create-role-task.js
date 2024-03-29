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
    await db.createTable('role_task', {
        role_id: { type: 'bigint' },
        task_id: { type: 'bigint' }
    });

    await db.addIndex('role_task', 'role_task_uk', ['role_id', 'task_id'], true);


};

exports.down = function(db) {
    return null;
};

exports._meta = {
    "version": 1
};