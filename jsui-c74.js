outlets = 1;

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

var Vertex = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

var Vertex2D = function(x, y) {
	this.x = x;
	this.y = y;
}

var Cube = function(center, size) {
	var d = size / 2;
	
	this.vertices = [
        new Vertex(center.x - d, center.y - d, center.z + d),
        new Vertex(center.x - d, center.y - d, center.z - d),
        new Vertex(center.x + d, center.y - d, center.z - d),
        new Vertex(center.x + d, center.y - d, center.z + d),
        new Vertex(center.x + d, center.y + d, center.z + d),
        new Vertex(center.x + d, center.y + d, center.z - d),
        new Vertex(center.x - d, center.y + d, center.z - d),
        new Vertex(center.x - d, center.y + d, center.z + d)
    ];

	this.faces = [
        [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
        [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
        [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
        [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
        [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
        [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
    ];
}

function project(M) {
	var d = 480;
	var r = d / M.y;

	return new Vertex2D(r * M.x, r * M.z);
}

var mouse = new Array(2);

function onidle(x, y) {
	mouse = [x, y]
	mgraphics.redraw();
}

function render(objects, dx, dy) {
	// For each object
	for (var i = 0, n_obj = objects.length; i < n_obj; ++i) {
		// For each face
		for (var j = 0, n_faces = objects[i].faces.length; j < n_faces; ++j) {
			// Current face
			var face = objects[i].faces[j];

			// Draw the first vertex
			var P = project(face[0]);
			mgraphics.move_to(P.x + dx, -P.y + dy);

			// Draw the other vertices
			for (var k = 1, n_vertices = face.length; k < n_vertices; ++k) {
				P = project(face[k]);
				mgraphics.line_to(P.x + dx, -P.y + dy);
			}

			// Close the path and draw the face
			mgraphics.close_path();
			mgraphics.stroke();
		}
	}
}

function paint() {
	var canvasSize = [
		this.box.rect[2] - this.box.rect[0], 
		this.box.rect[3] - this.box.rect[1]
	];
  	var midPoint = [canvasSize[0] / 2, canvasSize[1] / 2];
	
	var cube_center = new Vertex(-canvasSize[0] + mouse[0] * 2, midPoint[0] * 4, canvasSize[1] - mouse[1] * 2);
	var cube = new Cube(cube_center, midPoint[1]);
	var objects = [cube];
	
	mgraphics.set_line_cap("round");
	mgraphics.set_line_join("round");
	mgraphics.set_line_width(2);
	
	with (mgraphics) {
		render(objects, midPoint[0], midPoint[1]);
	}
}