const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader  = req.header("Authorization"); 
  if (!authHeader) return res.status(401).json({ message: 'Access denied. No token provided.' });

  const parts = authHeader.split(" "); 
    if (parts.length !== 2 || parts[0] !== 'Bearer') { 
        return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    const token = parts[1];
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
