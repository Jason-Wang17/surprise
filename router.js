// load up all we need.
var express = require('express');
var router = express.Router();
var auth = require('./auth');
var CustomerDao = require("./dao/customerDao.js");
var UserDao = require("./dao/userDao.js");

// create a new instance.
var customer = new CustomerDao();
var user = new UserDao();

// If the req is needed to be pre-process, do it here.
router.use(function timeLog (req, res, next) {
  next()
})

router.get("/", auth.ensureLoggedIn(),
    function(req,res){
    res.render("index");
});

router.get('/createaccount', function(req, res) {
   res.render("createaccount");
});

router.post('/createaccount', 
  //auth.authenticate('local', { failureRedirect: '/createaccount' }),
  function(req, res) {
    console.log(req); 

    // get data from request.
    // get data enclosed in the json body of the request message from the submit of a web form.
     var username = req.body.Username;
     var email = req.body.Email;
     var firstName = req.body.Firstname;
     var lastName = req.body.Lastname;
     var password = req.body.Password;

    // call signUp method and send the parameter values to the method.
    // res refers to the result from database.
    customer.signUp(username,email,firstName,lastName,password, function(error, res){
     
    function fetchID(callback) {

      //  fetch customerID.
     var sql = "SELECT id FROM surprise.customer WHERE email = ?;"
     var values = [email];
     customer.execute(sql,values,function(error, res){
       if(error) {
         callback(error, null);
       } else {
         callback(null, res[0]);
       }
     });

    }

     fetchID(function(err, customerID) {
       if(err) {
        console.log("ERROR: ", err);
       } else {
        //  code to execute on data retrieval
        user.createUser(customerID, password, function(error, user) {
           console.log("succeeded.");
        });
       }
     })
     

    });

    res.redirect('/login');    
  });

router.get('/login', function(req, res) {
   res.render("login");
});

// send the input information back server via post. then if it failed, get back to 
//  the login page. if succeeded, get back to home page.
// the autentication of it is local.
router.post('/login', 
  auth.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

// get back to home page.
router.get('/logout',auth.ensureLoggedIn(),
  function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/profile',auth.ensureLoggedIn(),
  function(req, res){
    res.send(req.user );
});

module.exports = router;