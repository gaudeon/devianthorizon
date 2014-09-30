// Place - manifestation of a plot
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Mixed = mongoose.Schema.Types.Mixed;

var Place = new Schema({
    type           : { type: String, required: true },
    characters     : [{ type: Schema.ObjectId, ref: 'Character' }],
    regions        : [{ type: Schema.ObjectId, ref: 'Region' }],
    is_spawn_point : { type: Boolean, default: false },
    is_area_gate   : { type: Boolean, default: false }
});

module.exports = mongoose.model('Place', Place);
