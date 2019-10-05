const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const IssueDetails=new Schema({
    userId:{
        type:String,
        default:''
    },
    IssueId:{
        type:String,
        default:''
    },
    IssueTitle:{
        type:String,
        default:''
    },
    reporterName:{
        type:String,
        default:''
    },
    status:{
        type:String,
        default:''
    },
    description:{
        type:String,
        default:''
    },
    ProductImage:{
        type:String
    },
    Assignee:{
        type:String,
        default:""
    },
    comments:[],
    watchers:[],
    createdOn:{
        type:Date,
        default:''
    }
})

mongoose.model('Issues',IssueDetails)