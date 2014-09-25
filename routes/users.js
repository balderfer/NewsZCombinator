var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./User');

// app.post('/upmykarma/', function(req, res) {
//     User.find({}, function(err, persons) {
//         persons.forEach(function(person) {
//             if (req.body.id == person._id) {
//                 console.log(person.username);
                
//             }
//         });
//     });
// });

module.exports = router;