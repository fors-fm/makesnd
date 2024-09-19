outlets = 1;

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

var hoverColor = [0.871, 0.843, 1, 1];
var highColor = [1, 0.6, 0.667, 1];
var midColor = [0.643, 0.388, 1, 1];
var lowColor = [0.220, 0.329, 0.647, 1];
var bgColor = [0.059, 0.055, 0.075, 1];

var TWO_PI = Math.PI * 2;

var genObj = this.patcher.getnamed("dsp");

var EuclideanCircle = function(coords, radius, length, density, offset) {
	this.coords = coords;
	this.radius = radius;
	
	this.length = length;
	this.density = Math.round(density * this.length);
	this.offset = Math.round(offset * this.length);
	this.hover = false
	
	this.paint = function(color) {
		with (mgraphics) {						
			set_source_rgba(this.hover ? hoverColor : color);
			set_line_width(this.hover ? 2 : 2);
			
			arc(this.coords[0], this.coords[1], this.radius, 0, TWO_PI);
			stroke();
						
			set_source_rgba(highColor);
									
			for (var i = 0; i < this.length; ++i) {				
				var pos = [
					Math.sin(i / this.length * TWO_PI + Math.PI) * radius - 6,
					Math.cos(i / this.length * TWO_PI + Math.PI) * radius - 6
				];
				
				var step = ((i + this.length) - this.offset) * this.density;
				
				if (step % this.length < this.density) {
					ellipse(this.coords[0] + pos[0], this.coords[1] + pos[1], 12, 12);
					fill();
				}
			}
		}
	}
	
	this.onidle = function(x, y) {
		if (x > this.coords[0] - this.radius - 8 && x < this.coords[0] - this.radius + 12) {
			this.hover = true;
		} else {
			this.hover = false;
		}
	}
}

var Spring = function() {
	this.paint = function() {
		with (mgraphics) {
			
		}
	}
}

var euclidean0 = new EuclideanCircle([96, 96], 45, 8, 0.2, 0.1);
var euclidean1 = new EuclideanCircle([96, 96], 25, 8, 0.4, 0);

function paint() {
	with (mgraphics) {
		set_source_rgba(bgColor);
		rectangle_rounded(0, 0, 520, 192, 8, 8);
		fill();
				
		euclidean0.paint(lowColor);
		euclidean1.paint(midColor);
	}	
}

function onidle(x, y) {
	euclidean0.onidle(x, y);
	euclidean1.onidle(x, y);
	mgraphics.redraw();
}