require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
// Database
const DBConnect = require('./database')
// Other
const PORT = process.env.PORT || 5000
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const rateLimiter = require('express-rate-limit')
// Routers
const authRouter = require('./routes/authRoute')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const nftRouter = require('./routes/nftRoutes')
const gamePayTokenRouter = require('./routes/tokensRoute')

// Database connection
DBConnect()

app.set('trust proxy', 1)
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 400,
    })
)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
// app.use(notFound)
// app.use(errorHandler)

// Routes
app.use('/auth', authRouter)
app.use('/nft', nftRouter)
app.use('/gamePayToken', gamePayTokenRouter)

//  Listening
app.listen(PORT, () => {
    console.log(`All running on http://localhost:${PORT}`)
})
