const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'I am new!'
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  keys:{
    p:{
      type:Number,
      required: true
    },
    q:{
      type:Number,
      required: true
    },
    n:{
      type:Number,
      required: true
    },
    e:{
      type:Number,
      required: true
    },
    d:{
      type:Number,
      required: true
    },
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'message'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
