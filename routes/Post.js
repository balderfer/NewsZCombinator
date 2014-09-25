var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema({
    title: String,
    url: String,
    text: String,
    authorid: String,
    author: String,
    points: Number,
    date: Date,
    voteids: Array
});



var Post = mongoose.model('Post', postSchema);

module.exports = Post;