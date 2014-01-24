var Mouse = function () {
	var self = this;

	self.X = ko.observable();
	self.Y = ko.observable();

	document.querySelector('#svg').addEventListener('mousemove', function (evt) {
		self.X(evt.clientX);
		self.Y(evt.clientY);
	});
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

var Graph = function (raw) {
	var self = this;

	self.table = {};
	self.mouse = new Mouse();
	self.links = ko.observableArray();
	self.nodes = ko.observableArray();
	self.activeNode = ko.observable();
	self.inprocessLink = {
		source: ko.observable(),
		destination: ko.observable(),
		srcX: ko.observable(),
		srcY: ko.observable(),
		dstX: ko.observable(),
		dstY: ko.observable()
	};	

	self.setActiveNode =  function (node) {
		self.activeNode(node);
	};

	self.pushNode = function (rawNode) {		
		var coord = create_Coord(rawNode.X, rawNode.Y);
		this.table[rawNode.Id] = coord;
		this.nodes.push(new Node(rawNode, coord));
	};

	self.pushLink = function (rawLink) {
		var coordSrc = self.table[rawLink.Source],
			coordDest = self.table[rawLink.Destination];
		self.links.push(new Link(rawLink, coordSrc, coordDest));
	};

	self.addLink = function () {
		var rawLink = {
			Type: 'some type',
			Source: self.inprocessLink.source(),
			Destination: self.inprocessLink.destination()
		};
		self.pushLink(rawLink);
	};

	self.startLink = function (nodeId) {
		self.inprocessLink.source(nodeId);
		self.inprocessLink.srcX(self.table[nodeId]().X());
		self.inprocessLink.srcY(self.table[nodeId]().Y());
	};

	self.endLink = function (nodeId) {
		if(nodeId !== self.inprocessLink.source()) {
			self.inprocessLink.destination(nodeId);
			self.addLink();
			self.inprocessLink.source(null);
			self.inprocessLink.destination(null);
		}
	};

	(function ctor () {
		for(var i = 0; i < raw.Nodes.length; i++) {	
			self.pushNode(raw.Nodes[i]);
		}
		for(var i = 0; i < raw.Links.length; i++) {
			self.pushLink(raw.Links[i]);
		}
	})();
};


(function application_start () {

	var model = dataservice.get(),
		viewmodel = new Graph(model);

	ko.applyBindings(viewmodel);

})();
