// Session Collection
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Mixed = mongoose.Schema.Types.Mixed,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
    
var User = new Schema({
    firstName    : { type : String , required : true },
    lastName     : { type : String , required : true },
    emailAddress : { type : String , required : true },
    userName     : { type : String , required : true , index: { unique: true } },
    userPassword : { type : String , required : true },
    createDate   : { type : Date   , required : true , default: Date.now() },
    sessionData  : Mixed
});

User.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
    
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
    
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });

});

User.method({
    checkPassword : function(password, callback) {
        bcrypt.compare(password, this.userPassword, function(err, isMatch) {
            if (err) return callback(err);
            callback(null, isMatch);
        });
    }
});

module.exports = mongoose.model('User', User);
