const shortid=require('shortid');
const mongoose=require('mongoose');
const passwordhashing=require('./../libs/hashpasswordLib');
const response=require('./../libs/responseLib');
const logger=require('./../libs/loggerLib');
const check=require('./../libs/checkLib');
const validation=require('./../libs/paramsvalidation');
const token=require('./../libs/tokenLib');
const userpath=require('./../models/user');
const userModel=mongoose.model('User');
const Authjs=require('./../models/Auth');
const AuthModel=mongoose.model('Auth');
const isuuepath=require('./../models/issues');
const IssueModel=mongoose.model('Issues');
const watcherpath=require('./../models/watcher');
const WatcherModel=mongoose.model('watcher');
const nodemailer=require('nodemailer');

//signup function is start
let signup=(req,res)=>{
    let validateuseremail=()=>{
        return new Promise((resolve,reject)=>{
      
            if(req.body.email){
               
            if(!validation.Email(req.body.email)){
                 logger.captureError('email does not meet requirement','email validation',8);
                 let apiResponse=response.response(true,'email does not meet requirement',404,null);
                 reject(apiResponse);
            }
            else if(check.isEmpty(req.body.email)){
                logger.captureError('email is not there','email validation',5);
                let apiResponse=response.response(true,'email is not there',400,null);
                reject(apiResponse);
            }
            else{
               
                resolve(req);
            }
            }
            else {
                logger.captureError('email parameter is missing','email validation',10);
                let apiResponse=response.response(true,'email parameter is missing',403,null);
                reject(apiResponse);
            }
        })
    }
    let validateuserpassword=()=>{
        return new Promise((resolve,reject)=>{
         
            if(req.body.password){
               
            if(!validation.Password(req.body.password)){
                 logger.captureError('password not meet requirement','email validation',8);
                 let apiResponse=response.response(true,'password does not meet requirement',404,null);
                 reject(apiResponse);
            }
            else if(check.isEmpty(req.body.password)){
                logger.captureError('password is not there','email validation',5);
                let apiResponse=response.response(true,'password is not there',400,null);
                reject(apiResponse);
            }
            else{
               
                resolve(req);
            }
            }
            else {
                logger.captureError('password parameter is missing','email validation',10);
                let apiResponse=response.response(true,'password parameter is missing',403,null);
                reject(apiResponse);
            }
        })
    }

    
  
   let createUser=()=>{
       return new Promise((resolve,reject)=>{
           userModel.findOne({email:req.body.email})
           .exec((err,emailDeatils)=>{
               if(err){
                logger.captureError('some error occured','createuser',10);
                   let apiResponse=response.response(true,err.message,400,null);
                   reject(apiResponse);
               }
               else if(check.isEmpty(emailDeatils)){
                   let createuser=new userModel({
                            resetId:shortid.generate(),
                            userId:shortid.generate(),
                            firstName:req.body.firstName,
                            lastName:req.body.lastName,
                            mobileNumber:req.body.mobileNumber,
                            email:req.body.email,
                            password:passwordhashing.hashpassword(req.body.password),
                            createdOn:Date.now()
                   })
                   createuser.save((err,createuser)=>{
                       if(err){
                        logger.captureError('error','createuser',10);
                           let apiResponse=response.response(true,err.message,403,null)
                           reject(apiResponse)
                       }
                       else{
                           let object=createuser.toObject();
                       
                           resolve(object);
                           
                       }
                   })
               }
               else {
                logger.captureError('email is already present','createuser',10);
                   let apiResponse=response.response(true,'email is already present',500,null);
                   reject(apiResponse);
               }
           })
       })
   }

       validateuseremail(req,res)
        .then(validateuserpassword)
       .then(createUser)
       .then((resolve)=>{

           delete resolve.password;
           logger.captureInfo('signup succesfully','signup',10);
           let apiResponse=response.response(false,'signup succesfully',200,resolve);
           res.send(apiResponse);
       })
       .catch((reject)=>{
           res.send(reject);
       })
}

//signup function end




//signin function is start

