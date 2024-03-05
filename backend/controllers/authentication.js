const router = require('express').Router();
const db = require("../models");
const bcrypt = require('bcrypt');

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
               res.json({ user });
          }
     } catch (error) {
          // Handle errors
          console.error("Error:", error);
          res.status(500).json({ message: "Internal Server Error" });
     }
});

module.exports = router;
