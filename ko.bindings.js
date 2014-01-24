(function () {
	
	ko.bindingHandlers['attr-ns'] = {
	  update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
	    ko.utils.objectForEach( ko.unwrap( valueAccessor() ), function(name, value){
	      var prefixLen = name.indexOf(':');
	      var prefix    = name.substr( 0, prefixLen );
	      var namespace = prefixLen < 0 ? null : element.lookupNamespaceURI( prefix );

	      element.setAttributeNS( namespace, name, ko.unwrap( value ) );
	    });
	  }
	};

	ko.bindingHandlers['draggable'] = {
		init: function (element, valueAccessor) {
			var svg = document.getElementById("svg");
			element.onmousedown = function (evt) {
				element.dragged = (evt.button === 0);
			};
			svg.addEventListener('mouseup', function (evt) {
				element.dragged = false;
			});
			svg.addEventListener('mousemove', function (evt) {
				 if(element.dragged) {
				 	ko.unwrap(valueAccessor()).X(evt.clientX);
				 	ko.unwrap(valueAccessor()).Y(evt.clientY)
				 }
			});
		},
		update: function (element, valueAccessor) {
			element.setAttribute('cx', ko.unwrap(valueAccessor()).X());
			element.setAttribute('cy', ko.unwrap(valueAccessor()).Y());
		}
	};

	ko.bindingHandlers['linkable'] = {
		init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {			
			var svg = document.getElementById("svg");
			element.addEventListener('mousedown', function (evt) {
				if(evt.button === 2) {
					bindingContext.$root.startLink(ko.unwrap(valueAccessor()));					
				}
			});
			element.addEventListener('contextmenu', function (evt) {
				if(evt.button === 2) {
					bindingContext.$root.endLink(ko.unwrap(valueAccessor()));
					evt.preventDefault();
					return false;
				}
			});
			svg.addEventListener('contextmenu', function(evt) {
				if(evt.button === 2 && bindingContext.$root.inprocessLink.source() !== null) {
					var rawNode = {
						Id: dataservice.getNewId(),
						Name: 'Bla-bla',
						X: evt.clientX,
						Y: evt.clientY
					}
					bindingContext.$root.pushNode(rawNode);
					bindingContext.$root.endLink(rawNode.Id);
					evt.preventDefault();
					return false;
				}
			});		
		}
	};

})();