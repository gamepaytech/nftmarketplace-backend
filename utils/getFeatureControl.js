const FeatureControl = require('../models/FeatureControl')
const logger = require('../logger')

const getFeatureControl = async (feature, userName) => {
    const userNamePassed = userName ? userName.trim() : null;
    const featurePassed = feature ? feature.trim() : null;

    if(!userNamePassed || !featurePassed){
        return 'NOT_ACCESSIBLE';
    }
    logger.info('Fetching feature control for - ' + featurePassed + ' for the user - ' + userNamePassed);
    const featureObj = await FeatureControl.findOne({
        feature_name: featurePassed
    });

    if (featureObj) {
        if (featureObj.users_accessible) {
            if (featureObj.users_accessible === '*') {
                return 'ACCESSIBLE';
            }
            const usersAccessible = featureObj.users_accessible.split(',');
            if (usersAccessible.length > 0) {
                for (let i in usersAccessible) {
                    if (usersAccessible[i].trim() === userNamePassed) {
                        return 'ACCESSIBLE';
                    }
                }
            } else if (usersAccessible === users_accessible) {
                return 'ACCESSIBLE';
            }
        }
    }
    return 'NOT_ACCESSIBLE';
}

module.exports = getFeatureControl
