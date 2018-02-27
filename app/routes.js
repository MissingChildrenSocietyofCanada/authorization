module.exports = function (app, passport, configAuth) {

	// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', isAlreadyLoggedIn, function (req, res) {
		res.render('index.ejs');
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile.ejs', {
			user: req.user
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/parameters', function (req, res) {
		res.send(configAuth);
	})

	// =============================================================================
	// AUTHENTICATE (FIRST LOGIN) ==================================================
	// =============================================================================

	// facebook -------------------------------

	// Scope Notes
	//  - user_friends will only retrieve the friends that are also registered with the platform

	let facebookScope = ['public_profile', 'email', 'user_about_me', 'user_birthday', 'user_education_history', 'user_friends', 'user_hometown',
		'user_likes','user_location', 'user_photos', 'user_posts','user_relationship_details','user_relationships', 'user_religion_politics',
		'user_status','user_tagged_places','user_videos','user_website','user_work_history'];

	// send to facebook to do the authentication
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: facebookScope }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {	failureRedirect: '/' }), function (req, res) {
			res.redirect('/profile');
		}
	);

	// twitter --------------------------------

	// send to twitter to do the authentication
	app.get('/auth/twitter', passport.authenticate('twitter', { scope: 'email' }));

	// handle the callback after twitter has authenticated the user
	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {	failureRedirect: '/' }), function (req, res) {
			res.redirect('/profile');
		}
	);

	// instagram ---------------------------------

	// send to instagram to do the authentication
	app.get('/auth/instagram', passport.authenticate('instagram', { scope: 'basic' }));

	// the callback after instagram has authenticated the user
	app.get('/auth/instagram/callback',
		passport.authenticate('instagram', { failureRedirect: '/' }), function (req, res) {
			res.redirect('/profile');
		}
	);

	// =============================================================================
	// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
	// =============================================================================

	// facebook -------------------------------

	// send to facebook to do the authentication
	app.get('/connect/facebook', passport.authorize('facebook', { scope: facebookScope }));

	// handle the callback after facebook has authorized the user
	app.get('/connect/facebook/callback',
		passport.authorize('facebook', {
			successRedirect: '/profile',
			failureRedirect: '/'
		}));

	// twitter --------------------------------

	// send to twitter to do the authentication
	app.get('/connect/twitter', passport.authorize('twitter', { scope: 'email' }));

	// handle the callback after twitter has authorized the user
	app.get('/connect/twitter/callback',
		passport.authorize('twitter', {
			successRedirect: '/profile',
			failureRedirect: '/'
		}));


	// instagram ---------------------------------

	// send to instagram to do the authentication
	app.get('/connect/instagram', passport.authorize('instagram', { scope: 'basic' }));

	// the callback after instagram has authorized the user
	app.get('/connect/instagram/callback',
		passport.authorize('instagram', {
			successRedirect: '/profile',
			failureRedirect: '/'
		}));

	// =============================================================================
	// UNLINK ACCOUNTS =============================================================
	// =============================================================================
	// used to unlink accounts. for social accounts, just remove the token
	// for local account, remove email and password
	// user account will stay active in case they want to reconnect in the future

	// facebook -------------------------------
	app.get('/unlink/facebook', function (req, res) {
		var user = req.user;
		user.facebook.token = undefined;
		user.save(function (err) {
			if (err) {
				throw err;
			}

			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function (req, res) {
		var user = req.user;
		user.twitter.token = undefined;
		user.save(function (err) {
			if (err) {
				throw err;
			}

			res.redirect('/profile');
		});
	});

	// instagram ---------------------------------
	app.get('/unlink/instagram', function (req, res) {
		var user = req.user;
		user.instagram.token = undefined;
		user.save(function (err) {
			if (err) {
				throw err;
			}

			res.redirect('/profile');
		});
	});


};

// route middleware to ensure user is logged in
function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}

function isAlreadyLoggedIn (req, res, next) {
	if (req.isAuthenticated() && req.user) {
		res.redirect('/profile');
	}

	return next();
}
