const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// define a schema for your data
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,"Name is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true,"Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true,"Password is required"],
  },
  status:{
    type: Boolean,
    default:true
  },
  pic:{
    type: String,
    default:null
  },
  phone:{
    type: String,
  },
  favorites: {
    matches:{type:Array},
    competitions: {type:Array},
    teams: {type:Array}
  },
  premiumSubscription:{
    activated:{type:Boolean,default:false},
    expires:{type:Date,default:null}
  }
});    

userSchema.pre("save", async function (next) {
  // const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, 10);
  next()
});

userSchema.statics.login = async function(name,email,password){
  if(name==='' && email==='')
    throw Error("Please enter name or email!")
  if(password==='')
    throw Error("Password cannot be empty!")
  const user = await this.findOne(name==''?{email}:{name});
  if(user){
    const auth = await bcrypt.compare(password,user.password)
    if(user.status==false){
      throw Error("User is Blocked!")
    }
    if(auth){
      return user;
    }
    console.log(password,user.password)
    throw Error("incorrect Password")
  }
  throw Error("incorrect Username or Email")
}

module.exports = mongoose.model("Users", userSchema);
