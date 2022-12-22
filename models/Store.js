const mongoose = require("mongoose");

const Store = new mongoose.Schema(
    {
    storeCategory: {
      type: String,
      required: true,
    }, 
    storeLogo: {
      type: String,
      required: true,
    }, 
    // storeImage: {
    //   type: String,
    //   required: true,
    // }, 
    product: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    startDate: {
      type:Date,
      required: true
    },
    endDate: {
      type:Date,
      required: true
    },
    storePoints: {
      type: Number,
      required: true
    },
    // available: {
    //     type: Number,
    //   }, 
    },
  { timestamps: true }
);

module.exports =  mongoose.model("Store", Store);
