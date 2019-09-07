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
    await db.insert('tasks', ['id', 'task_name', 'task_group', 'task_description', 'created_by', 'updated_by', 'updated_at', 'created_at', 'version'], [-1, 'admin', 'admin', 'Admin', -1, -1, '20190821130000', '20190821130000', 1]);
    await db.insert('role_task', ['task_id', 'role_id'], [-1, -1]);

};

exports.down = function(db) {
    return null;
};

exports._meta = {
    "version": 1
};