let signin=(req,res)=>{
    
    let checkemail=()=>{
        return new Promise((resolve,reject)=>{
             if(req.body.email){
                 userModel.findOne({email:req.body.email},(err,result)=>{
                     if(err){
                        logger.captureError(err.message,'checkmail',8);
                         let apiResponse=response.response(true,err.message,404,null)
                         reject(apiResponse)
                     }
                     else if(check.isEmpty(result)){
                        logger.captureError('user not found','checkmail',8);
                         let apiResponse=response.response(true,'user not found',400,null)
                         reject(apiResponse)
                     }
                     else {
                         resolve(result)
                     }
                 })
             }
             else {
                logger.captureError('Email parameter is missing','checkmail',8);
                 let apiResponse=response.response(true,'Email parameter is missing',500,null)
                 reject(apiResponse)
             }
        })
    }
    let checkpassword=(userDetails)=>{
        return new Promise((resolve,reject)=>{
            if(req.body.password){
                passwordhashing.comparepassword(req.body.password,userDetails.password,(err,result)=>{
                    if(err){
                        logger.captureError("password is not match",'checkpassword',8);
                        let apiResponse=response.response(true,"password is not match",404,null)
                        reject(apiResponse)
                    }
                    else if(result){
                        let newuserDetails=userDetails.toObject();
                        delete newuserDetails.password;
                        delete newuserDetails.__v;
                        delete newuserDetails._id;
                        resolve(newuserDetails);
                    }
                    else {
                        logger.captureError('Log In Failed.Wrong Password','checkpassword',8);
                        let apiResponse=response.response(true,'Log In Failed.Wrong Password',400,null)
                        reject(apiResponse)
                    }
                })
            }
            else {
                logger.captureError('passeord parrameter is missing','checkpassword',8);
                let apiResponse=response.response(true,'passeord parrameter is missing',404,null)
                reject(apiResponse)
            }
        })
    } 

    let generatetoken=(newuserDetails)=>{
        return new Promise((resolve,reject)=>{
             token.generateToken(newuserDetails,(err,tokenDetails)=>{
                 if(err){
                    logger.captureError('some error occured','genertae token',8);
                    let apiResponse=response.response(true,'token is not generated',400,null)
                    reject(apiResponse)
                 }
                 else {
                     tokenDetails.userId=newuserDetails.userId;
                     tokenDetails.userDetails=newuserDetails;
                   
                     resolve(tokenDetails);
                 }
             })
        })
    }
    let saveToken=(tokenDetails)=>{
        
        return new Promise((resolve,reject)=>{
            AuthModel.findOne({userId:tokenDetails.userId},(err,retrievedUserSetails)=>{
                if(err){
                    logger.captureError(err.message,'userController:saveToken',10)
                    let apiResponse=response.generate(true,'Failed to Generate Token',500,null)
                    reject(apiResponse)
                }
                else if(check.isEmpty(retrievedUserSetails)) {
                    let newAuthToken=new AuthModel({
                        userId:tokenDetails.userId,
                        authToken:tokenDetails.token,
                        tokenSecret:tokenDetails.tokenSecret,
                        tokenGenerationTime:Date.now()
                    })
                   
                    newAuthToken.save((err,newTokenDetails)=>{
                        if(err){
                            logger.captureError(err.message,'userController:saveToken()',10)
                            let apiResponse=response.generate(true,'Failed To Generate Token',500,null)
                            reject(apiResponse)
                        }
                        else{
                            let responseBody={
                                authToken:newTokenDetails.authToken,
                                userDetails:tokenDetails.userDetails
                            }
                            
                            resolve(responseBody)
                        }
                    })
                }else {
                    retrievedUserSetails.authToken=tokenDetails.token;
                    retrievedUserSetails.tokenSecret=tokenDetails.tokenSecret;
                    retrievedUserSetails.tokenGenerationTime=Date.now();
                    retrievedUserSetails.save((err,newTokenDetails)=>{
                             if(err){
                                 logger.captureError(err.message,'userController:saveToken()',10)
                                 let apiResponse=response.generate(true,'Failed To Generate Token',500,null)
                                 reject(apiResponse)
                             }
                             else {
                                   let responseBody={
                                    authToken:newTokenDetails.authToken,
                                    userDetails:tokenDetails.userDetails
                                   }
                                  
                                   resolve(responseBody)
                             }
                    })
                    
                }
            })
        })
    
    }
       
    checkemail(req,res)
    .then(checkpassword)
    .then(generatetoken)
    .then(saveToken)
    .then((resolve)=>{
        
        let apiResponse=response.response(false,'signin successfully',200,resolve);
        res.send(apiResponse)
    })
    .catch((reject)=>{
  
    res.send(reject)
   
    })
}
//sign in function end


