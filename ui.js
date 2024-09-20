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

var hoverEuclid = 0;
var hoverSpring = 0;
var hoverLines = 0;

var EuclideanCircle = function(id, coords, radius, length, density, offset) {
	this.id = id;
	this.coords = coords;
	this.radius = radius;
	
	this.length = length;
	this.density = Math.round(density * this.length);
	this.offset = Math.round(offset * this.length);
	this.hover = false
	
	this.paint = function(color) {
		with (mgraphics) {						
			set_source_rgba(hoverEuclid == this.id ? hoverColor : color);
			set_line_width(hoverEuclid == this.id ? 2 : 2);
			
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
		if (
			x > this.coords[0] - this.radius - 5 && 
			x < this.coords[0] + this.radius + 5 && 
			y > this.coords[1] - this.radius - 5 && 
			y < this.coords[1] + this.radius + 5
		) {
			hoverEuclid = this.id;
		} else if (x > 145 || x < 45 || y < 45 || y > 145) {
			hoverEuclid = 0;
		}
	}
}

var Spring = function(coords, tension) {
	this.coords = coords;
	this.tension = tension;
	
	this.setValue = function(x) {
		this.tension = clamp(this.tension - x, 0.35, 1);
	}
	
	this.getValue = function() {
		return this.tension;
	}
	
	this.onidle = function(x, y) {
		if (
			x > this.coords[0] - 5 && 
			x < this.coords[0] + 28 && 
			y > this.coords[1] - 20 && 
			y < this.coords[1] + 75
		) {
			hoverSpring = 1;
		} else {
			hoverSpring = 0;
		}
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
					
					set_source_rgba(hoverSpring ? hoverColor : midColor);
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
					
					set_source_rgba(hoverSpring ? hoverColor : midColor);
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
					
					set_source_rgba(hoverSpring ? hoverColor : midColor);
					stroke();
					break;
			}
		}
	}
}

var Lines = function(coords, move, skew) {
	this.coords = coords;
	this.move = move;
	this.skew = skew;
	
	this.setValue = function(x, y) {
		this.move = clamp(this.move - y, 0, 1);
		this.skew = clamp(this.skew + x, 0, 1);
	}
	
	this.getValue = function() {
		return [this.move, this.skew];
	}
	
	this.paint = function() {
		with (mgraphics) {
			set_line_cap("none");
			
			var skewScaled = (this.skew * 2 - 1) * 20;
			var height = (this.move * 2 - 1) * 20;
			
			for (var i = 0; i < 6; ++i) {
				if (i == 0) {
					set_source_rgba(highColor);
				} else if (i < 3) {
					set_source_rgba(hoverLines ? hoverColor : midColor);
				} else {
					set_source_rgba(hoverLines && i < 5 ? hoverColor : lowColor);
				}
				
				move_to(this.coords[0], this.coords[1] + 1 + i * 10)
				line_to(this.coords[0] + 36 + skewScaled, this.coords[1] + 1 + i * 10 - height);
				line_to(this.coords[0] + 72, this.coords[1] + 1 + i * 10);
				stroke();
			}
		}		
	}
	
	this.onidle = function(x, y) {
		if (
			x > this.coords[0] - 5 && 
			x < this.coords[0] + 78 && 
			y > this.coords[1] - 20 && 
			y < this.coords[1] + 75
		) {
			hoverLines = 1;
		} else {
			hoverLines = 0;
		}
	}	
}

var euclidOuter = new EuclideanCircle(1, [96, 96], 45, 8, 0.2, 0.1);
var euclidInner = new EuclideanCircle(2, [96, 96], 25, 8, 0.4, 0);
var spring = new Spring([310, 71], 1);
var lines = new Lines([190, 71], 0.75, 0.75);

function paint() {
	with (mgraphics) {
		set_source_rgba(bgColor);
		rectangle_rounded(0, 0, 520, 192, 8, 8);
		fill();
				
		euclidOuter.paint(lowColor);
		euclidInner.paint(midColor);
		
		spring.paint();
		
		lines.paint();
	}
	
	outlet(0, "spring", spring.getValue());
}

function onidle(x, y) {
	euclidOuter.onidle(x, y);
	euclidInner.onidle(x, y);
	spring.onidle(x, y);
	lines.onidle(x, y);
	
	mgraphics.redraw();
}

function onidleout() {
	hoverEuclid = 0;
	hoverSpring = 0;
	mgraphics.redraw();
}

var cursorClick = [0, 0];
var cursorPrev = [0, 0];

function onclick(x, y) {	
	cursorClick = [x, y];
	cursorPrev = [x, y];
	
	mgraphics.redraw();
}

function ondrag(x, y, but) {
	var cursorDelta = [x - cursorPrev[0], y - cursorPrev[1]];
	
	if (!but) {
		/*
		TODO: mouse hiding etc
		
		max.showcursor();
		var p = this.patcher.wind.location;
		var r = this.box.rect;
		
		max.pupdate(
			p[0] + r[0] + cursorClick[0], 
			p[1] + r[1] + cursorClick[1]
		);
		*/
	} else {	
		if (hoverSpring) {
			spring.setValue(cursorDelta[1] / 100);
		}
		
		if (hoverLines) {
			lines.setValue(cursorDelta[0] / 100, cursorDelta[1] / 100);
		}
	}
	
	cursorPrev = [x, y];
	mgraphics.redraw();
}

function clamp(x, low, high) {
	return Math.min(Math.max(x, low), high);
}