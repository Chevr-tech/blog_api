const jwt = require("jsonwebtoken");

module.exports = auth = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send({ error: "Access denied" });
  try {
    const verified = jwt.verify(token, process.env.TOKENSecret);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send({ error: "Not authorized to access the resource" });
  }
};
