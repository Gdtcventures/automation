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