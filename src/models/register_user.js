const {Schema,model, default: mongoose} = require('mongoose')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    first_name: {
        type:String,
        required:true
    },

    last_name: {
        type: String,
        required:true
    },

    email: {
        type: String,
        required:true,
        unique:true
    },

    password: {
        type: String,
        required:true
    },

    phonenumber: {
        type: Number,
        required: true,
        unique: true    
    },

    tokens: [{
        token:{
            type: String,
            required:true
        }
    }],
})

// const Register = new mongoose.model("User", userSchema)

//generating tokens
userSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, "process.env.SECRET_KEY")

        this.tokens = this.tokens.concat({token:token});
        await this.save();
        // console.log(token);
        return token;
    } 
    
    catch (error) {
        res.send("The error part" + error);
        console.log("the Error part" + error);
    }
}

// Converting password into hash
userSchema.pre("save", async function(next){

    if(this.isModified("password"))
    {
        // const passwordHash = await bcrypt.hash(password, 10);
        console.log(`The current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`The password is ${this.password}`);
    }
    
    next();
})

const user = model('user',userSchema)

module.exports = user