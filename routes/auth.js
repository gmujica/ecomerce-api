const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

//register
router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        //Encode password with AES
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });
    try {
        const saveUser = await newUser.save();
        res.status(201).json(saveUser);
    } catch(err) {
        res.status(500).json(err);
    }
});

//login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json('Wrong credentials!!');

        const accessTocken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: '3d' }
        );

        //decode Password
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        OriginalPassword !== req.body.password && res.status(401).json('Wrong credentials!!');
    
        const { password, ...others } = user._doc;
        
        res.status(200).json({ ...others, accessTocken });
    
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;