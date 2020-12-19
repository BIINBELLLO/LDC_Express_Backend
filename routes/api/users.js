const express = require("express");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const router = express.Router();

// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post(
	"/",
	[
		check("name", "Name is required").not().isEmpty(),
		check("email", "Please include a valide email").isEmail(),
		check("phone", "Phone is required").not().isEmpty(),
		check(
			"password",
			"Please enter a password with 6 or more characters"
		).isLength({ min: 6 }),
	],

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, email, password, phone } = req.body;

		try {
			// Check if user exist
			let user = await User.findOne({ email });
			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "User already exists" }] });
			}

			// Get users gravatar

			const avatar = gravatar.url(email, {
				s: "200",
				r: "pg",
				d: "mm",
			});

			user = new User({
				name,
				email,
				phone,
				avatar,
				password,
			});
			// Encrypt password
			const salt = await bcrypt.genSalt(20);
			user.password = await bcrypt.hash(password, salt);
			// Save the User
			await user.save();

			// return jsonwebtokens
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{ expiresIn: 360000 },
				(errr, token) => {
					if (errr) throw errr;
					return res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send("Server error");
		}
	}
);

module.exports = router;
