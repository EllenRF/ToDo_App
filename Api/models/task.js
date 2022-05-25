const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema(
  {
    description: {
      required: true,
      type: String,
    },
    done: {
      required: true,
      type: Boolean,
    },
  },
  {
    versionKey: false,
  }
)

module.exports = mongoose.model('Task', taskSchema);