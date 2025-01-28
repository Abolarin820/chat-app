const userModel = require("../models/UserModel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



async function checkPassword(request, response) {
  try {
    const {password, userId} = request.body

    const user = await userModel.findById(userId)
    const verifyPassword = await bcrypt.compare(password, user.password)
    
    if(!verifyPassword){
        return response.status(400).json({
            success:false,
            message:"Invalid credentials",
            error:true,
          console.log(error)
        })
      
    }

    const tokenData ={
        id: user._id,
        email:user.email
    } 
    const token = await jwt.sign(tokenData, process.env.JWT_SECRETE_KEY, {expiresIn:'1d'})

 
    const cookieOption ={
        http:true, 
        secure:true
    } 

    return response.cookie('token',token,cookieOption).status(200).json({
        success:true,
        message:"Login successfully",
        token:token
    })

  } catch (error) {
    return response.status(500).json({
        message:error.message || error,
        error:true
    })
  }
}

module.exports = checkPassword
