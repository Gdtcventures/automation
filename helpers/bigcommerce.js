const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const axios = require("axios");


exports.createCustomer = async function (customer) {

    const bcCustomer = await this.getCustomer(customer.email);
    if (bcCustomer.data.data.length !== 0) { 
        return bcCustomer.data;
    }
    const data = [{ authentication: { force_password_reset: true },
        email: customer.email,
        first_name: customer.name,
        last_name: customer.name,
    }];
    const options = await formatOptions('POST','v3/customers',data);
    const createdCustomer = await axios(options);
    return createdCustomer.data;
}

exports.getLoginUrl = async function(customerId) {
    const dateCreated = Math. round((new Date()). getTime() / 1000);
    const  payload = {
        "iss": process.env.bgclientID,
        "iat": await this.bcTime(),
        "jti": uuidv4(),
        "operation": "customer_login",
        "store_hash": process.env.bgstoreHash,
        "customer_id": customerId,
    }
    let token = jwt.sign(payload, process.env.bgclientSecret, {algorithm:'HS256'});
    return `${process.env.bgstoreUrl}/login/token/${token}`;
}

exports.getCustomer = async function(email) {
    const uri = `v3/customers?email:in=${email}`;
    const options = await formatOptions('GET',uri);
    const result = await axios(options);
    return result;
}

exports.bcTime = async function() {
    const options = await formatOptions('GET', 'v2/time');
    const time = await axios(options);
    return time.data.time;
}

const formatOptions = async (method, uri, data = null ) => ({
    method,
    url: `${process.env.bgBaseUrl}/stores/${process.env.bgstoreHash}/${uri}`,
    headers: 
    { 
         Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Auth-Token': process.env.bgToken,
        'X-Auth-Client': process.env.bgclientID
    },
    ...(data !== null && {data})     
})

