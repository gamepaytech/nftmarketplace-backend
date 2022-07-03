const mongoose = require('mongoose')
 
const LuckyDrawPriceSchema =new mongoose.Schema({
     FirstPrice:[

     ],
     SecondPrice:[

     ],
     ThirdPrice:[

     ],
     startDate: {
        type:String
    },
     endDate: {
        type:String
    },
    info: {
        type:String
    }
     
})
module.exports = mongoose.model("LD_CONFIG", LuckyDrawPriceSchema);