const jwt = require("jsonwebtoken");
const Admin = require('../models/admin');

module.exports = isAdmin = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send({ error: "Access denied" });
  try {
    const { _id } = jwt.verify(token, process.env.TOKENSecret);
    let user = await Admin.findById(_id);
    if(!user) return res.status(403).send({ error: "Not authorized to access the resource" });
    req.user = user;
    next();
  } catch (error) {
    res.status(403).send({ error: "Not authorized to access the resource" });
  }
};
