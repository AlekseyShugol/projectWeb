const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  message: { type: String, required: true },
  level: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  requestBody: { type: Object, default: {} }, 
  responseBody: { type: Object, default: {} }, 
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;