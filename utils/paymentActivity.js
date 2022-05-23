const models = require("../models/User");

const createActivity = async (userId, price, isGood, gateway, orderId) => {
  await models.users.updateOne(
      { _id: userId },
      {
          $push: {
              activity: {
                  activity: `You have ${
                      isGood == true ? "commited" : "initiated"
                  } ${price.toFixed(2)} USDT amount using ${gateway}.`,
                  timestamp: new Date(),
                  orderId: orderId,
              },
          },
      },
      { new: true, upsert: true }
  );
};
const updateActivity = async (userId, orderId, dataString) => {
  await models.users.updateOne(
      {
          _id: userId,
          "activity.orderId": orderId,
      },
      { $set: { "activity.$.activity": dataString } }
  );
};

module.exports = {updateActivity,createActivity};