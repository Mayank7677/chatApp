const jwt = require("jsonwebtoken");

exports.generateToken = (id, res , req) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const isLocalhost = req.hostname === "localhost";

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, 
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return token;
};
   