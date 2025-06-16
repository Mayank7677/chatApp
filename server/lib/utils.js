const jwt = require("jsonwebtoken");

exports.generateToken = (id, res , req) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const isLocalhost = req.hostname === "localhost";

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: !isLocalhost, // false on localhost, true on real domain
    sameSite: isLocalhost ? "Lax" : "None",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return token;
};
   