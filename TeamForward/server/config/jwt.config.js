// middleware to authenticate the user with jwt token
// next, calls next middleware in chain or next actual code (or controllers) to run next
// middleware runs on way down and way back up
const jwt = require("jsonwebtoken");
module.exports.authenticate = (req, res, next) => {
  jwt.verify(req.cookies["jwt-token"], process.env.SecretKeyOne, (err, payload) => {
    if (err) {
      res.status(401).json({ verified: false });
    } else {
      req.userId = payload.id;
      next();
    }
  });
};
