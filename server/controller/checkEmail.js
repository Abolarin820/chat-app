const userModel = require("../models/UserModel")


async function checkEmail(request, response) {
  try {
    const {email} = request.body
    const checkEmail = await userModel.findOne({email}).select('-password')

    if(!checkEmail){
        return response.status(400).json({
            success:false,
            message:"user does not exist",
            error:true
        })
    }

    return response.status(200).json({
        success:true,
        message:"Email verified",
        data: checkEmail
    })


  } catch (error) {
    return response.status(500).json({
        message:error.message || error,
        error:true
    })
  }
}

module.exports = checkEmail