const jwt = require('jsonwebtoken');
const userdb = require('../models/userSchema');
require('dotenv').config();


const authenticate = async (req, res, next) => {
  //verify token
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      status: '401',
      message: 'Unauthorized'
    });
  }
  try {
    //decode token

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await userdb.findOne({ email: decoded.email });
    if (!user) {
      return res.status(422).json({
        status: 422,
        message: 'User does not exist'
      })
    }
    req.decoded = decoded;
    next();

  } catch (err) {
    return res.status(401).json({
      status: '401',
      message: 'Unauthorized'
    });
  }
}
module.exports = authenticate;