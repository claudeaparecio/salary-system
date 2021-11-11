const mongoose = require('mongoose');

const { Schema } = mongoose;

const SessionSchema = new Schema({
  session: { type: String, },
  session_id: { type: String, },
  expire: { type: String, },
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', SessionSchema)