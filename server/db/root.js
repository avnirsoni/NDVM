////////////////////////////////////////////////////////////////////////////////
// Root Entity
////////////////////////////////////////////////////////////////////////////////
/*global require, exports */
var	entity = require('../db/entity').entity,

root = Object.create(entity, {kind: {value: 'roots'}});

exports.root = root;
