const mongoose = require('mongoose')

const DBConnect = () => {
    console.log(process.env.MONGO_URL)
    mongoose
        .connect(process.env.MONGO_URL,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        .then(() => console.log('DATABASE CONNECTED'))
        .catch((err) => console.log('DATABASE NOT CONNECTED: ' + err))
}

module.exports = DBConnect
