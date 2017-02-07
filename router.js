var express = require('express');
var router = express.Router();
var auth = require('./auth');

// If the req is needed to be pre-process, do it here.
router.use(function timeLog (req, res, next) {
  next()
})
var auth = require('./auth');

router.get("/", auth.ensureLoggedIn(),
    function(req,res){
    res.render("index");
});

router.get('/login', function(req, res) {
   res.render("login");
});

router.post('/login', 
  auth.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout',auth.ensureLoggedIn(),
  function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/profile',auth.ensureLoggedIn(),
  function(req, res){
    res.send(req.user );
});

var AddressDao = require("./dao/AddressDao.js");
var Address = new AddressDao();
router.get('/listAddress',//auth.ensureLoggedIn(),
  function(req, res){
    Address.findByCustomerId(1,function(err,address){
      res.send(address);
    });
    
});

router.get('/addAddress',//auth.ensureLoggedIn(),
  function(req, res){    
});

router.get('/deleteAddress',//auth.ensureLoggedIn(),
  function(req, res){
});

module.exports = router;