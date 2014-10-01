// Character Collection
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Mixed = mongoose.Schema.Types.Mixed;
    
var Character = new Schema({
    ownedBy     : { type : ObjectId, ref : 'User' },
    fullName    : { type : String , required : true },
    place       : { type: Schema.ObjectId, ref: 'Place' },
    createdDate : { type : Date , required : true , default : Date.now }
});

module.exports = mongoose.model('Character', Character);
