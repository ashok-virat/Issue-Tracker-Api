const express = require('express');
const app = express();
const http=require('http');
const appConfig=require('./app/Config/appConfig');
const fs=require('fs');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const globalErrorMiddleWare=require('./app/middleware/appErrorHandler');
const routeLoggerMiddleware=require('./app/middleware/routeLogger');

const logger=require('./app/libs/loggerLib');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use('/uploads',express.static('uploads'));

app.use(globalErrorMiddleWare.globalErrorHandler)
app.use(routeLoggerMiddleware.logIp)


let routePath='./app/route';

fs.readdirSync(routePath).forEach(function(file){
    if(file.indexOf('.js')){
        console.log('including the following files');
        console.log(routePath+'/'+file)
        let route=require(routePath+"/"+file);
        route.setRouter(app)
    }

})


app.use(globalErrorMiddleWare.globalNotFoundHandler)

//creating HTTP server

const server=http.createServer(app)
//start listening to http server

server.listen(appConfig.port)
server.on('error', onError)
server.on('listening', onListening)
//end server listening code
const socket=require('./app/libs/socketLib');
socket.setServer(server);


//error listener for http server 'error' event.
function onError(error){
    if(error.syscall !== 'listen')  {
        logger.captureError(error.code+'not equal Listen','serverOnErrorHandler',10)
        throw error;
    }
    switch(error.code) {
        case 'EACCES':
            logger.captureError(error.code+':elavated privilages required','serverOnErrorHandler',10)
            process.exit(1)
            break;
         case 'EADDRINUSE':
             logger.captureError(error.code,':port is already in use Ashok','serverOnErrorHandler',10)
             process.exit(1)
             break;
         default:
             logger.captureError(error.code+':some unknown error occured','serverOnErrorHandler',10)       
    }
}

//event listener for Http server 'listening' event;
    function onListening(){
        var addr=server.address()
        var bind=typeof addr === 'string'?'pipe'+addr:'port'+addr.port;
        ('Listening on'+bind)
        console.log(bind)
        logger.captureInfo('server listening on port'+addr.port,'serverListeningHandler',10)
    }


mongoose.connect(appConfig.db.uri, {useNewUrlParser: true});


mongoose.connection.on('error',function(err){
    console.log('database connection is error')
    console.log(err)
})

mongoose.connection.on('open',function(err){
   if(err){ 
       console.log('database error')
       console.log(err)
   } else {
       console.log('database connection is open success ')
   }
})