const userModel = require("../models/UserModel")
const bcrypt = require('bcryptjs')

async function registerUser(request,response) {
  try {

    const {name, email, profile_pic,password} = request.body

    const emailExist = await userModel.findOne({email})
    
    if(emailExist){
      return response.status(400).json({
        message: "User Already Exist",
        error:true
      })
    }

    //Hashing password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const payload ={
      name,
      email,
      password: hashPassword,
      profile_pic
    }

    const user = new userModel(payload)
    const userSave = await user.save()

    response.status(201).json({
      success:true,
      message:"User created succesfully",
      data: userSave
    })


  } catch (error) {
    return response.status(500).json({
        message:error.message || error,
        error:true
    })
  }
}

module.exports = registerUser