//google signup code start

let googlesignup=(req,res)=>{
     
    let savedata=()=>{
        return new Promise((resolve,reject)=>{
            if(req.body.email){
                userModel.findOne({email:req.body.email},(err,result)=>{
                    if(err){
                        logger.captureError(err.message,'find user',8)
                    let apiResponse=response.generate(true,'some error occured',403,null)
                    reject(apiResponse)
                    }
                    else if(check.isEmpty(result)){
                        let createuser=new userModel({
                            resetId:shortid.generate(),
                            userId:shortid.generate(),
                            firstName:req.body.firstName,
                            lastName:req.body.lastName,
                            email:req.body.email,
                            createdOn:Date.now()
                   })
                    createuser.save((err,data)=>{
                        if(err){
                            logger.captureError(err.message,'save data',8)
                            let apiResponse=response.generate(true,'some error occured',403,null)
                            reject(apiResponse)
                        }
                        else {
                            let object=data.toObject();
                            resolve(object);
                        }
                    })
                    }
                    else {
                        resolve(result);
                    }
                  
                })
            }
            else {
                logger.error('email parameter is missing','createuser', 6)
                let apiResponse = response.response(true, 'email parameter is Missing', 403, null)
                reject(apiResponse)
            }
        })
    
    } 
    let generatetoken=(newuserDetails)=>{
        return new Promise((resolve,reject)=>{
             token.generateToken(newuserDetails,(err,tokenDetails)=>{
                 if(err){
                    logger.captureError('some error occured','genertae token',8);
                    let apiResponse=response.response(true,'token is not generated',400,null)
                    reject(apiResponse)
                 }
                 else {
                     tokenDetails.userId=newuserDetails.userId;
                     tokenDetails.userDetails=newuserDetails;
                     resolve(tokenDetails);
                 }
             })
        })
    }
    let saveToken=(tokenDetails)=>{
        
        return new Promise((resolve,reject)=>{
            AuthModel.findOne({userId:tokenDetails.userId},(err,retrievedUserSetails)=>{
                if(err){
                    logger.captureError(err.message,'userController:saveToken',10)
                    let apiResponse=response.generate(true,'Failed to Generate Token',500,null)
                    reject(apiResponse)
                }
                else if(check.isEmpty(retrievedUserSetails)) {
                    let newAuthToken=new AuthModel({
                        userId:tokenDetails.userId,
                        authToken:tokenDetails.token,
                        tokenSecret:tokenDetails.tokenSecret,
                        tokenGenerationTime:Date.now()
                    })
                   
                    newAuthToken.save((err,newTokenDetails)=>{
                        if(err){
                            logger.captureError(err.message,'userController:saveToken()',10)
                            let apiResponse=response.generate(true,'Failed To Generate Token',500,null)
                            reject(apiResponse)
                        }
                        else{
                            let responseBody={
                                authToken:newTokenDetails.authToken,
                                userDetails:tokenDetails.userDetails
                            }
                            
                            resolve(responseBody)
                        }
                    })
                }else {
                    retrievedUserSetails.authToken=tokenDetails.token;
                    retrievedUserSetails.tokenSecret=tokenDetails.tokenSecret;
                    retrievedUserSetails.tokenGenerationTime=Date.now();
                    retrievedUserSetails.save((err,newTokenDetails)=>{
                             if(err){
                                 logger.captureError(err.message,'userController:saveToken()',10)
                                 let apiResponse=response.generate(true,'Failed To Generate Token',400,null)
                                 reject(apiResponse)
                             }
                             else {
                                   let responseBody={
                                    authToken:newTokenDetails.authToken,
                                    userDetails:tokenDetails.userDetails
                                   }
                                   resolve(responseBody)
                             }
                    })
                    
                }
            })
        })
    
    }
    savedata(req,res)
    .then(generatetoken)
    .then(saveToken)
    .then((resolve)=>{
        let apiResponse=response.response(false,'signin successfully',200,resolve);
        res.send(apiResponse)
    })
    .catch((reject)=>{
  
    res.send(reject)
   
    })
}

