const mongoose = require("mongoose")
const Schema = mongoose.Schema
const reviewSchema =  new mongoose.Schema(
  { 
  comment: { 
      type: String, 
      required: true
    },
  rating: { 
        type: Number, 
        required: true
      },
  gamePlay: { 
        type: Number, 
        required: true
      },    
   complexity: { 
        type: Number, 
        required: true
      },
   earningPotential: { 
        type: Number, 
        required: true
      },
   costEffective: { 
        type: Number, 
        required: true
      },     
    users: { 
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    games: { 
        type: Schema.Types.ObjectId,
        ref: 'games',
      },
   
},
{ timestamps: true }
);
module.exports = mongoose.model("userReview", reviewSchema);


