// Gate - a connection between multiple places

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Mixed = mongoose.Schema.Types.Mixed;

var Gate = new Schema({
    source      : { type: Schema.ObjectId, ref: 'Place' },
    destination : { type: Schema.ObjectId, ref: 'Place' },
    direction   : { type: String }
});

module.exports = mongoose.model('Gate', Gate);
