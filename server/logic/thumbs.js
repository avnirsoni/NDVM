////////////////////////////////////////////////////////////////////////////////
// Thumbnails
//
// Manages cached thumbnails
////////////////////////////////////////////////////////////////////////////////
/*global require, exports, console */
const $crypto = require('crypto');
const entity = require('../db/media').media;
const processes = require('../logic/processes').processes;
const queue = require('../utils/queue').queue;
		
var thumbs = function () {
	var media = entity(),
	
	self = {
		// generates thumbnails for video files
		// identified by their mediaid's
		// - mediaids: array of media ids to generate thumbnail for
		// - force: when set, extraction doesn't check hash
		generate: function (mediaids, force, handler) {
			media.multiGet(mediaids, function (data) {
				var elems = [],
						i, entry,
						shasum;

				// generating hashes and collecting process input
				for (i = 0; i < data.length; i++) {
					entry = data[i];
					if (typeof entry.path != 'undefined') {
						if (! entry.hash || force) {
							shasum = $crypto.createHash('md5');
							shasum.update(entry.path);
							entry.hash = shasum.digest('hex');
							elems.push(entry.rootid + '|' + entry.mediaid + '|' + entry.root + '|' + entry.path + '|' + entry.hash);
						}
					}
				}
				
				// ending request
				if (typeof handler === 'function') {
					handler();
				}

				// passing elems to thumbnail extraction process
				if (elems.length) {
					processes.thumbnails
						.bump(elems)
						.start(true);
				}
			});
		}
	};
	
	return self;
}();

// exports
exports.thumbs = thumbs;

