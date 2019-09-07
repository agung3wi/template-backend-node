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
    await db.insert('roles', ['id', 'role_code', 'role_name', 'role_description', 'created_by', 'updated_by', 'updated_at', 'created_at', 'version'], [-1, 'super-admin', 'Super Admin', 'Super Admin', -1, -1, '20190821130000', '20190821130000', 1]);
    await db.runSql("INSERT INTO users VALUES (1, 'admin', 'admin@localhost', 'Super Admin', -1, '$2a$10$B0YjbDD7goDzcWy.Gvn7AuiB8RqkEuCmyIN4bD7Gxrr97TZXLt/DS', -1, -1, '20190821130000', '20190821130000', 1)");
};

exports.down = function(db) {
    return null;
};

exports._meta = {
    "version": 1
};