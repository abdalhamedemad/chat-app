const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    userId:{
      type: String,
      required: true
    },
    content: [
      { me:{
        type: String,
        required: false
      },
      body:{
        type: String,
        required: false
      }
      }
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model('messages', messageSchema);
