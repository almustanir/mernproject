const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require: true
    },
    password:{
        type:String,
        require: true
    },
    roles:[{
        type:String,
        default: 'Employees'
    }],
    active:{
        type:Boolean,
        default: 'Employees'
    }
})

module.exports = mongoose.model('User', userSchema)