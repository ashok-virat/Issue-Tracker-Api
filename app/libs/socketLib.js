const socketio=require('socket.io');
const mongoose=require('mongoose');
const userpath=require('./../models/user');
const userModel=mongoose.model('User');
const check=require('./../libs/checkLib');
const redisLib=require('./../libs/redisLib');

let setServer=(server)=>{
   
    let io=socketio.listen(server);
    let myio=io.of('');

    myio.on('connection',(socket)=>{
       

        socket.emit('verifyUser','');
        //coder to verify the user and make him online
           
        
        //setuser code is start
        socket.on('set-user',(userId)=>{
            userModel.findOne({userId:userId},(err,result)=>{
                if(err){
                    socket.emit('user-error',{status:403,message:'user is not found'})
                }
                else if(check.isEmpty(result)) {
                    socket.emit('user-error',{status:403,message:'user is not found'})
                }
                else {
                    let currentUser=result;

                    socket.userId=currentUser.userId;
                         
                    let fullName=`${currentUser.firstName} ${currentUser.lastName}`;

                    let key=currentUser.userId;
                     let value=fullName;
                     let setUserOnline=redisLib.setNewOnlineUserInHash('onlineUsers',key,value,(err,result)=>{
                         if(err){
                             console.log(err)
                         }
                         
                         else {
                             redisLib.getAllUsersInHash('onlineUsers',(err,result)=>{
                                 if(err){
                                     console.log(err)
                                 }
                                 else {
                                     socket.room='Issue-tracker';
                                     socket.join(socket.room)
                                     socket.to(socket.room).broadcast.emit('online-user-list',result);
                                 }
                             })
                         }
                     })
                }
            })
    })
      //setuser code is end
    
      
        //socet disconnect code start
        socket.on('disconnect',()=>{
            if(socket.userId){
            redisLib.deleteUserFromHash('onlineUsers',socket.userId);
            redisLib.getAllUsersInHash('onlineUsers',(err,result)=>{
                if(err){
                    console.log(err)
                }
                else {
                    socket.leave(socket.room)
                    socket.to(socket.room).broadcast.emit('online-user-list',result)
                }
            })
        }
           })
        //socket disconnect code end

        //Delete code start
        socket.on('Issue-Delete',(data)=>{
            console.log('issue delete is called')
            console.log(data);
           socket.broadcast.emit('Issue-Deleted-Notify',data)
        })
        //Delete code end

        //add comment code start
              socket.on('Add-Comment',(data)=>{
              socket.broadcast.emit('Comment-Notify',data)
                 })
        //add comment code is end
        
        //add watcher code start
        socket.on('Add-Watcher',(data)=>{
            socket.broadcast.emit('Add-Watcher-Notify',data)
        })
        //add watcher code end
        
        //edit notify code start
        socket.on('Edit-Issue',(data)=>{
            socket.broadcast.emit('Edit-Notify',data)
        })
        //edit notify code end

        
                })
}


module.exports={
    setServer:setServer
}