//google signup code end


//create Issue code start
let createIssue=(req,res)=>{
     userModel.findOne({userId:req.body.userId},(err,result)=>{
         if(err){
            logger.captureError(err.message,'createIssue',10)
            let apiResponse=response.response(true,'some error occured',500,null)
            res.send(apiResponse)
         }
         else {
             let createnewIssue=new IssueModel({
                 userId:result.userId,
                 IssueId:shortid.generate(),
                 IssueTitle:req.body.IssueTitle,
                 reporterName:`${result.firstName} ${result.lastName}`,
                 status:req.body.status,
                 description:req.body.description,
                 ProductImage:req.file.path,
                 Assignee:req.body.Assignee,
                 createdOn:Date.now()
             })
             createnewIssue.save((err,result)=>{
                if(err){
                    logger.captureError(err.message,'create Issue',7)
                    let apiResponse=response.response(true,'Issue is not created',403,null)
                    res.send(apiResponse)
                }
                else {
                    let apiResponse=response.response(false,'Issue is Registered',200,result);
                    res.send(apiResponse)
                }
             })
         }
     })
}
//create Issue code end

//get allIssue code start
let getallIssue=(req,res)=>{
    IssueModel.find()
    .lean()
    .exec((err,result)=>{
        if(err){
            logger.captureError(err.message,'getallIssue',7)
            let apiResponse=response.response(true,'some error occured',400,null)
            res.send(apiResponse)
        }
        else if(check.isEmpty(result)){
            let apiResponse=response.response(true,'some error occured',400,null)
            res.send(apiResponse)
        }
        else {
            let apiResponse=response.response(false,'Issues are listed',200,result);
            res.send(apiResponse)
        }
    })
}
//get allIssue code end

//get allusers code start
let getallusers=(req,res)=>{
    userModel.find()
    .lean()
    .exec((err,result)=>{
        if(err){
            logger.captureError(err.message,'getallusers',8)
            let apiResponse=response.response(true,'some error occured',500,null)
            res.send(apiResponse)
        }
        else if(check.isEmpty(result)){
            let apiResponse=response.response(true,'user List is empty',400,null)
            res.send(apiResponse)
        }
        else {
            let apiResponse=response.response(false,'users are listed',200,result);
            res.send(apiResponse)
        }
    })
}
//get allusers code end


//getusersIssue code start
let getusersIssue=(req,res)=>{
    IssueModel.find({userId:req.params.userId},(err,result)=>{
        if(err){
            logger.captureError(err.message,'getusersIssue',3)
            let apiResponse=response.response(true,'some error occured',403,null)
            res.send(apiResponse)
        }
        else if(check.isEmpty(result)){
            let apiResponse=response.response(true,'No Issues',500,null)
            res.send(apiResponse)
        }
        else {
            let apiResponse=response.response(false,'Issues are listed',200,result);
            res.send(apiResponse)
        }
    })
}
//getusersIssue code end


//get single Issue code start
let getsingleIssue=(req,res)=>{
    IssueModel.findOne({IssueId:req.params.IssueId},(err,result)=>{
        if(err){
            logger.captureError(err.message,'getsingleIssue',3)
            let apiResponse=response.response(true,'some error occured',500,null)
            res.send(apiResponse)
        }
        else if(check.isEmpty(result)){
            let apiResponse=response.response(true,'No Issue',403,null)
            res.send(apiResponse)
        }
        else {
            let apiResponse=response.response(false,'Successfully getting single Issue',200,result);
            res.send(apiResponse)
        }
    })
}
//get single Issue code end


//commentIssue code start
let commentIssue=(req,res)=>{
    IssueModel.findOne({IssueId:req.body.IssueId},(err,result)=>{
       if(result) {
        if(err){
            logger.captureError(err.message,'comment issue',3)
            let apiResponse=response.response(true,'some error occured',500,null)
            res.send(apiResponse)
        }
        else if(check.isEmpty(result)){
            let apiResponse=response.response(true,'No Issue',403,null)
            res.send(apiResponse)
        }
        else {
            result.comments=result.comments.concat(req.body);
            result.save((err,result)=>{
                if(err){
                    logger.captureError(err.message,'comment issue',3)
                    let apiResponse=response.response(true,'some error occured',500,null)
                    res.send(apiResponse)
                }
                else if(check.isEmpty(result)){
                    let apiResponse=response.response(true,'comment is not added',403,null)
                    res.send(apiResponse)
                }
                else {
                    let apiResponse=response.response(false,'comment is successfully',200,result);
                    res.send(apiResponse)
                }
            })
            
        }
       }
    })
}
//comment Issue code end


