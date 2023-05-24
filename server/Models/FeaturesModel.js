const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the chat schema
const featureSchema = new Schema({
  ads:{
    normal:{type:Boolean,default:true},
    premium:{type:Boolean,default:false}
  },
  matchStats:{
    normal:{type:Boolean,default:false},
    premium:{type:Boolean,default:true}
  },
  matchLineUps:{
    normal:{type:Boolean,default:false},
    premium:{type:Boolean,default:true}
  },
  matchH2h:{
    normal:{type:Boolean,default:false},
    premium:{type:Boolean,default:true}
  },
  teamMatches:{
    normal:{type:Boolean,default:false},
    premium:{type:Boolean,default:true}
  },
  teamTables:{
    normal:{type:Boolean,default:false},
    premium:{type:Boolean,default:true}
  },
  teamNews:{
    normal:{type:Boolean,default:false},
    premium:{type:Boolean,default:true}
  },
  teamStats:{
    normal:{type:Boolean,default:false},
    premium:{type:Boolean,default:true}
  }
});

// Create the chat model
module.exports = mongoose.model("Features", featureSchema);
