const express = require('express')
const { mongoose } = require('mongoose')
const cors = require('cors')
require("dotenv").config()

const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/credentials');
const dbConnect = require("./config/dbConn")

const app = express()
dbConnect()

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/images', express.static('upload/images'));

app.use('/user', require('./routes/userRoutes'))

mongoose.connection.on('open', () => {
    console.log('Connected to MongoDB')
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})

mongoose.connection.on('error', (err) => {
    console.log(err)
})
