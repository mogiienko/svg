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
			element.dragged = true;
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

var model = {
	Nodes: [
		{ Id:1, Name:"Node Person1", Type:"Person", X: 100, Y: 50 },
		{ Id:2, Name:"Node Person2", Type:"Person", X: 150, Y:150 },
		{ Id:3, Name:"Node Person3", Type:"Person", X: 500, Y: 150 },

		{ Id:4, Name:"Lviv", Type:"Place", X: 100, Y: 400 },
		{ Id:5, Name:"Intellias Zelena", Type:"Place", X: 650, Y: 350 },
		{ Id:6, Name:"Intellias Luganska", Type:"Place", X: 350, Y: 450 },

		{ Id:11, Name:"Party", Type:"Event", Text: "at 21/01/2014", X: 700, Y: 550 }

	],
	Links: [ 
		{Id:7, Type: "Located at", Source: 5, Destination: 4 },
		{Id:8, Type: "Located at", Source: 6, Destination: 4 },
		{Id:9, Type: "Located at", Source: 1, Destination: 5 },
		{Id:10, Type: "Located at", Source: 2, Destination: 6 },

		{Id:12, Type: "Located at", Source: 11, Destination: 6 },

		{Id:13, Type: "Participated in", Source: 2, Destination: 11 }
	]
	
};


var create_Coord = function (x, y) {
	return ko.observable({
		X: ko.observable(x),
		Y: ko.observable(y)
	});	
};

var Node = function (raw, coord) {	
	this.Id = ko.observable(raw.Id);
	this.Name = ko.observable(raw.Name);
	this.Type = ko.observable(raw.Type);
	this.Coord = coord;
};

var Link = function (raw, coordSrc, coordDest) {
	this.Id = ko.observable(raw.Id);
	this.Type = ko.observable(raw.Type);
	this.Source = ko.observable(raw.Source);
	this.Destination = ko.observable(raw.Destination);
	this.Points = ko.computed(function () {
		return "M" + coordSrc().X() + ", " + coordSrc().Y() + " L" + coordDest().X() + ", " + coordDest().Y();
	});
};

var graph = {

	table: {},
	links: ko.observableArray(),
	nodes: ko.observableArray(),
}

for(var i = 0; i < model.Nodes.length; i++) {
	var coord = create_Coord(model.Nodes[i].X, model.Nodes[i].Y);
	graph.table[model.Nodes[i].Id] = coord;
	graph.nodes.push(new Node(model.Nodes[i], coord));
}

for(var i = 0; i < model.Links.length; i++) {
	var coordSrc = graph.table[model.Links[i].Source],
		coordDest = graph.table[model.Links[i].Destination];
	graph.links.push(new Link(model.Links[i], coordSrc, coordDest));
}

ko.applyBindings(graph);
