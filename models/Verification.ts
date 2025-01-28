const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const VerifcationSchema = mongoose.Schema({
    owner: {
        type: String,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailRegex.test(value);
            },
            message: "Invalid email format",
        },
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        expires: 60,
        default: Date.now
    }
});

VerifcationSchema.pre('save', async function(next){
    if(this.isModified('token')){
        const hashedToken = await bcrypt.hash(this.token,10);
        this.token = hashedToken;
    }
    next();
})

VerifcationSchema.methods.compareToken = async function (token){
    const result = await bcrypt.compareSync(token, this.token);
    return result;
}



const VerifyLogin = mongoose.model('VerifyLogin', VerifcationSchema); 
module.exports = VerifyLogin;