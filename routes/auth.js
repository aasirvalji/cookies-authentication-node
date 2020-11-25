const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth')

// POST api/auth/register
// Login user & get token
// Public
router.post(
  '/register',
  async (req, res) => {

      const { email, password } = req.body;

    try {
      let user = await User.findOne({ email }); //find user in db by email

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User with that email address already exists' }] });
      }

      user = new User({
        //create a new instance of the user model
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save(); //save to mongodb, returns a promise with user db info (including .id)

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        'secret',
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;

          return res
          .cookie("token", token, { httpOnly: true })
          .json({ user: user, success: true });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

// POST api/auth/login
// Login user & get token
// Public
router.post(
    '/login',
    async (req, res) => {

        const { email, password } = req.body;
  
      try {
        let user = await User.findOne({ email }); //find user in db by email
  
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
      
        const isMatch = await bcrypt.compare(password, user.password); //check entered password with encrycpted password
   
        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
  
        const payload = {
          user: {
            id: user.id,
          },
        };

        jwt.sign(
          payload,
          'secret',
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;

            return res
            .cookie("token", token, { httpOnly: true })
            .json({ user: user, success: true });
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );

// POST api/auth/logout
// Logout user & clear token
// Private
  router.post('/logout', async (req, res) => {
    res.clearCookie("token");
    return res.send({ success: true });
  })

// Get user status
// Private
router.get('/status', auth, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({user: req.user.id})

    if (!user) return res.status(400).json({ message: "There is no profile for this user" });
    
    return res.json({ user: user});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})

module.exports = router;