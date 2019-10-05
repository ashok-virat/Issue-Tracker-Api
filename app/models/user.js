const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const userdetails=new Schema({
    resetId:{
        type:String,
        default:''
    },
    userId:{
        type:String,
        default:''
    },
    firstName:{
        type:String,
        default:''
    },
    lastName:{
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
    },
    password:{
        type:String,
        default:''
    },
    mobileNumber:{
        type:Number,
        default:''
    },
    createdOn:{
        type:Date,
        default:Date.now()
    }
})

mongoose.model('User',userdetails)