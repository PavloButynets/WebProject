const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token"); 

  if (!token) {
    return res.status(401).send({ message: "Token missing" });
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).send({ message: error.message || "Invalid Token" });
  }
};

module.exports = verifyToken;
