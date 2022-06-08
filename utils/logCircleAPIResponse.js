const circleAPIResponse = require("../models/CircleResponseLog");
const logger = require('../logger');

const logCircleResponse = async (desc, email, paymentId, paymentStatus, respObject) => {
  logger.info('Start of creating entry into db for circle response');
  await circleAPIResponse.create(
      {
        description: desc,
        email: email,
        paymentId: paymentId,
        paymentStatus: paymentStatus,
        respObject: respObject,
      }
  );
  logger.info('End of creating entry into db for circle response');
}


module.exports = logCircleResponse;