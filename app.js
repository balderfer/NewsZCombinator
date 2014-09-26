var express = require('express'),
    exphbs  = require('express3-handlebars'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    TwitterStrategy = require('passport-twitter'),
    GoolgeStrategy = require('passport-google'),
    FacebookStrategy = require('passport-facebook'),
    bodyParser = require('body-parser'),
    path = require('path'),
    methodOverride = require('method-override'),
    formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    http = require('http');
    

var config = require('./config.js'), //config file contains all tokens and other private info
    funct = require('./functions.js');

var User = require('./routes/User');
var Post = require('./routes/Post');
var users = require('./routes/users');

// db_url = process.env.MONGOHQ_URL;
// mongoose.connect(db_url);

mongoose.connect('localhost', 'aanews');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Connected to database');
});

var app = express();

//===============PASSPORT=================

// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserializing " + obj);
  done(null, obj);
});

// Use the LocalStrategy within Passport to login users.
passport.use('local-signin', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localAuth(username, password)
    .then(function (user) {
      if (user) {
        console.log("LOGGED IN AS: " + user.username);
        req.session.success = 'You are successfully logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT LOG IN");
        req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));

// Use the LocalStrategy within Passport to Register/"signup" users.
passport.use('local-signup', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {

    var newUser = new User({
      username: username,
      karma: 0
    });

    newUser.save(function(err) {

    });

    console.log(newUser);

    funct.localReg(username, password, newUser._id)
    .then(function (user) {
      if (user) {
        console.log("REGISTERED: " + user.username);
        req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT REGISTER");
        req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.error = 'Please sign in!';
  res.redirect('/signin');
}


//===============EXPRESS=================

// Configure Express
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger());
app.use(express.cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.formidable());
app.use(express.session({ secret: 'supernova' }));
app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

app.use(app.router);

// Configure express to use handlebars templates
var hbs = exphbs.create({
    defaultLayout: 'main',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


//===============ROUTES=================

// app.use('/users/', users);

//displays our homepage
app.get('/', function(req, res){

  var postsarray = [];

  Post.find({}, function(err, posts) {
    posts.forEach(function(post) {
      postsarray.push(post);
    });
  });

  if (req.user) {
    console.log(req.user.id);
    User.find({}, function(err, persons) {
        persons.forEach(function(person) {
          if (req.user.id == person._id) {
            console.log(person.username);
            res.render('home', {user: req.user, info: person, posts: postsarray});
          }
        });
    });
  }
  else {
    console.log("no user :(");
    res.render('home', {user: req.user, posts: postsarray});
  }
});

//displays our signup page
app.get('/signin', function(req, res){
  res.render('signin');
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/local-reg', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/login', passport.authenticate('local-signin', { 
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', function(req, res){
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});

//displays our submit page
app.get('/submit', function(req, res){
  res.render('submit', {user: req.user});
});

// app.post('/upmykarma/', function(req, res) {
//     User.find({}, function(err, persons) {
//         persons.forEach(function(person) {
//             if (req.body.id == person._id) {
//                 console.log(person.username);
//                 person.karma++;
//                 person.save(function(err) {
//                   console.log("karma: " + person.karma);
//                 });
//             }
//         });
//     });
// });

app.post('/newpost/', function(req, res) {
    User.find({}, function(err, persons) {
        persons.forEach(function(person) {
            if (req.body.id == person._id) {
                console.log(person.username);

                var date = new Date();
                
                var newPost = new Post({
                  title: req.body.title,
                  url: req.body.url,
                  text: req.body.text,
                  authorid: req.body.id,
                  author: person.username,
                  points: 0,
                  date: date
                });

                newPost.save(function(err) {});

                person.posts.push(newPost._id);

                person.save(function(err) {
                  console.log("posts: " + person.posts);
                  res.json({
                      success: true,
                      message: "Post successful"
                  });
                });
            }
        });
    });
});

app.post('/uppost/', function(req, res) {
    Post.find({}, function(err, posts) {
        posts.forEach(function(post) {
            if (req.body.id == post._id) {
                found = false;
                post.voteids.forEach(function(votes) {
                  if (votes == req.body.userid) {
                    res.json({
                      success: false,
                      message: "Already upvoted"
                    });
                    found = true;
                  }
                });
                if (!found) {

                  User.find({}, function(err, users) {
                    users.forEach(function(user) {
                      if (post.authorid == user._id) {
                        user.karma++;
                        user.save(function(err) {

                        });
                      }
                    });
                  });

                  post.points++;
                  post.voteids.push(req.body.userid);
                  post.save(function(err) {
                    console.log(post.title + " points: " + post.points);
                    res.json({
                      success: true,
                      message: "Upvoted"
                    });
                  });
                }
            }
        });
    });
});




//===============PORT=================
// var port = process.env.PORT || 5000;
// app.listen(port);
// console.log("listening on " + port + "!");

module.exports = app;