//delete Issue code start
let deleteIssue=(req,res)=>{
   IssueModel.deleteOne({IssueId:req.body.IssueId},(err,result)=>{
    if(err){
        logger.captureError(err.message,'deleteleIssue',3)
        let apiResponse=response.response(true,'some error occured',500,null)
        res.send(apiResponse)
    }
    else if(check.isEmpty(result)){
        let apiResponse=response.response(true,'No Issue Is Found',403,null)
        res.send(apiResponse)
    }
    else {
        let apiResponse=response.response(false,'Issue Is Deleted Suceessfully',200,result);
        res.send(apiResponse)
    }
   })
}
//delete Issue code end


//update Issue code start
let updateIssue=(req,res) => {
        let options=req.body;
        if (req.file) {
             options.ProductImage = req.file.path;
        }
        IssueModel.update({IssueId:req.params.IssueId},options,{multi:true}).exec((err,result)=>{
            if(err){
                logger.captureError(err.message,'update Issue',6)
                let apiResponse=response.response(true,'some error occured',500,null)
                res.send(apiResponse)
            }
            else {
                let apiResponse=response.response(false,'Issue Is Updated Suceessfully',200,result);
                res.send(apiResponse)
            }
        })
}
//update Issue code end


//add watcher code start
let addwatcher=(req,res)=>{
     if(req.body.watcherId!=req.body.receiverId){
         WatcherModel.find({IssueId:req.body.IssueId,watcherId:req.body.watcherId,receiverId:req.body.receiverId},(err,result)=>{
            if(err){
                logger.captureError(err.message,'add Watchers',4);
                let apiResponse=response.response(true,'some error occured',500,null)
                res.send(apiResponse)
         }
         else if(check.isEmpty(result)){
                let createwatcher=new WatcherModel({
                     watcherId:req.body.watcherId,
                     receiverId:req.body.receiverId,
                     watcherName:req.body.watcherName,
                     IssueId:req.body.IssueId,
                     watchedOn:Date.now()
                })
                createwatcher.save((err,result)=>{
                    if(err){
                        logger.captureError(err.message,'add Watchers',6);
                        let apiResponse=response.response(true,'some error occured',500,null)
                        res.send(apiResponse)
                    }
                    else {
                        let apiResponse=response.response(false,'You Are Added Watcher List',200,result)
                        res.send(apiResponse)
                    }
                })
               }
         else {
             let apiResponse=response.response(true,'Already You Are Watcher',403,null);
             res.send(apiResponse)
         }
         })
        }
        else {
            let apiResponse=response.response(true,"This Is Your Issue So Can't Added",500,null)
                res.send(apiResponse)
        }
    }
   //add watcher code end
   
   
//get watcher code start
let getwatcherlist=(req,res)=>{
     WatcherModel.find({IssueId:req.params.IssueId},(err,result)=>{
        if(err){
            logger.captureError(err.message,'get watcher list',7)
            let apiResponse=response.response(true,'some error occured',500,null)
            res.send(apiResponse)
        }
        else if(check.isEmpty(result)){
            let apiResponse=response.response(true,'No Watchers On This Issue',403,null)
            res.send(apiResponse)
        }
        else {
            let apiResponse=response.response(false,'Watchers Are Listed',200,result);
            res.send(apiResponse)
        }
     })
}
//get watcher code end


