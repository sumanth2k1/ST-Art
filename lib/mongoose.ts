import mongoose from 'mongoose'

const connectionString:string = process.env.MONGO_DB ?? '';

export const dbConnection = async () =>{
    try {
        await mongoose.connect(connectionString)
    } catch (error) {
        console.log(error);
    }
}