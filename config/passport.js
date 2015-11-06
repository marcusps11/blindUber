var User = require('../models/user');

var UberStrategy = require('passport-uber').Strategy;


module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log('hello')
      console.log('deserializing user:',user);
      done(err, user);
    });
  });

  // passport.use(new UberStrategy({
  //     clientID: process.env.UBER_CLIENT_ID,
  //     clientSecret:  process.env.UBER_CLIENT_SECRET,
  //     callbackURL: "http://localhost:3000/auth/uber/callback"
  //   },
  //   function(accessToken, refreshToken, profile, done) {
  //     User.findOrCreate({ uberid: profile.id }, function (err, user) {
  //       console.log(profile)
  //       return done(err, user);
  //     });
  //   }
  // ));


  passport.use('uber', new UberStrategy({
    clientID: process.env.UBER_CLIENT_ID,
    clientSecret: process.env.UBER_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/uber/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({uberid: profile.id }, function(err, user) {
        console.log(profile)
        if (err) return done(err);
        if (user) {
          return done(null, user);
        } else {

          var newUser = new User();


          newUser.uber.picture               = profile.picture;
          newUser.uber.uuid                  = profile.uuid;
          newUser.uber.first_name            = profile.first_name;
          newUser.uber.last_name             = profile.last_name;
          newUser.uber.promo_code            = profile.promo_code;
          newUser.uber.email                 = profile.email;
          newUser.uber.provider              = profile.provider;

          newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser);
          });
        };
      });
    });
  }));
}

