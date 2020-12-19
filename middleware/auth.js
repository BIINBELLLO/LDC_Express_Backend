const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
	// Get token from header
	const token = req.header("x-auth-token");

	// Check that token exists
	if (!token) {
		return res.status(401).json({ msg: "No token, authorization denied!" });
	}

	// Verify Token
	try {
		// Decode token
		const decodedToken = jwt.verify(token, config.get("jwtSecret"));
		// Add to the request
		req.user = decodedToken.user;
		// Call the next funxtion
		next();
	} catch (error) {
		res.status(401).json({ msg: "Token is invalid" });
	}
};
