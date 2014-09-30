// Place - manifestation of a plot
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Mixed = mongoose.Schema.Types.Mixed;
    
var Place = new Schema({
    characters : [{ type: Schema.ObjectId, ref: 'Character' }],
    regions    : [{ type: Schema.ObjectId, ref: 'Region' }]
});

module.exports = mongoose.model('Place', Place);
