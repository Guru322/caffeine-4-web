const mongoose = require('mongoose');

const pingResultSchema = new mongoose.Schema({
  website: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isUp: {
    type: Boolean,
    default: false
  },
  responseTime: {
    type: Number,  // in milliseconds
    required: false 
  },
  status: {
    type: mongoose.Schema.Types.Mixed,  
    required: false
  },
  error: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('PingResult', pingResultSchema);