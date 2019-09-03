const { CoreResponse } = require('../util/CallService')
var serviceList = {
    DoLogin: require('../services/common/DoLogin'),
    DoLogout: require('../services/common/DoLogout')
}

const RestApi = {
    exec: async function(event) {
        var serviceName = event.headers.service_name;
        if(!serviceList[serviceName]) {
            return CoreResponse.fail("Service not found");
        }

        return await serviceList[serviceName].exec(event);
    }
}

module.exports = RestApi