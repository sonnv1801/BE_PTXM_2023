const mongoose = require('mongoose');

const TypeComboSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  created_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TypeCombo', TypeComboSchema);
