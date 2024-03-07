const router = require('express').Router();
const db = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('json-web-token');

const { User } = db;




router.post('/', async (req, res) => {
     try {
          let user = await User.findOne({
               where: { email: req.body.email }
          });

          if (!user || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
               res.status(404).json({
                    message: `Could not find a user with the provided username and password`
               });
          } else {
               const result = await jwt.encode(process.env.JWT_SECRET, {id: user.userId})
               res.json({user: user, token: result.value})
          }
     } catch (error) {
          // Handle errors
          console.error("Error:", error);
          res.status(500).json({ message: "Internal Server Error" });
     }
});




router.get('/profile', async (req, res) => {
     res.json(req.currentUser);
})



// BONUS
router.post('/super-important-route', async (req, res) => {
     if (req.session.userId) {
          console.log('Do the really super important thing');
          res.send('Done');
     } else {
          console.log('You are not authorized to do the super important thing');
          res.send('Denied');
     }
})




module.exports = router;
