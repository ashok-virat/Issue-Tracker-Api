const appConfig=require('./../Config/appConfig');
const controller=require('./../controller/userController');
const multer = require('multer');
const authorization=require('./../middleware/auth');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})



let setRouter=(app)=>{
    let baseUrl=`${appConfig.apiVersion}/users`;

    app.post(`${baseUrl}/signup`,controller.signup);
     /**
     * @api {post} /api/v1/users/signup Signup
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * @apiParam {String} firstName of the user passed as a body parameter
     * @apiParam {String} lastName of the user passed as a body parameter
     * @apiParam {String} email of the user passed as a body parameter
     * @apiParam {String} password of the user passed as a body parameter
     * @apiParam {Number} mobileNumber of the user passed as a body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"signup successfully",
     *   "status":200,
     *   "data": [
     *             {
     *             firstName:"string",
     *             lastName:"string",
     *             userId:"string",
     *             mobileNumber:"number"
     *             }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":500/403/400,
     *      "data":null
     *    }
     */



    app.post(`${baseUrl}/signin`,controller.signin);
    /**
     * @api {post} /api/v1/users/signin Signin
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * @apiParam {String} email of the user passed as a body parameter
     * @apiParam {String} password of the user passed as a body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"signin successfully",
     *   "status":200,
     *   "data": [
     *              {
     *                userId:"string",
     *                firstName:"string",
     *                lastName:"string",
     *                email:"string",
     *                userId:"string",
     *                mobileNumbernumber:"number"
     *              }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */




    app.post(`${baseUrl}/googlesignup`,controller.googlesignup);

    app.post(`${baseUrl}/createIssue/:authToken`,authorization.isAuthorized,upload.single('ProductImage'),controller.createIssue);
    /**
     * @api {post} /api/v1/users/createIssue/:authToken Create Issue
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * @apiParam {String} IssueTitle of the user passed as a body parameter
     * @apiParam {String} Description of the user passed as a body parameter
     * @apiParam {String} ProductImage of the user passed as a body parameter
     * @apiParam {String} Status of the user passed as a body parameter
     * @apiParam {String} Assignee of the user passed as a body parameter
     * @apiParam {String} authToken of the user passed as a url parameter
     * 
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Issue is Registered",
     *   "status":200,
     *   "data": [
     *              {
     *                userId:"string",
     *                IssueId:"string"
     *                IssueTitle:"string",
     *                description:"string",
     *                ProductImage:"string",
     *                reporterName:"string",
     *                status:"string",
     *                Assignee:"string",
     *                watchers:"array",
     *                comments:"array"
     *              }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */



    app.get(`${baseUrl}/allIssues/:authToken`,authorization.isAuthorized,controller.getallIssue);
    /**
     * @api {get} /api/v1/users/allIssues/:authToken Get All Issues
     * @apiVersion 0.0.1
     * @apiGroup get
     * 
     * 
     *  @apiParam {String} authToken of the user passed as a URl parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Issues Are listed",
     *   "status":200,
     *   "data": [
     *              {
     *                userId:"string",
     *                IssueId:"string"
     *                IssueTitle:"string",
     *                description:"string",
     *                ProductImage:"string",
     *                reporterName:"string,"
     *                status:"string",
     *                Assignee:"string",
     *                watchers:"array",
     *                comments:"array"
     *              }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */




    app.get(`${baseUrl}/allUsers/:authToken`,authorization.isAuthorized,controller.getallusers);
    /**
     * @api {get} /api/v1/users/allusers/:authToken Get All Users
     * @apiVersion 0.0.1
     * @apiGroup get
     * 
     * 
     *  @apiParam {String} authToken of the user passed as a URl parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Users Are Listed",
     *   "status":200,
     *   "data": [
     *              {
     *                userId:"string",
     *                IssueId:"string"
     *                IssueTitle:"string",
     *                description:"string",
     *                reporterName:"string",
     *                ProductImage:"string",
     *                status:"string",
     *                Assignee:"string",
     *                watchers:"array",
     *                comments:"array"
     *              }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */



    app.get(`${baseUrl}/getmyIssue/:userId/:authToken`,authorization.isAuthorized,controller.getusersIssue);
     /**
     * @api {get} /api/v1/users/getmyIssue/:userId/:authToken Get User Issue
     * @apiVersion 0.0.1
     * @apiGroup get
     * 
     * 
     * @apiParam {String} authToken of the user passed as a URl parameter
     * @apiParam {String} userId of the user passed as a URl parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Issues are listed",
     *   "status":200,
     *   "data": [
     *              {
     *                userId:"string",
     *                IssueId:"string"
     *                IssueTitle:"string",
     *                description:"string",
     *                reporterName:"string",
     *                ProductImage:"string",
     *                status:"string",
     *                Assignee:"string",
     *                watchers:"array",
     *                comments:"array"
     *              }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */




    app.get(`${baseUrl}/getsingleIssue/:IssueId/:authToken`,authorization.isAuthorized,controller.getsingleIssue);
    /**
     * @api {get} /api/v1/users/getsingleIssue/:IssueId/:authToken Get Single Issue
     * @apiVersion 0.0.1
     * @apiGroup get
     * 
     * 
     * @apiParam {String} authToken of the user passed as a URl parameter
     * @apiParam {String} IssueId of the user passed as a URl parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Successfully getting single Issue",
     *   "status":200,
     *   "data": [
     *              {
     *                userId:"string",
     *                IssueId:"string"
     *                IssueTitle:"string",
     *                description:"string",
     *                reporterName:"string",
     *                ProductImage:"string",
     *                status:"string",
     *                Assignee:"string",
     *                watchers:"array",
     *                comments:"array"
     *              }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */




    app.post(`${baseUrl}/comment`,authorization.isAuthorized,controller.commentIssue);
    /**
     * @api {post} /api/v1/users/comment Comment Issue
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * 
     * @apiParam {String} authToken of the user passed as a body parameter
     * @apiParam {String} IssueId of the user passed as a body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Comment Is Added successfully",
     *   "status":200,
     *   "data": [
     *              {
     *                userId:"string",
     *                IssueId:"string"
     *                IssueTitle:"string",
     *                description:"string",
     *                reporterName:"string",
     *                ProductImage:"string",
     *                status:"string",
     *                Assignee:"string",
     *                watchers:"array",
     *                comments:"array"
     *              }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */



    app.post(`${baseUrl}/deleteIssue`,authorization.isAuthorized,controller.deleteIssue);
         /**
     * @api {post} /api/v1/users/deleteIssue Delete Issue
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * 
     * @apiParam {String} authToken of the user passed as a body parameter
     * @apiParam {String} IssueId of the user passed as a body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Issue Is Deleted successfully",
     *   "status":200,
     *   "data": []  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */




    app.post(`${baseUrl}/update/:IssueId/:authToken`,authorization.isAuthorized,upload.single('ProductImage'),
    controller.updateIssue);
     /**
     * @api {post} /api/v1/users/update/:IssueId/:authToken Update Issue
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * 
     * @apiParam {String} IssueTitle of the user passed as a body parameter
     * @apiParam {String} Description of the user passed as a body parameter
     * @apiParam {String} ProductImage of the user passed as a body parameter
     * @apiParam {String} Status of the user passed as a body parameter
     * @apiParam {String} Assignee of the user passed as a body parameter
     * @apiParam {String} authToken of the user passed as a url parameter
     * @apiParam {String} IssueId of the user passed as a URL parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Issue Is Updated successfully",
     *   "status":200,
     *   "data": []  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */


    app.post(`${baseUrl}/addwatcher`,authorization.isAuthorized,controller.addwatcher);
     /**
     * @api {post} /api/v1/users/addwatcher Add Watcher List
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * 
     * @apiParam {String} authToken of the user passed as a body parameter
     * @apiParam {String} IssueId of the user passed as a body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"You Are Added Watcher List",
     *   "status":200,
     *   "data": [
     *              {
     *                userId:"string",
     *                IssueId:"string"
     *                IssueTitle:"string",
     *                description:"string",
     *                reporterName:"string",
     *                ProductImage:"string",
     *                status:"string",
     *                Assignee:"string",
     *                watchers:"array",
     *                comments:"array"
     *              }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */


    app.get(`${baseUrl}/getwatcherlist/:IssueId/:authToken`,controller.getwatcherlist);
    /**
     * @api {get} /api/v1/users/getwatcherlist Get Watcher List
     * @apiVersion 0.0.1
     * @apiGroup get
     * 
     * 
     * @apiParam {String} authToken of the user passed as a URL parameter
     * @apiParam {String} IssueId of the user passed as a URL parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Watchers Are Listed",
     *   "status":200,
     *   "data": [
     *              {
     *                userId:"string",
     *                IssueId:"string"
     *                IssueTitle:"string",
     *                description:"string",
     *                reporterName:"string",
     *                ProductImage:"string",
     *                status:"string",
     *                Assignee:"string",
     *                watchers:"array",
     *                comments:"array"
     *              }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */


    app.post(`${baseUrl}/resetcode`,controller.resetcode);
  /**
     * @api {post} /api/v1/users/resetcode Password Reset
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * @apiParam {String} email of the user passed as a body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Reset Code send successfully",
     *   "status":200,
     *   "data": []
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400,
     *      "data":null
     *    }
     */



    app.post(`${baseUrl}/resetpassword`,controller.resetpassword);
    /**
     * @api {post} /api/v1/users/resetpassword Password Reset
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * @apiParam {String} resetId of the user passed as a body parameter
     * @apiParam {String} Newpassword of the user passed as a body parameter
     * 
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Your Password Is Reset Successfully",
     *   "status":200,
     *   "data": []
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400,
     *      "data":null
     *    }
     */
}


module.exports={
    setRouter:setRouter
}