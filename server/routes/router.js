const express = require('express');
const userdb = require('../models/userSchema')
const bcrypt = require('bcrypt');
const router = express.Router();
const saltRounds = 10;
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
router.post('/register', async (req, res, next) => {
  const { fname, email, password, cpassword } = req.body;
  if (!fname || !email || !password || !cpassword) {
    return res.status(422).json({ status: 422, message: 'Data does not exist' });
  }
  try {
    const preuser = await userdb.findOne({
      email: email,
    })
    if (preuser) {
      return res.status(422).json({ status: 422, message: 'User already exists' });
    } else if (password != cpassword) {
      return res.status(422).json({ status: 422, message: 'Password does not match' });
    } else {
      //hash the password
      const passhash = bcrypt.hashSync(password, saltRounds);


      const user = new userdb({
        name: fname,
        email: email,
        password: passhash,
      });

      user.save()
        .then(() => {
          return res.status(200).json({
            status: 200,
            message: 'Registration successful',
          });
        })
    }

  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: 'Error sever' });

  }
});
router.post('/login', async (req, res) => {
  // console.log(req.cookies);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({
      status: 422, message: 'Data does not'
    })
  }
  try {
    const user = await userdb.findOne({ email: email })
    if (!user) {
      return res.status(422).json({
        status: 422, message: 'User does not exist'
      })
    } else {
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        //token
        const token = jwt.sign({
          name: user.name,
          email: user.email,
        }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
        const result = {
          name: user.name,
          email: user.email,
          token: token
        }
        return res.status(200).json({
          status: 200,
          message: 'Login successful',
          result
        });
      } else {
        return res.status(422).json({
          status: 422, message: 'Password does not match'
        })
      }
    }
  } catch {
    return res.status(422).json({ status: 422, message: 'Data does not' })
  }
})
// user valid
router.get('/validuser', authenticate, async (req, res) => {
  try {
    const user = await userdb.findOne({ email: req.decoded.email });
    if (user) {
      const { name, email, ...other } = user;

      return res.status(200).json({
        status: 200,
        dataUser: {
          name: name,
          email: email,
        },
        message: 'User verify'
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: 422,
      message: 'Data does not exist'
    })
  }
})
//logout user

router.get('/logout', authenticate, (req, res) => {
  try {
    res.clearCookie('jwt');
    res.status(200).json({
      status: 200,
      message: 'Logout successful'
    })
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: 422,
      message: 'Data does not exist'
    })

  }
})


module.exports = router;