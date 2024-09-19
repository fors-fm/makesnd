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

var Spring = function(coords, tension) {
	this.coords = coords;
	this.tension = tension;
	
	this.setHeight = function(x) {
		this.tension = x;
	}
	
	this.paint = function() {
		with (mgraphics) {
			var heightOffset = (1 - this.tension) * 20;
			var topOffset = (1 - this.tension) * 30;
			
			set_source_rgba(lowColor);			
			ellipse(
				this.coords[0] + 8, 
				this.coords[1] - 20,
				10, 10
			);
			stroke();
			

			
			ellipse(
				this.coords[0] + 8, 
				this.coords[1] + 60, 
				10, 10
			);
			stroke();
			
			set_line_cap("round");
			
			
			curve(
				this.coords[0], 
				this.coords[1] - 5 + topOffset, 
				this.tension, 
				0
			);			
							
			
			for (var i = 0; i < 4; ++i) {
				curve(
					this.coords[0], 
					this.coords[1] + 5 + i * (10 * this.tension) + heightOffset, 
					this.tension, 
					1
				);
			}
			
			for (var i = 0; i < 4; ++i) {
				curve(
					this.coords[0], 
					this.coords[1] + 5 + i * (10 * this.tension) + heightOffset, 
					this.tension, 
					2
				);
			}
						
			curve(
				this.coords[0], 
				this.coords[1] + 45 - heightOffset, 
				this.tension, 
				3
			);
			
			
			set_source_rgba(highColor);
			rectangle_rounded(
				this.coords[0] + 7, 
				this.coords[1] - 21 + topOffset, 
				12, 12, 4, 4
			);
			fill();
						
			rectangle_rounded(
				this.coords[0] + 7, 
				this.coords[1] + 59 - topOffset, 
				12, 12, 4, 4
			);
			fill();									
		}
	}
	
	function curve(x, y, height, piece) {
		with (mgraphics) {
			switch (piece) {
				case 0:
					move_to(x + 1, y + 10 * height)
					curve_to(
						x + 1, y + 4 * height,
						x + 6, y + 1 * height,
						x + 13, y + 1 * height
					);
					rel_line_to(0, -7);
					
					set_source_rgba(midColor);
					stroke();
					break;
				
				case 1:
					move_to(x + 1, y + 10 * height);
					curve_to(
						x + 1, y + 5 * height,
						x + 6, y + 1 * height,
						x + 14.5, y + 1 * height
					);
					curve_to(
						x + 17.75, y + 1 * height,
						x + 22, y + 2.25 * height,
						x + 22, y + 5 * height
					);
					
					set_source_rgba(lowColor);
					stroke();
					break;
					
				case 2:
					move_to(x + 1, y)
					curve_to(
						x + 1, y + 5 * height,
						x + 6, y + 9 * height,
						x + 14.5, y + 9 * height
					);
					curve_to(
						x + 17.75, y + 9 * height,
						x + 22, y + 7.75 * height,
						x + 22, y + 5 * height
					);
					
					set_source_rgba(midColor);
					stroke();
					break;
					
				case 3:
					move_to(x + 1, y);
					curve_to(
						x + 1, y + 6 * height,
						x + 6, y + 9 * height,
						x + 13, y + 9 * height
					);
					rel_line_to(0, 7);
					
					set_source_rgba(midColor);
					stroke();
					break;
			}
		}
	}
}

var euclidean0 = new EuclideanCircle([96, 96], 45, 8, 0.2, 0.1);
var euclidean1 = new EuclideanCircle([96, 96], 25, 8, 0.4, 0);
var spring = new Spring([200, 71], 0.75);

function msg_float(x) {
	spring.setHeight(x);
	mgraphics.redraw();
}

function paint() {
	with (mgraphics) {
		set_source_rgba(bgColor);
		rectangle_rounded(0, 0, 520, 192, 8, 8);
		fill();
				
		euclidean0.paint(lowColor);
		euclidean1.paint(midColor);
		
		spring.paint();		
	}	
}

function onidle(x, y) {
	euclidean0.onidle(x, y);
	euclidean1.onidle(x, y);
	mgraphics.redraw();
}