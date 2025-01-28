const mongoose = require('mongoose')



const messageSchema = new mongoose.Schema({
    text:{
        type:String,
        default: ""
    },
    imageUrl:{
        type:String,
        default:""
    },
    videoUrl:{
        type:String,
        default:""
    }, 
    seen:{
        type:Boolean,
        default:false
    },
    msgByUserId:{
        type: mongoose.Schema.ObjectId,
        required:true,
        ref: "User"
    }
},{timestamps:true})




const conversationShecma = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.ObjectId,
        required:true,
        ref: "User"
    },
    receiver:{
        type: mongoose.Schema.ObjectId,
        required:true,
        ref: "User"
    },
    messages:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Message"
        }
    ]
},{timestamps:true})

const MessageModel =  mongoose.model('Message', messageSchema)
const ConversationModel =  mongoose.model('Conversation', conversationShecma);

module.exports = {
    ConversationModel,
    MessageModel
};