const { db, CoreService, CoreException } = require('../../util/CallService')

const bcrypt = require('bcryptjs')
var sha1 = require('sha1')
var jwt = require('jsonwebtoken')
var microtime = require('microtime')

/**
 * Service For Do Login
 */

const service = {


    transaction: false,
    task: null,
    input: function(request) {
        return JSON.parse(request.body)
    },

    prepare: async function(input) {
        return input;
    },

    process: async function(input, OriginalInput) {

        var sql = "SELECT A.id, B.role_code, A.role_id, A.password FROM users A" +
            " INNER JOIN roles B ON A.role_id=B.id WHERE A.username=?";

        var user = (await db.raw(sql, [input.username])).rows[0];


        if (user === undefined || user === null) {
            throw new CoreException("Username not found", {}, 422);
        }

        if (!bcrypt.compareSync(input.password, user.password)) {
            throw new CoreException("User and Password doesn't Match", {}, 422);
        }

        var rowTaskList = (await db.raw("SELECT string_agg(A.task_name, ',') AS tasks FROM tasks A" +
            " INNER JOIN role_task B ON A.id = B.task_id WHERE B.role_id = " + user.role_id)).rows[0];

        var taskList = rowTaskList.tasks.split(",");

        var api_token = sha1(microtime.now() + Math.random(100000, 999999));

        var token = jwt.sign({
            user_id: user.id,
            role_name: user.role_code,
            api_token: api_token,
            tasks: taskList
        }, process.env.APP_KEY);

        // sementara drive database
        await db('api_token').insert({
            user_id: user.id,
            api_token: api_token
        });

        return { token: token };
    },
    validation: {
        username: 'required',
        password: 'required'
    }
}


module.exports = CoreService(service)