// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
	'facebookAuth': {
		'clientID': process.env.FACEBOOK_CONSUMER_KEY || '121998868463694', // your App ID 
		'clientSecret': process.env.FACEBOOK_CONSUMER_SECRET || 'af0a52fc594a460867fd44006e9ac514', // your App Secret 
		'callbackURL': process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:8080/auth/facebook/callback'
	},
	'twitterAuth': {
		'consumerKey': process.env.TWITTER_CONSUMER_KEY || 'UMbbWr48zrAT94aFON1YCXBCO',
		'consumerSecret': process.env.TWITTER_CONSUMER_SECRET || 'TTWr7kFiE9fpKQci1PCvYoNtXlwLxgmKVH2wTpaE3PapkpMx5X',
		'callbackURL': process.env.TWITTER_CALLBACK_URL || 'http:/localhost:8080/auth/twitter/callback'
	},
	'instagramAuth': {
		'clientID': process.env.INSTAGRAM_CONSUMER_KEY || 'c2a8886806744952b6cccf32d8710bc3',
		'clientSecret': process.env.INSTAGRAM_CONSUMER_SECRET || '6f67dbd7a9da448a9e413c3f7a04e65c',
		'callbackURL': process.env.INSTAGRAM_CALLBACK_URL || 'http://localhost:8080/auth/instagram/callback',
		'verifyToken': process.env.IG_VERIFY_TOKEN || 'e92312d3-579a-470b-a516-83bfee56b983',
		'registrationCallbackURL': process.env.INSTAGRAM_REGISTRATION_CALLBACK_URL || 'https://mcsc-hfm-webhooks-dev.azurewebsites.net/api/instagram?code=3Qc2vZPTE47lYcwi3Zx34JBd7gzQ018kktLjaMA1xYjUl5bTl8gk4g==&'
	}
};