// Server General Configuration

var _ = require('underscore');

var config = {
    cookie_secret : 'changeme!',
    mongo_host    : 'localhost',
    mongo_db      : 'mudjs'
};

/* Note: You can override properties of config by creating a file at ./server/src/config/override.js. Here is an example:
 *
 * var config = {
 *      override : 'somehting',
 *      and      : 'something else'
 * };
 *
 * module.exports = config;
 *
 */
var override;
try {
    override = require('./config/override');
} catch(err) {
    // Do nothing
}

// add overridden configuration if exists
if('undefined' !== typeof override) {
    _.extend(config, override);
}

module.exports = config;
