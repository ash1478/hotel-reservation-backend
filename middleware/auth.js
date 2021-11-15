const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verifyToken = (req,res,next)=>{
    if (!req.headers.authorization) {
        return res.status(401).send({ error: 'Token Missing' });
    }
    var token = req.headers.authorization.split(' ')[1];
    console.log(token);
    try{
        var payload = jwt.decode(token,process.env.TOKEN_KEY);
    }
    catch(e){
        return res.status(401).send({ error: "Token Invalid" });
    }

    console.log(payload);

    User.findById(payload._id, function (err, user) {
        if (!user) {
            return res.status(401).send({ error: 'User Not Found' });
        } else {
            req.user = payload.sub;
            next();
        }
    })
};

module.exports = verifyToken;