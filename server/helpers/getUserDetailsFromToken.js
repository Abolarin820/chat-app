const jwt = require('jsonwebtoken')
const userModel = require('../models/UserModel')

const getUserDetailsFromToken = async (token) => {
  
    if(!token){
        return {
            message:"session out",
            logout:true
        }
    } 

    const decode = await jwt.verify(token, process.env.JWT_SECRETE_KEY)
    const user = await userModel.findById(decode.id).select('-password')

    return user

}

module.exports = getUserDetailsFromToken;

