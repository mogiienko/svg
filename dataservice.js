var dataservice = (function () {
	
	var ds = {};

	ds.get = function () {
		return {
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
	};

	ds.getNewId = function () {
		var text = "",
			possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for(var i = 0; i < 5; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	return ds;

})();