//reset code start
let resetcode=(req,res)=>{     
    let findmaildetails=()=>{
        return new Promise((resolve,reject)=>{
            if(req.body.email){
                
                userModel.findOne({email:req.body.email},(err,result)=>{
                    if(err){
                        logger.captureError('some error occured','findemaildetails',9)
                        let apiResponse=response.response(true,'some error occured',400,null)
                        reject(apiResponse)
                    }
                    else if(check.isEmpty(result)){
                        let apiResponse=response.response(true,'User is not found',403,null)
                        res.send(apiResponse)
                    }
                    else  {
                            let resetnumber=Math.floor(Math.random() * (99999-10000+1)) +1000;
                             result.resetId=resetnumber;
                                result.save((err,result)=>{
                                    if(err){
                                        logger.captureError('some error occured','fimdemaildetails',5)
                                        let apiResponse=response.response(true,'some error occured',500,null)
                                        reject(apiResponse)
                                    }
                                    else {
                                        resolve(req)
                                    }
                                })
                            }
                        })
            }
          else {
            logger.captureError('some error occured','findemaildetails',7)
            let apiResponse=response.response(true,'Email parameter is missing',500,null)
            reject(apiResponse)
          }
        })
    }
    //reset code end


  //send mail code start 
  let sendmail=()=>{
      return new Promise((resolve,reject)=>{
          userModel.findOne({email:req.body.email},(err,result)=>{
              if(err){
                logger.captureError('some error occured','sendmail',8)
                let apiResponse=response.response(true,'some error occured',400,null)
                reject(apiResponse)
              }
              else if(check.isEmpty(result)){
                let apiResponse=response.response(true,'Code is not found',500,null)
                res.send(apiResponse)
            }
              else {
                  
                let transporter=nodemailer.createTransport({
                    service:'gmail',
                    auth:{
                        user:'ashokbejo01@gmail.com',
                        pass:'ashokbejo01@10@97'
                    }
                });
                let mailOptions={
                    from:'"Issue Tracker App"',
                    to:result.email,
                    subject:'"Welcome to Issue-Tracker app"',
                    html:`<p>YOUR RESET PASSWORD CODE IS</p> <h1>${result.resetId}</h1>`
                }
                transporter.sendMail(mailOptions,function(err,data){
                    if(err){
                        logger.captureError('some error occured','sendmail',9)
                        let apiResponse=response.response(true,'some error occured',500,null)
                        reject(apiResponse)
                    }
                    else {
                        resolve('Reset Code send successfully')
                    }
                })
              }
          })
      })
  }
     findmaildetails(req,res)
     .then(sendmail)
   .then((resolve)=>{
       let apiResponse=response.response(false,'Reset code send your Email',200,resolve);
       res.send(apiResponse);
   })
   .catch((reject)=>{
       res.send(reject);
   })
}
//send mail code end



//resetpassword code start
let resetpassword=(req,res)=>{
    if(req.body.resetId){
        userModel.findOne({resetId:req.body.resetId},(err,result)=>{
            if(err){
                logger.captureError('some error occured','Reset password',5)
                let apiResponse=response.response(true,'Reset code is Wrong',403,null)
                res.send(apiResponse)
            }
            else if(check.isEmpty(result)){
                let apiResponse=response.response(true,'Reset code is Wrong',500,null)
                res.send(apiResponse)
            }
            else {
                 result.password=passwordhashing.hashpassword(req.body.password);
                 let resetnumber=Math.floor(Math.random() * (99999-10000+1)) +1000;
                 result.resetId=resetnumber;
                        result.save((err,result)=>{
                            if(err){
                                logger.captureError('some error occured','Reset password',5)
                                let apiResponse=response.response(true,'Reset code is Wrong',500,null)
                                res.send(apiResponse)
                            }
                            else {
                                let apiResponse=response.response(false,'Your Password Is Reset Successfully',200,result)
                                res.send(apiResponse)
                            }
                        })
            }
        })
    }
       else {
        let apiResponse=response.response(true,'Reset code is Missing',403,null)
        res.send(apiResponse)
       }
}
//resetpassword code end

module.exports={
    signup:signup,
    signin:signin,
    googlesignup:googlesignup,
    createIssue:createIssue,
    getallIssue:getallIssue,
    getallusers:getallusers,
    getusersIssue:getusersIssue,
    getsingleIssue:getsingleIssue,
    commentIssue:commentIssue,
    deleteIssue:deleteIssue,
     updateIssue:updateIssue,
     addwatcher:addwatcher,
     getwatcherlist:getwatcherlist,
     resetcode:resetcode,
     resetpassword:resetpassword
}