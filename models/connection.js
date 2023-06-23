const mongoose = require('mongoose')
require("dotenv").config();
const Database = process.env.Databaseconnectionstring;

mongoose.set('strictQuery', true)
mongoose.set('strictPopulate', false)

mongoose.connect(Database, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to mongoose'))

module.exports = db



