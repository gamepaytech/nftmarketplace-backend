const mongoose = require("mongoose");

const Store = new mongoose.Schema(
    {
    purchase :  {
      type: String,
     
    },
    available :  {
        type: String,
       
      },
    },
  { timestamps: true }
);

module.exports =  mongoose.model("Store", Store);
