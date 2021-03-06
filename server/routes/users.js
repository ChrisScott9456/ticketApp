const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../../config/database');

//User Schema
const User = require('../models/users');

// Register
router.post('/register', function(req, res) {
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	});

	User.addUser(newUser, function(err, user) {
		if(err) {
			res.json({success: false, msg: 'Failed to register user'});
		}else {
			res.json({success: true, msg: 'User successfully registered'});
		}
	});
});

router.post('/auth', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	User.getUserByUsername(username, function(err, user) {
		if(err) throw err;

		if (!user) {
			return res.json({success: false, msg: 'User not found!'});
		}

		User.comparePassword(password, user.password, function(err, isMatch) {
			if(err) throw err;

			if(isMatch) {
				var token = jwt.sign({data: user}, config.secret, {
					expiresIn: 604800 //1 week
				});

				res.json({
					success: true,
					token: 'JWT ' + token,
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				});
			}else {
				res.json({success: false, msg: 'Wrong password'});
			}
		});
	});
});


router.get('/profile', function(req, res, next) {
	res.send('PROFILE');
});

module.exports = router;