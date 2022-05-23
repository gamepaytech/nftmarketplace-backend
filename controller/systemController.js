const {
    getSystemMessage,
    getSystemMessageByLang,
    getSystemConfig,
    getFeatureControl
} = require('../utils')
const logger = require('../logger')

const getSysMessage = async (req, res) => {
    try {
        const msgCode = req.params.msgCode;
        logger.info('Start of getting system message for code :: '+ msgCode);
        const sysMsg = await getSystemMessage(msgCode);
        const message = sysMsg ? sysMsg.message : 'No system message found for this code';
        res.status(200).json({
            data: message
        });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal server error!",
        });
    }
};

const getSysMessageByLang = async (req, res) => {
    try {
        const msgCode = req.params.msgCode;
        const lang  = req.params.language;
        logger.info('Start of getting system message for code :: '+ msgCode + ' in '+ lang);
        const sysMsg = await getSystemMessageByLang(msgCode, lang);
        const message = sysMsg ? sysMsg.message : 'No system message found for this code';
        res.status(200).json({
            data: message
        });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal server error!",
        });
    }
};

const getSysConfig = async (req, res) => {
    try {
        const configName = req.params.config;
        logger.info('Start of getting system config for code :: '+ configName);
        const sysConfig = await getSystemConfig(configName);
        console.log(sysConfig);
        logger.info(sysConfig);
        const configValue = sysConfig ? sysConfig.config_value : 'No system config found for this code';
        res.status(200).json({
            data: configValue
        });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal server error!",
        });
    }
};

const getFeatureAccessController = async (req, res) => {
    try {
        const featureName = req.params.featureName;
        const userName = req.params.userName;
        logger.info('Start of getting feature for the feature :: '+ featureName);
        const isAccessible = await getFeatureControl(featureName, userName);
        res.status(200).json({
            data: isAccessible
        });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal server error!",
        });
    }
};


module.exports = {
    getSysMessage,
    getSysMessageByLang,
    getSysConfig,
    getFeatureAccessController
};
