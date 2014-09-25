var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    firstname: String,
    lastname: String,
    username: String,
    posts: Array,
    karma: Number
});



var User = mongoose.model('User', userSchema);

module.exports = User;