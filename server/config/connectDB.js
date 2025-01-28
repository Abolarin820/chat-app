const mongoose = require('mongoose')

async function connectDB() {
    try {

        await mongoose.connect(process.env.MONGODB_URL)
        // await mongoose.connect(`${process.env.LOCAL_URL}/chatApp`)
        const connection = mongoose.connection
        
        connection.on('connected', ()=>{
            console.log('Connected to DB');
        })

        connection.on('error', ()=>{
            console.log('Something went wrong in the Datatbase', error)
        })

    } catch (error) {
        console.log('Something went wrong', error);
    }
}

module.exports = connectDB; 