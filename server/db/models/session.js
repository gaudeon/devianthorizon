// Session Collection
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Mixed = mongoose.Schema.Types.Mixed;
    
var uuid = require('uuid');
    
var Session = new Schema({
    tokenString : { type : String , required : true , default : function() { return uuid.v4(); } },
    ipAddress   : { type : String , required : true },
    expireDate  : { type : Date   , required : true , default: function() { return new Date(Date.now() + 1000 * 60 * 1); }, expires: 0 },
    sessionData : Mixed
});

Session.method({
    updateExpireDate : function(hours) { hours = arguments[0] || 1; this.set( 'expireData', new Date(Date.now() + 1000 * 60 * hours) ); }
});

module.exports = mongoose.model('Session', Session);
