////////////////////////////////////////////////////////////////////////////////
// Tree node in a tree control
////////////////////////////////////////////////////////////////////////////////
/*global jQuery */
var app = app || {};

app.controls = function (controls, $) {
	controls.node = function (text, tree, path) {
		path = path || [];
		
		var self = controls.control.create(),
				json,
				expanded = false;
			
		// root path start expanded	
		if ( text == '/' ) {
			expanded = true;
		}
				
		//////////////////////////////
		// Getters, setters
		
		// returns path to current node
		self.path = function () {
			return path;
		};

		// returns expanded state
		self.expanded = function () {
			return expanded;
		};
		
		// sets json
		self.json = function (value) {
			if (typeof value !== 'undefined') {
				json = value;
				return self;
			} else {
				return json;
			}
		};
		
		//////////////////////////////
		// Control
		
		// toggles expanded / collapsed state
		self.toggle = function () {
			expanded = !expanded;
			return self
				.clear()
				.build()
				.render();
		};
		
		//////////////////////////////
		// Overrides

		// builds the node with subnodes as specified by json
		self.build = function () {
			var node, keys, i;
			if (json && expanded) {
				// obtaining sorted array of node names
				keys = [];
				for (node in json) {
					if (json.hasOwnProperty(node)) {
						keys.push(node);
					}
				}
				keys.sort(function (a, b) {
					a = a.toLowerCase();
					b = b.toLowerCase();
					return a > b ? 1 : a < b ? -1 : 0; 
				});
				// adding child controls according to node names
				for (i = 0; i < keys.length; i++) {
					node = keys[i];
					controls.node(node, tree, path.concat([node]))
						.json(json[node])
						.appendTo(self);
				}
			}
			return self;
		};

		// returns whether the current node is selected
		function selected() {
			return tree.selected().join('/') === path.join('/');
		}
		
		self.html = function () {
			var visibleDirs=[['home','media','run','mnt','root'],
			                 ['run','media']];
			
			var regEx=RegExp( visibleDirs[0].join('|') ).test(text);
			
			if ( !(alldirs) ){
				if (( path.length === 1 && !( regEx ) ) ||
				
				   ( path.length === 2 
				     && path[0] === visibleDirs[1][0]
				     && !(path[1] === visibleDirs[1][1])) ) {
				
					var hide=true;
				}
			}
			return [
				'<li id="', self.id, '" class="',
				['node', expanded ? 'expanded' : '',
				 selected() ? 'selected' : '',
				 hide ? 'hide':''
				 ].join(' '), '">',
				'<span class="toggle"></span>',
				'<span class="name">', text, '</span>',
				'<ul>',
				function () {
					var result = [],
							i;
					for (i = 0; i < self.children.length; i++) {
						result.push(self.children[i].html());
					}
					return result.join('');
				}(),
				'</ul>',
				'</li>'
			].join('');
		};
		
		return self;
	};
	
	//////////////////////////////
	// Static event handlers

	// expand / collapse button handler
	function onExpandCollapse() {
		// obtaining necessary objects (current node & tree)
		var	$node = $(this).parent(),
				node = controls.lookup[$node.attr('id')],
				$tree = $node.closest('div.tree'),
				tree = controls.lookup[$tree.attr('id')];
		
		// toggling expanded state of current node
		$node = node.toggle();
		
		// calling tree's handler on expand / collapse event
		tree.onExpandCollapse($node, node);
		
		return false;
	}
	
	// directory selection button
	function onSelect() {
		// obtaining necessary objects (current node & tree)
		var	$node = $(this).parent(),
				node = controls.lookup[$node.attr('id')],
				$tree = $node.closest('div.tree'),
				tree = controls.lookup[$tree.attr('id')],
				path = '/' + node.path().join('/');

		// setting selected status on current node
		$tree
			.find('span.selected')
				.text(path)
				.attr('title', path)
			.end()
			.find('li')
				.removeClass('selected')
			.end();
		$node.addClass('selected');
		
		// storing selected path and calling tree's handler
		tree.selected(node.path());
		tree.onSelect($node, node);

		return false;
	}

	onChecked = function () {
		var $this = $(this);
		
		 ($this.is(':checked')) ? alldirs = true : alldirs = false
		 
		if ($('ul.root li:first').is('.expanded')) {
			for (i = 0; i < 2; i++) { 
				$('ul.root li:first > span.toggle').trigger('click');
			}
		}
	}

	// applying handlers
	// any non-dead folder can be expanded
	// any folder can be selected
	$( document ).on('click', 'li.node:not(.dead) > span.toggle', onExpandCollapse);
	$( document ).on('click', 'li.node > span.name', onSelect);
	$( document ).on('click', 'div.checkbox > :checkbox', onChecked);
	
	return controls;
}(app.controls,
	jQuery);

