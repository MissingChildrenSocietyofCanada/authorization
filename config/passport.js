// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;

var request = require('request');
var auth = require('./auth');

// load up the user model
var User = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'age_range', 'birthday', 'email', 'gender', 'hometown', 'name', 'cover', 'link', 'picture', 'timezone', 'locale', 'updated_time'],
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
        function (req, token, refreshToken, profile, done) {
            // asynchronous
            process.nextTick(function () {
                // check if the user is already logged in
                if (!req.user) {
                    console.log('No active user');

                    // locate the user record via the facebook profile id
                    User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                        if (err) {
                            return done(err);
                        }

                        if (user) {
                            console.log('User record found: ' + user.facebook.name);

                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.facebook.token) {
                                console.log('User record not bound to profile token');
                            }

                            // Overwrite any existing information
                            UpdateUserFromFacebook(user, profile, token);

                            user.save(function (err) {
                                console.log('User record updated');

                                if (err) {
                                    return done(err);
                                }

                                return done(null, user);  // user found, return the update user
                            });
                        } else {
                            console.log('User record not found');

                            // if there is no user, create them
                            var newUser = new User();
                            UpdateUserFromFacebook(newUser, profile, token);

                            newUser.save(function (err) {
                                if (err) {
                                    return done(err);
                                }

                                console.log('User record created');

                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    console.log('Active user: ' + req.user.facebook.name);

                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session
                    // TODO: Delete old user??

                    // Overwrite any existing information
                    UpdateUserFromFacebook(user, profile, token);

                    user.save(function (err) {
                        if (err) {
                            return done(err);
                        }

                        console.log('User record updated');

                        return done(null, user);
                    });
                }
            });
        }));

    // Updates the user instance with profile / token information from Facebook
    function UpdateUserFromFacebook(user, profile, token)
    {
        user.facebook.id = profile.id;
        user.facebook.token = token;

        if (typeof profile.name.givenName !== 'undefined') {
            user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
        }
        if (typeof profile.emails !== 'undefined' && profile.emails.length > 0) {
            user.facebook.email = profile.emails[0].value;
        }
        if (typeof profile.photos !== 'undefined' && profile.photos.length > 0) {
            user.facebook.profilepic = profile.photos[0].value;
        }

        user.facebook.displayName = profile.displayName;
        user.facebook.gender = profile.gender;
        user.facebook.birthday = profile._json.birthday;
        user.facebook.hometown = profile._json.hometown;
        user.facebook.location = profile._json.location;
    }

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL,
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
        function (req, token, tokenSecret, profile, done) {
            // asynchronous
            process.nextTick(function () {
                // check if the user is already logged in
                if (!req.user) {
                    User.findOne({ 'twitter.id': profile.id }, function (err, user) {
                        if (err) {
                            return done(err);
                        }

                        if (user) {
                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.twitter.token) {
                            }

                            UpdateUserFromTwitter(user, profile, token);

                            user.save(function (err) {
                                if (err) {
                                    return done(err);
                                }

                                return done(null, user);
                            });
                        } else {
                            // if there is no user, create them
                            var newUser = new User();

                            UpdateUserFromTwitter(newUser, profile, token);

                            newUser.save(function (err) {
                                if (err) {
                                    return done(err);
                                }

                                return done(null, newUser);
                            });
                        }
                    });
                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    UpdateUserFromTwitter(user, profile, token);

                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }
            });
        }));

    // Updates the user instance with profile / token information from Twitter
    function UpdateUserFromTwitter(user, profile, token)
    {
        user.twitter.id = profile.id;
        user.twitter.token = token;
        user.twitter.username = profile.username;
        user.twitter.displayName = profile.displayName;
        user.twitter.hometown = profile._json.location;

        if (typeof profile.photos !== 'undefined' && profile.photos.length > 0) {
            user.twitter.profilepic = profile.photos[0].value;
        }
    }

    // =========================================================================
    // INSTAGRAM ==================================================================
    // =========================================================================
    passport.use(new InstagramStrategy({

        clientID: configAuth.instagramAuth.clientID,
        clientSecret: configAuth.instagramAuth.clientSecret,
        callbackURL: configAuth.instagramAuth.callbackURL,
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
        function (req, token, refreshToken, profile, done) {
            // asynchronous
            process.nextTick(function () {

                // check if the user is already logged in
                if (!req.user) {
                    User.findOne({ 'instagram.id': profile.id }, function (err, user) {
                        if (err) {
                            return done(err);
                        }

                        if (user) {

                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.instagram.token) {
                            }

                            UpdateUserFromInstagram(user, profile, token);

                            user.save(function (err) {
                                if (err) {
                                    return done(err);
                                }

                                // TO DO? RESUBSCRIBE
                                return done(null, user);
                            });
                        } else {

                            var newUser = new User();

                            UpdateUserFromInstagram(user, profile, token);

                            newUser.save(function (err) {
                                if (err) {
                                    return done(err);
                                }

                                return registerIGSubscription(() => done(null, newUser));
                            });
                        }
                    });
                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    UpdateUserFromInstagram(user, profile, token);

                    user.save(function (err) {
                        if (err) {
                            return done(err);
                        }

                        return registerIGSubscription(() => done(null, user));
                    });
                }
            });
        }));
    };

    // Updates the user instance with profile / token information from Instagram
    function UpdateUserFromInstagram(user, profile, token)
    {
        user.instagram.id = profile.id;
        user.instagram.token = token;
        user.instagram.displayName = profile.displayName;
        user.instagram.username = profile.username;

        if (typeof profile._json.data.profile_picture !== 'undefined' && profile._json.data.profile_picture.length > 0) {
            user.instagram.profilepic = profile._json.data.profile_picture;
        }
    }


function registerIGSubscription(cb) {
    request.post("https://api.instagram.com/v1/subscriptions/", {
        form: {
            client_id: auth.instagramAuth.clientID,
            client_secret: auth.instagramAuth.clientSecret,
            object: "user",
            aspect: "media",
            //verify_token: auth.instagramAuth.token,
            callback_url: auth.instagramAuth.registrationCallbackURL
        }
    }, cb);
}