const jwt = require('jsonwebtoken');

exports.createToken = async function(payload, secret){
    return jwt.sign(
        payload,
        secret,
        {algorithm:'HS256'}
    );
}

exports.verifyToken = async function(token, secret){
    try{
        return jwt.verify(token, secret);
     }catch(e){
        console.log('e:',e);
        return null;
     } 
}

exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization; 
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.bgclientSecret, (err, user) => {
            if(err){
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        })
    } else {
        res.sendStatus(401);
    }
}