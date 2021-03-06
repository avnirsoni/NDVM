////////////////////////////////////////////////////////////////////////////////
// Web Browser
////////////////////////////////////////////////////////////////////////////////
/*global require, exports */
const system = require('../utils/system').system;
const tool = require('../tools/tool').tool;

var browser = function () {
	var executable = {
		'linux': 'xdg-open',
		'freebsd': 'xdg-open',
		'darwin': 'open',
		'cygwin': 'cmd',
		'windows': 'cmd'
	}[system.os] || 'xdg-open',
	self = Object.create(tool, {executable: {value: executable}});
			
	self.exec = function (url, handler) {
		var args = {
			'cygwin': ['/c', 'start ' + url], 
			'windows': ['/c', 'start ' + url]
		}[system.os] || [url];
		
		tool.exec.call(self, args, handler);
		return self;
	};
	
	return self;
}();

exports.browser = browser;

