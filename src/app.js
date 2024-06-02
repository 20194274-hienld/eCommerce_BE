require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

// init middleware
// console.log(`Process::`, process.env);
app.use(morgan("dev"))
// morgan("dev") color in status -> Bật khi dev mode
// morgan("combined") follow apache standard ->  Khi đưa lên production
// morgan("common") -> Gần giống combined nhưng k biết chạy bằng curl postman hay ...
// morgan("short") -> Ngắn hơn không có thời gian
// morgan("tiny") -> ngắn hơn nữa
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded(
    {
        extended: true
    }
))

// init db
require('./dbs/init.mongodb');
// const { checkOverload, countConnect } = require('./helpers/check.connect')
// checkOverload()
// countConnect()
// init routers
app.use('', require('./routers'))

// handling error
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})


module.exports = app