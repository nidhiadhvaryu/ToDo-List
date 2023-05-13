//import mongoose to create mongoose model
const mongoose = require('mongoose');

//create Schema
const TodoItemSchema = new mongoose.Schema({
  item:{
    type:String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
})

//export this Schema
module.exports = mongoose.model('todo', TodoItemSchema);