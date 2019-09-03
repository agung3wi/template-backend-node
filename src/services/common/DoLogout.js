const { db, CoreService, CoreException } = require('../../util/CallService')

/**
 * Service For Do Login
 */

const service = {

    transaction: true,
    task: 'admin',
    input: function(request) {
        return JSON.parse(request.body)
    },
    prepare: async function(input) {
        return input;
    },

    process: async function(input, OriginalInput) {
        await db('api_token')
            .where('api_token', input.session.api_token)
            .where('user_id', input.session.user_id)
            .del();
        return { message: "Success Logout" }
    },
    validation: {}
}

module.exports = CoreService(service);