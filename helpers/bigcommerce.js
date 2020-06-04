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
        first_name: customer.first_name,
        last_name: customer.last_name,
    }];
    const options = await formatOptions('POST','v3/customers',data);
    const createdCustomer = await axios(options);
    const attrId = await this.getCustomerAttributeId('token');
    const result = await this.updateCustomerAttrValue(attrId, customer.accessToken,createdCustomer.data.data[0].id); 
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
    const token = jwt.sign(payload, process.env.bgclientSecret, {algorithm:'HS256'});
    return token;
    //return `${process.env.bgstoreUrl}/login/token/${token}`;
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

exports.getCustomerAttributeId = async (attributeName) => {
    const url = `v3/customers/attributes?name=${attributeName}`
    const options = await formatOptions('GET', url);
    const result = await axios(options);
    if (result.data.data.length !== 0) { 
        return result.data.data[0].id;
    } else {
        return await this.createCustomerAttribute(attributeName)
    }
}

exports.createCustomerAttribute = async (attributeName) => {
    const url = `v3/customers/attributes`;
    const data = [
        {
            name: attributeName,
            type: "string"
        }
    ];
    const options = await formatOptions('POST', url, data);
    const result = await axios(options);
    if (result.data.data.length !== 0) { 
        return result.data.data[0].id;
    }
}

exports.updateCustomerAttrValue = async (attribute_id, value, customer_id) => {
    const url = `v3/customers/attribute-values`;
    const data = [
        {
            attribute_id,
            value,
            customer_id
        }
    ];
    const options = await formatOptions('PUT', url, data);
    const result = await axios(options);
    return result;
}

exports.getCustomerAttributeValue = async (customer_id, attrName) => {
    const url = `v3/customers/attribute-values?customer_id:in=${customer_id}&name=${attrName}`
    const options = await formatOptions('GET', url);
    const result = await axios(options);
    return result.data;
}

const formatOptions = async (method, url, data = null ) => ({
    method,
    url: `${process.env.bgBaseUrl}/stores/${process.env.bgstoreHash}/${url}`,
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

