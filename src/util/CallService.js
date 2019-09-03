const v = require('node-input-validator');
const jwt = require('jsonwebtoken');

class CoreException {
    constructor(errorMessage = "", errorList = {}, errorCode = 422) {
        this.errorMessage = errorMessage;
        this.errorList = errorList;
        this.errorCode = errorCode;
    }
}

var CoreResponse = {
    ok: function(data) {
        
        var body = JSON.stringify({
            success:true,
            data:data
        })
        var statusCode=200;
        
        return {
            statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body
        };
    },
    fail: function(errorMessage = "", errorList = {}, statusCode = 500) {
        var result = {
            success:false,
        }

        if (errorMessage !== "") {
            result.error_message = errorMessage
        }

        if (errorList !== {}) {
            result.error_list = errorList
        }

        var body = JSON.stringify(result);
        console.log(statusCode)
        return {
            statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body
        };
    }
}

const CallService = async function(service, input) {
    const validator = new v(input, service.validation);

    const matched = await validator.check();
    if (!matched) {
        throw new CoreException("", validator.errors);
    }

    var inputNew = await service.prepare(input);
    const inputProcess = (inputNew == null) ? input : inputNew;
    const result = await service.process(inputProcess, input);

    return result
}

const ExecuteService = async function(service, input) {

    try {
        if (service.transaction === true) {
            await db.raw("BEGIN")
        }

        const result = await CallService(service, input)
        if (service.transaction === true) {
            await db.raw("COMMIT")
        }

        return CoreResponse.ok(result);
    } catch (err) {
        if (service.transaction === true) {
            await db.raw("ROLLBACK");
        }

        if (err instanceof CoreException) {
            return CoreResponse.fail(err.errorMessage, err.errorList, err.errorCode);
        } else {
            return CoreResponse.fail(err.message);
        }
    }
}

const db = require('knex')({
    client: process.env.DB_DRIVE,
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    }
});


var CoreService = function(service) {
    return {
        exec : async function(event) {
            var inputData = service.input(event);
            if (service.task !== undefined && service.task !== null) {
                var token = event.headers.Authorization;
                if (token === undefined || token === null) {
                    return CoreResponse.fail("Token Not found", {}, 403);
                }
            
                try {
                    var claim = jwt.verify(token, process.env.APP_KEY);
                    const result = await db.raw("SELECT 1 FROM api_token WHERE api_token=? AND user_id=?", [claim.api_token, claim.user_id]);
                    if (result.rows.length == 0) {
                        return CoreResponse.fail("Unauthorized", {}, 403);
                    }
                } catch (err) {
                    return CoreResponse.fail("Unauthorized", {}, 403);
                }

                if (service.role !== undefined && service.role !== null) {
                    if (service.role != claim.role_name) {
                        return CoreResponse.fail(res, "Unauthorized", {}, 403);
                    }
                }
            
                if (service.task !== undefined && service.task !== null) {
                    if (claim.tasks.indexOf(service.task) == -1) {
                        return CoreResponse.fail(res, "Unauthorized", {}, 403);
                    }
                }
            
                inputData['session'] = claim;
            
            }
            return await ExecuteService(service, inputData, true);
        },
        call : async function(input) {
            return await CallService(service, input);
        }
    }
} 

module.exports = { CallService, ExecuteService, CoreException, CoreResponse, db, CoreService };