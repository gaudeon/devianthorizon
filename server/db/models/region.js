//  Region model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Mixed = mongoose.Schema.Types.Mixed;
    
var Region = new Schema({
    places : [{ type: Schema.ObjectId, ref: 'Place' }]
});

module.exports = mongoose.model('Region', Region);
