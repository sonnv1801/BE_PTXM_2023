const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  created_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Type', typeSchema);
