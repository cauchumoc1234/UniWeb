require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(process.env.LINK_DATA, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('DB connected');
});
module.exports = db;