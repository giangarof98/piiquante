const mongoose = require('mongoose');
const uniqueVal = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true}
})

userSchema.plugin(uniqueVal)

module.exports = mongoose.model('User', userSchema)