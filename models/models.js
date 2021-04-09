const mongoose = require('mongoose');

const particularSchema = mongoose.Schema({
  name:String,
  amount:Number,
  date: {
    type:Date,
    default:Date.now
  }
})

const itemSchema = mongoose.Schema({
  name: {
    type:String,
    required:true,
    unique:true
  },
  timestamp: {
    type:Date,
    required:true,
    default:Date.now
  },
  particulars: [particularSchema],
})

const usersSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    items: [itemSchema],
})

module.exports = mongoose.model('authUsers', usersSchema);
