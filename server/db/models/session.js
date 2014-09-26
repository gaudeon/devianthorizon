// Session Collection
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var Session = new Schema({
    username : { type: String },
    token    : { type: String },
    expires  : { type: Date },
    data     : Schema.Types.Mixed
});

module.exports = mongoose.model('Session', Session);
