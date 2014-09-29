// Session Collection
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Mixed = mongoose.Schema.Types.Mixed;
    
var uuid = require('uuid');
    
var Session = new Schema({
    tokenString : { type : String , required : true , default : function() { return uuid.v4(); } },
    ipAddress   : { type : String , required : true },
    expireDate  : { type : Date   , required : true , default: Date.now, expires: 3600 },
    sessionData : { type : String , default: '{}', get: function(v) { return JSON.parse(v); }, set: function(v) { return JSON.stringify(v); } }
});

Session.pre("save", function(next) { 
    this.expireDate = new Date(); 
    next(); 
});

module.exports = mongoose.model('Session', Session);
