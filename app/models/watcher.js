const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const watchersdetails=new Schema({
    watcherId:{
        type:String,
        default:''
    },
    receiverId:{
        type:String,
        default:''
    },
    IssueId:{
        type:String,
        default:''
    },
    watcherName:{
        type:String,
        default:''
    },
    watchededOn:{
        type:Date,
        default:Date.now()
    }
})

mongoose.model('watcher',watchersdetails)