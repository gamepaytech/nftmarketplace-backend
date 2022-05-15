const SystemConfiguration = require('../models/SystemConfiguration')

const getSystemConfig = async (configName) => {
    console.log('Fetching value for the config - ', configName)
    return await SystemConfiguration.findOne({
        config_name: configName
    })
}

module.exports = getSystemConfig