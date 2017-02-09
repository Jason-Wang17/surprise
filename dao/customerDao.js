var BaseDao = require("./baseDao.js");

var CustomerDao = function(){
    this.table = 'Customer';
}

CustomerDao.prototype = Object.create(BaseDao.prototype);
CustomerDao.prototype.findOneWithPassword = function(userIdentity,callback){
    var sql = "SELECT id, username, email, telephone, password"
                +" FROM Customer join User ON Customer.id = User.customerId"
                +" WHERE username=? OR email=? OR telephone=? LIMIT 1";
    var values = [userIdentity,userIdentity,userIdentity];
    this.execute(sql, values, function(error, res){
        var item = null;
        if(res.length > 0)item = res[0];
        callback && callback(error, item);
    });
};

// get current time method: GETDATE().
// callback refers to the function in router.js, 
// when the result is generated, it will callback the function in router.js.
CustomerDao.prototype.signUp = function(username,email,firstName,lastName,password,callback){
//    "?" represent values to be input.
// execute(sql,values) let the values insert into the correspongding place. This is a function defined in baseDao.js.
    var sql="INSERT INTO surprise.Customer (username, firstName, lastName, email, createdTime)"
          +" VALUES (?, ?, ?, ?, ?, ?);"
    var values=[username,email,firstName,lastName,'GETDATE()'];
    this.execute(sql,values,function(error, res){
         callback && callback(error, res);
    });
}

CustomerDao.prototype.findOneById = function(id,callback){
    this.findOne(null, "`id`=\""+id+"\"",function(error, user){
        callback && callback(error, user);
    });
};
exports = module.exports = CustomerDao;