/*
MIT License

Copyright (c) 2024 Ess Mattisson (ess@fors.fm)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

                       -   ,--_--.
               -           \      `.
                      -     "-_ _   \
     -                         / F   )
                   -     -    / / `--'
              -              / /
                   -        / /
            -            __/ /
                        /,-pJ
           -        _--"-L ||
                  ,"      "//
     -           /  ,-""".//\
                /  /     // J____
               J  /     // L/----\
   .           F J     //__//^---'
     `     ___J  F    '----| |
  `       J---|  F         F F
`   `. `   `--J  L        J  F
    .   .`     L J       J  F
       .  .    J  \    ,"  F
         .  `.` \  "--"  ,"
            ` ``."-____-"
*/

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

var hoverColor = [0.871, 0.843, 1, 1];
var highColor = [0.686, 0.592, 0.839, 1];
var midColor = [0.192, 0.667, 0.392, 1];
var lowColor = [0.259, 0.275, 0.431, 1];
var bgColor = [0.05, 0.05, 0.06, 1];

var TWO_PI = Math.PI * 2;

var hoverEuclid = 0;
var hoverLines = 0;
var hoverCube = 0;
var hoverSpring = 0;

var timeTask = new Task(timescale, this);
var playhead = new Buffer("playhead");

timeTask.interval = 30;
timeTask.repeat();
timeTask.execute();

var timeline = 0;
var deltaTimeline = 0;

var stepState = [false, false];

function timescale() {
	deltaTimeline = timeline;

	timeline = playhead.peek(0, 0);	
	deltaTimeline = timeline - deltaTimeline;

	if (deltaTimeline > 0) {
		update_state();

		stepState[0] = euclidOuter.report();
		stepState[1] = euclidInner.report();
	}

	lines.updateValue();
	cube.updateValue();
	cube.rotate(cube.rotateValue[0], cube.rotateValue[1], 0);
	spring.updateValue();

	refresh();
}

var Step = function() {
	this.active = 0;

	this.phase = 0;
	this.repeats = 35;
	this.interval = 4;

	this.popAnimate = function() {
		this.phase = 1 - arguments.callee.task.iterations / (this.repeats);
	};

	this.placeAnimate = function() {
		this.active = arguments.callee.task.iterations / (this.repeats);
	};

	this.dropAnimate = function() {
		this.active = 1 - arguments.callee.task.iterations / (this.repeats);
	};

	this.trigTask = new Task(this.popAnimate, this);
	this.placeTask = new Task(this.placeAnimate, this);
	this.dropTask = new Task(this.dropAnimate, this);

	this.trig = function() {
		if (this.phase == 0) {
			this.trigTask.interval = this.interval;
			this.trigTask.repeat(this.repeats);
			this.trigTask.execute();
		}
	};
	
	this.place = function() {
		if (this.active == 0) {
			this.placeTask.interval = this.interval;
			this.placeTask.repeat(this.repeats);
			this.placeTask.execute();
		}
	};

	this.drop = function() {
		if (this.active == 1) {
			this.dropTask.interval = this.interval;
			this.dropTask.repeat(this.repeats);
			this.dropTask.execute();
		}
	};

	this.paint = function(x, y) {
		with (mgraphics) {
			if (this.active) {
				arc(
					x,
					y,
					6 * ease_in_out_cubic(this.active) + ease_in_out_cubic(this.phase) * 3,
					0,
					TWO_PI
				);
				fill();

				if (stepState[0] == 1 && stepState[1] == 1 && this.phase > 0) {
					arc(
						x,
						y,
						14 - (this.phase) * 8,
						0,
						TWO_PI
					);
					stroke();
				}
			}
		}
	};
};

var Circle = function(id, coords, radius, length, density, offset) {
	this.id = id;
	this.coords = coords;
	this.radius = radius;

	this.length = length;
	this.density = density;
	this.offset = offset;
	this.hover = false;

	this.repeats = 25;
	this.interval = 4;
	this.fade = 0;

	this.animateHoverIn = function() {
		this.fade = arguments.callee.task.iterations / (this.repeats);
	};

	this.animateHoverOut = function() {
		this.fade = 1 - arguments.callee.task.iterations / (this.repeats);
		
		if (this.fade <= 0) {
			this.fade = 0;
			arguments.callee.task.cancel();
		}
	};

	this.fadeInTask = new Task(this.animateHoverIn, this);
	this.fadeOutTask = new Task(this.animateHoverOut, this);

	this.setValue = function(x, y) {
		this.offset = clamp(this.offset - x, 0, 1);
		this.length = clamp(this.length + x, 0, 1);
		this.density = clamp(this.density - y, 0, 1);
	};

	var steps = [
		new Step(), new Step(), new Step(), new Step(),
		new Step(), new Step(), new Step(), new Step(),
		new Step(), new Step(), new Step(), new Step(),
		new Step(), new Step(), new Step(), new Step()
	];

	this.update = function() {
		var length = Math.round(this.length * 8) + 8;
		var density = Math.round(this.density * length);
		var offset = Math.round(this.offset * length);

		for (var i = 0; i < length; ++i) {
			var step = ((i + length) - offset) * density;

			if (step % length < density) {
				steps[i].place();
					
				if (timeline % length == i) {
					steps[i].trig();
				}
			} else {
				steps[i].drop();
			}
		}
	};
	
	this.report = function() {
		var length = Math.round(this.length * 8) + 8;
		var density = Math.round(this.density * length);
		var offset = Math.round(this.offset * length);

		var step = ((timeline + length) - offset) * density;

		return step % length < density;
	};

	this.paint = function(color) {
		with (mgraphics) {
			set_line_width(2);
			colorMix(color, hoverColor, ease_in_out_cubic(this.fade));

			arc(this.coords[0], this.coords[1], this.radius, 0, TWO_PI);
			stroke();

			set_source_rgba(highColor);

			var length = Math.round(this.length * 8) + 8;

			for (var i = 0; i < length; i++) {
				var pos = [
					Math.sin(i / length * TWO_PI + Math.PI) * radius,
					Math.cos(i / length * TWO_PI + Math.PI) * radius
				];

				steps[i].paint(this.coords[0] + pos[0], this.coords[1] + pos[1]);
			}
		}
	};

	this.hoverIn = function() {
		if (this.fade == 0 && hoverEuclid == this.id) {
			this.fadeInTask.interval = this.interval;
			this.fadeInTask.repeat(this.repeats);
			this.fadeInTask.execute();
		}
	};

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
	};

	this.idleout = function() {
		if (this.fade == 1) {
			this.fadeOutTask.interval = this.interval;
			this.fadeOutTask.repeat(this.repeats);
			this.fadeOutTask.execute();
		}
	};

	this.onidleout = function() {
		if (this.fade > 0) {
			this.fadeOutTask.interval = this.interval;
			this.fadeOutTask.repeat(this.repeats);
			this.fadeOutTask.execute();
		}
	};
};

var Lines = function(coords, move, skew) {
	this.coords = coords;
	this.move = move;
	this.skew = skew;

	this.repeatsHover = 25;
	this.intervalHover = 4;
	this.fade = 0;

	this.prevValue = [this.move, this.skew];
	this.nextValue = [this.move, this.skew];

	this.lineMove = [
		this.move, this.move, this.move,
		this.move, this.move, this.move
	];

	this.lineSkew = [
		this.skew, this.skew, this.skew,
		this.skew, this.skew, this.skew
	];

	this.animateHoverIn = function() {
		this.fade = arguments.callee.task.iterations / (this.repeatsHover);
	};

	this.animateHoverOut = function() {
		this.fade = 1 - arguments.callee.task.iterations / (this.repeatsHover);

		if (this.fade <= 0) {
			this.fade = 0;
			arguments.callee.task.cancel();
		}
	};

	this.hoverInTask = new Task(this.animateHoverIn, this);
	this.hoverOutTask = new Task(this.animateHoverOut, this);

	this.setValue = function(x, y) {
		this.nextValue = [
			clamp(this.nextValue[0] - y, 0, 1), 
			clamp(this.nextValue[1] + x, 0, 1)
		];
	};

	this.updateValue = function() {
		this.move = lerp(this.prevValue[0], this.nextValue[0], 0.1);
		this.skew = lerp(this.prevValue[1], this.nextValue[1], 0.1);

		for (var i = 0; i < 6; ++i) {
			var speed = 0.01 + i * 0.1;

			this.lineMove[i] = lerp(this.prevValue[0], this.nextValue[0], speed);
			this.lineSkew[i] = lerp(this.prevValue[1], this.nextValue[1], speed);
		}

		this.prevValue = [this.move, this.skew];
	};

	this.getValue = function() {
		return [this.move, this.skew];
	};

	this.paint = function() {
		with (mgraphics) {
			set_line_width(2);
			set_line_cap("none");

			for (var i = 0; i < 6; ++i) {
				var skewScaled = (this.lineSkew[i] * 2 - 1) * 20;
				var height = (this.lineMove[i] * 2 - 1) * 20;

				if (i == 0) {
					set_source_rgba(highColor);
				} else if (i < 3) {
					colorMix(midColor, hoverColor, ease_in_out_cubic(this.fade));
				} else {
					colorMix(lowColor, hoverColor, ease_in_out_cubic(this.fade));
				}

				move_to(
					this.coords[0], 
					this.coords[1] + 1 + i * 11
				);
				line_to(
					this.coords[0] + 40 + skewScaled,
					this.coords[1] + 1 + i * 11 - height);
				line_to(
					this.coords[0] + 76, 
					this.coords[1] + 1 + i * 11);
				stroke();
			}
		}
	};

	this.onidle = function(x, y) {
		if (
			x > this.coords[0] - 5 && 
			x < this.coords[0] + 78 && 
			y > this.coords[1] - 20 && 
			y < this.coords[1] + 75
		) {
			hoverLines = 1;

			if (this.fade == 0) {
				this.hoverInTask.interval = this.intervalHover;
				this.hoverInTask.repeat(this.repeatsHover);
				this.hoverInTask.execute();
			}
		} else {
			hoverLines = 0;

			if (this.fade == 1) {
				this.hoverOutTask.interval = this.intervalHover;
				this.hoverOutTask.repeat(this.repeatsHover);
				this.hoverOutTask.execute();
			}
		}
	};

	this.idleout = function() {
		if (this.fade > 0) {
			this.hoverOutTask.interval = this.intervalHover;
			this.hoverOutTask.repeat(this.repeatsHover);
			this.hoverOutTask.execute();
		}
	};
};

var Vertex = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
};

var Cube = function(coords, rx, ry) {
	/*
	3D cube projection based on:
	https://youtu.be/gx_Sx5FeTAk
	*/

	this.coords = coords;
	this.rx = rx;
	this.ry = ry;

	this.repeatsHover = 25;
	this.intervalHover = 4;
	this.fade = 0;

	this.nextValue = [0, 0];
	this.rotateValue = [0, 0];

	this.animateHoverIn = function() {
		this.fade = arguments.callee.task.iterations / (this.repeatsHover);
	};

	this.animateHoverOut = function() {
		this.fade = 1 - arguments.callee.task.iterations / (this.repeatsHover);

		if (this.fade <= 0) {
			this.fade = 0;
			arguments.callee.task.cancel();
		}
	};

	this.hoverInTask = new Task(this.animateHoverIn, this);
	this.hoverOutTask = new Task(this.animateHoverOut, this);

	var size = 30;

	var vertices = [
		new Vertex(this.coords[0] - size, this.coords[1] - size, -size),
		new Vertex(this.coords[0] + size, this.coords[1] - size, -size),
		new Vertex(this.coords[0] + size, this.coords[1] + size, -size),
		new Vertex(this.coords[0] - size, this.coords[1] + size, -size),
		new Vertex(this.coords[0] - size * 0.2, this.coords[1] - size, size),
		new Vertex(this.coords[0] + size * 0.2, this.coords[1] - size, size),
		new Vertex(this.coords[0] + size * 0.2, this.coords[1] + size, size),
		new Vertex(this.coords[0] - size * 0.2, this.coords[1] + size, size)
	];

	var edges = [
		[0, 1], [1, 2], [2, 3], [3, 0],
		[0, 4], [1, 5], [2, 6], [3, 7],
		[4, 5], [5, 6], [6, 7], [7, 4]
	];

	this.onidle = function(x, y) {
		if (
			x > this.coords[0] - size * 2 &&
			x < this.coords[0] + size * 2 &&
			y > this.coords[1] - size * 2 &&
			y < this.coords[1] + size * 2
		) {
			hoverCube = 1;

			if (this.fade == 0) {
				this.hoverInTask.interval = this.intervalHover;
				this.hoverInTask.repeat(this.repeatsHover);
				this.hoverInTask.execute();
			}
		} else {
			hoverCube = 0;

			if (this.fade == 1) {
				this.hoverOutTask.interval = this.intervalHover;
				this.hoverOutTask.repeat(this.repeatsHover);
				this.hoverOutTask.execute();
			}
		}
	};

	this.idleout = function() {
		if (this.fade > 0) {
			this.hoverOutTask.interval = this.intervalHover;
			this.hoverOutTask.repeat(this.repeatsHover);
			this.hoverOutTask.execute();
		}
	};

	this.rotate = function(rx, ry, rz) {
		for (var i = 0; i < vertices.length; ++i) {
			var dx = vertices[i].x - this.coords[0];
			var dy = vertices[i].y - this.coords[1];
			var x = dx * Math.cos(rx) - dy * Math.sin(rx);
			var y = dx * Math.sin(rx) + dy * Math.cos(rx);
			vertices[i].x = x + this.coords[0];
			vertices[i].y = y + this.coords[1];
		}

		for (var i = 0; i < vertices.length; ++i) {
			var dy = vertices[i].y - this.coords[1];
			var dz = vertices[i].z;
			var y = dy * Math.cos(ry) - dz * Math.sin(ry);
			var z = dy * Math.sin(ry) + dz * Math.cos(ry);
			vertices[i].y = y + this.coords[1];
			vertices[i].z = z;
		}

		for (var i = 0; i < vertices.length; ++i) {
			var dx = vertices[i].x - this.coords[0];
			var dz = vertices[i].z;
			var x = dz * Math.sin(rz) + dx * Math.cos(rz);
			var z = dz * Math.cos(rz) - dx * Math.sin(rz);
			vertices[i].x = x + this.coords[0];
			vertices[i].z = z;
		}
	};

	this.setValue = function(rx, ry) {
		this.rx = this.rx - rx / 5;
		this.ry = this.ry + ry / 5;

		this.nextValue = [rx, ry];
	};

	this.updateValue = function() {
		if (this.nextValue[0] > 0) {
			this.nextValue[0] = lerp(this.nextValue[0], 0.01, 0.025);
		} else if (this.nextValue[0] < 0) {
			this.nextValue[0] = lerp(this.nextValue[0], -0.01, 0.025);
		}
		
		if (this.nextValue[1] > 0) {
			this.nextValue[1] = lerp(this.nextValue[1], 0.01, 0.025);
		} else if (this.nextValue[1] < 0) {
			this.nextValue[1] = lerp(this.nextValue[1], -0.01, 0.025);
		}

		this.rotateValue = this.nextValue;
	};

	this.getValue = function() {
		return [this.rx, this.ry];
	};

	this.paint = function() {
		with (mgraphics) {
			set_line_width(2);
			set_line_cap("round");

			for (var i = 0; i < edges.length; ++i) {
				var edge = edges[i];

				if (i < 4) {
					colorMix(lowColor, hoverColor, ease_in_out_cubic(this.fade));
				} else if (i < 8) {
					colorMix(midColor, hoverColor, ease_in_out_cubic(this.fade));
				} else {
					set_source_rgba(highColor);
				}

				move_to(vertices[edge[0]].x, vertices[edge[0]].y);
				line_to(vertices[edge[1]].x, vertices[edge[1]].y);
				stroke();
			}
		}
	};
};

var Spring = function(coords, tension) {
	this.coords = coords;
	this.tension = tension;
	this.prev = this.tension;
	this.nextValue = this.tension;
	
	this.repeatsHover = 25;
	this.intervalHover = 4;
	this.fade = 0;
	this.velocity = 0;
	
	/* 
	Spring easing function by Tanner Linsley:
	https://github.com/tannerlinsley/springer
	*/

	this.interpolateSpring = function(from, to, velocity, stiffness, damping) {
		var springStep = -stiffness * (from - to);
		var damper = -damping * velocity;
		var a = springStep + damper;
		var newVelocity = velocity + a * 0.1;
		var newValue = from + newVelocity * 0.1;

		if (Math.abs(newVelocity) < 1 && Math.abs(newValue - to) < 1) {
			this.tension = to;
			this.velocity = 0;
		}
		this.tension = newValue;
		this.velocity = newVelocity;
	};

	this.animateHoverIn = function() {
		this.fade = arguments.callee.task.iterations / (this.repeatsHover);
	};
	
	this.animateHoverOut = function() {
		this.fade = 1 - arguments.callee.task.iterations / (this.repeatsHover);

		if (this.fade <= 0) {
			this.fade = 0;
			arguments.callee.task.cancel();
		}
	};

	this.updateValue = function() {
		this.interpolateSpring(
			this.prev, this.nextValue * 0.65 + 0.35, this.velocity, 50, 2.5);
		this.prev = this.tension;
	};

	this.hoverInTask = new Task(this.animateHoverIn, this);
	this.hoverOutTask = new Task(this.animateHoverOut, this);

	this.setValue = function(x) {
		this.prev = this.tension;
		this.nextValue = clamp(this.nextValue - x, 0, 1);
	};

	this.onidle = function(x, y) {
		if (
			x > this.coords[0] - 5 &&
			x < this.coords[0] + 28 &&
			y > this.coords[1] - 20 &&
			y < this.coords[1] + 75
		) {
			hoverSpring = 1;

			if (this.fade == 0) {
				this.hoverInTask.interval = this.intervalHover;
				this.hoverInTask.repeat(this.repeatsHover);
				this.hoverInTask.execute();
			}
		} else {
			hoverSpring = 0;

			if (this.fade == 1) {
				this.hoverOutTask.interval = this.intervalHover;
				this.hoverOutTask.repeat(this.repeatsHover);
				this.hoverOutTask.execute();
			}
		}
	};

	this.idleout = function() {
		if (this.fade > 0) {
			this.hoverOutTask.interval = this.intervalHover;
			this.hoverOutTask.repeat(this.repeatsHover);
			this.hoverOutTask.execute();
		}
	};

	this.paint = function() {
		with (mgraphics) {
			set_line_width(2);
			
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
				0,
				this.fade
			);

			for (var i = 0; i < 4; ++i) {
				curve(
					this.coords[0], 
					this.coords[1] + 5 + i * (10 * this.tension) + heightOffset,
					this.tension,
					1,
					this.fade
				);
			}

			for (var i = 0; i < 4; ++i) {
				curve(
					this.coords[0], 
					this.coords[1] + 5 + i * (10 * this.tension) + heightOffset,
					this.tension, 
					2,
					this.fade
				);
			}

			curve(
				this.coords[0], 
				this.coords[1] + 45 - heightOffset,
				this.tension, 
				3,
				this.fade
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
	};

	function curve(x, y, height, piece, hover) {
		with (mgraphics) {
			switch (piece) {
				case 0:
					move_to(x + 1, y + 10 * height);
					curve_to(
						x + 1, y + 4 * height,
						x + 6, y + 1 * height,
						x + 13, y + 1 * height
					);
					rel_line_to(0, -7);

					colorMix(midColor, hoverColor, ease_in_out_cubic(hover));
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

					colorMix(lowColor, hoverColor, ease_in_out_cubic(hover));
					stroke();
					break;

				case 2:
					move_to(x + 1, y);
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

					colorMix(midColor, hoverColor, ease_in_out_cubic(hover));
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

					colorMix(midColor, hoverColor, ease_in_out_cubic(hover));
					stroke();
					break;
			}
		}
	}
};

var Scroller = function(coords, text) {
	this.coords = coords;
	this.text = text;
	this.phase = [0, 0];
	this.hover = false;
	this.hoverDelta = 0;
	this.fade = 0;
	this.active = false;

	this.click = function() {
		if (this.hover) {
			this.active = !this.active;
			
			if (this.active) {
				this.phase = [0, 0];

				if (this.fade == 0) {
					this.fadeInTask.interval = this.interval;
					this.fadeInTask.repeat(this.repeats);
					this.fadeInTask.execute();
				}
			} else {
				if (this.fade == 1) {
					this.fadeOutTask.interval = this.interval;
					this.fadeOutTask.repeat(this.repeats);
					this.fadeOutTask.execute();
				}
			}
		}
	};

	this.animate = function() {
		this.phase[0] += 0.25 / this.text.length;
		this.phase[1] += 0.05;
		
		if (this.phase[0] >= 1) {
			if (this.active) {
				this.active = false;
				this.fadeOutTask.interval = this.interval;
				this.fadeOutTask.repeat(this.repeats);
				this.fadeOutTask.execute();
			}
			this.phase[0] = 0;
		}
		
		if (this.phase[1] >= 1) {
			this.phase[1] = 0;
		}	
	};

	this.setFrequency = function(x) {
		this.freq = clamp(this.freq + x, 0, 1);
	};

	this.repeats = 25;
	this.interval = 4;
	
	this.fadeIn = function() {
		this.fade = arguments.callee.task.iterations / (this.repeats);
	};
	
	this.fadeOut = function() {
		this.fade = 1 - arguments.callee.task.iterations / (this.repeats);
	};

	this.fadeInTask = new Task(this.fadeIn, this);
	this.fadeOutTask = new Task(this.fadeOut, this);

	this.onidle = function(x, y) {
		if (
			x > this.coords[0] - 5 && 
			x < this.coords[0] + 100 && 
			y > this.coords[1] - 5 && 
			y < this.coords[1] + 15
		) {			
			this.hover = true;
		} else {
			this.hover = false;
		}
	};

	this.animateTask = new Task(this.animate, this);

	this.paint = function() {
		with (mgraphics) {
			if (this.active) {
				for (var i = 0; i < 12; ++i) {
					var offset = Math.cos(this.phase[1] * TWO_PI + i * TWO_PI / 24) * 4;
				
					var phaseScale = this.phase[0] * (this.text.length - 11);
					var charOffset = Math.floor(phaseScale);
					var fade = 1;
				
					if (i == 0) {
						fade = 1 - phaseScale % 1;
					}
				
					if (i == 11) {
						fade = phaseScale % 1;
					}
				
					set_source_rgba(lowColor[0], lowColor[1], lowColor[2], fade * this.fade);
										
					draw_text(
						coords[0] + i * 7 - phaseScale % 1 * 7, 
						coords[1] + offset, 
						this.text.charAt(i + charOffset)
					);
				}
			}
		}
	};
};

var euclidOuter = new Circle(1, [98, 98], 45, 1, 0.2, 0);
var euclidInner = new Circle(2, [98, 98], 25, 1, 0.4, 0);

euclidOuter.update();
euclidInner.update();

var lines = new Lines([190, 70], 1, 0);
var cube = new Cube([360, 93], 0, 0);
var spring = new Spring([451, 73], 0);
var scrolltext = new Scroller([413, 176], 
	"      made by ess under strict supervision by cycling '74   ;-)   " +   
	"my love to the crew & gratz on max 9 ♥ ♥ ♥           " +
	"greets to mark fell & mat steel, " +
	"the fine folks at the max discord " +
	"and everyone out there making things that inspire. " + 
	"               "
);

scrolltext.animateTask.interval = 30;
scrolltext.animateTask.repeat();
scrolltext.animateTask.execute();

cube.rotate(-45, 45, 0);

var timeline = 0;

function update_state() {
	euclidOuter.update();
	euclidInner.update();
	mgraphics.redraw();
}

function paint() {
	var gen = this.patcher.getnamed("dsp");

	with (mgraphics) {
		set_source_rgba(bgColor);
		rectangle_rounded(0, 0, 525, 195, 16, 16);
		fill();

		euclidOuter.paint(lowColor);
		euclidInner.paint(midColor);
		spring.paint();
		lines.paint();
		cube.paint();
		
		gen.message("density_outer", euclidOuter.density);
		gen.message("offset_outer", euclidOuter.offset);
		gen.message("length_outer", euclidOuter.length);
		gen.message("density_inner", euclidInner.density);
		gen.message("offset_inner", euclidInner.offset);
		gen.message("length_inner", euclidInner.length);

		gen.message("line_move", lines.nextValue[0]);
		gen.message("line_skew", lines.nextValue[1]);
		
		gen.message("cube_x", cube.rx + cube.nextValue[0]);
		gen.message("cube_y", cube.ry + cube.nextValue[1]);
				
		gen.message("spring", spring.nextValue);

		set_source_rgba(lowColor);
		ess(462 - 90 * (scrolltext.fade * scrolltext.fade), 176);
		c74(493, 176);
		
		scrolltext.paint();
	}
}

function onidle(x, y) {
	euclidOuter.onidle(x, y);
	euclidInner.onidle(x, y);

	switch (hoverEuclid) {
		case 0:
			euclidOuter.idleout();
			euclidInner.idleout();
			break;
		
		case 1:
			euclidInner.idleout();
			euclidOuter.hoverIn();
			break;
		
		case 2:
			euclidOuter.idleout();
			euclidInner.hoverIn();
			break;
	}

	spring.onidle(x, y);
	lines.onidle(x, y);
	cube.onidle(x, y);
	scrolltext.onidle(x, y);

	mgraphics.redraw();
}

function onidleout() {
	hoverEuclid = 0;
	hoverSpring = 0;
	hoverLines = 0;
	hoverCube = 0;

	euclidOuter.onidleout();
	euclidInner.onidleout();
	cube.idleout();
	spring.idleout();
	lines.idleout();

	mgraphics.redraw();
}

var cursorClick = [0, 0];
var cursorPrev = [0, 0];

function onclick(x, y) {
	cursorClick = [x, y];
	cursorPrev = [x, y];
	scrolltext.click();

	mgraphics.redraw();
}

function ondrag(x, y, but) {
	var cursorDelta = [x - cursorPrev[0], y - cursorPrev[1]];

	if (but) {
		if (hoverEuclid == 1) {
			euclidOuter.setValue(cursorDelta[0] / 300, cursorDelta[1] / 300);
		}

		if (hoverEuclid == 2) {
			euclidInner.setValue(cursorDelta[0] / 300, cursorDelta[1] / 300);
		}

		if (hoverSpring) {
			spring.setValue(cursorDelta[1] / 100);
		}

		if (hoverLines) {
			lines.setValue(cursorDelta[0] / 50, cursorDelta[1] / 50);
		}

		if (hoverCube) {
			cube.setValue(cursorDelta[0] / 100, cursorDelta[1] / 100);
		}
	}
	cursorPrev = [x, y];
	mgraphics.redraw();
}

function ess(x, y) {
	with (mgraphics) {
		move_to(x, y);
		line_to(x + 11, y);
		line_to(x + 11, y + 1);
		curve_to(
			x + 5, y + 2.5,
			x + 1, y + 5,
			x + 1, y + 9
		);
		curve_to(
			x + 1, y + 11.75,
			x + 3.5, y + 13.75,
			x + 6.5, y + 12.75
		);
		curve_to(
			x + 9.5, y + 11.75,
			x + 12.5, y + 5.5,
			x + 12.5, y + 5.5
		);
		curve_to(
			x + 15, y + 0.5,
			x + 19, y,
			x + 21.5, y
		);
		curve_to(
			x + 24, y,
			x + 28, y + 1.75,
			x + 28, y + 6
		);
		curve_to(
			x + 28, y + 9,
			x + 26.5, y + 11,
			x + 23.75, y + 12.5
		);
		line_to(x + 23.75, y + 13);
		line_to(x + 28, y + 14);
		line_to(x + 28, y + 15);
		line_to(x + 17, y + 15);
		line_to(x + 17, y + 14);
		curve_to(
			x + 23, y + 12.5,
			x + 27, y + 10,
			x + 27, y + 6
		);
		curve_to(
			x + 27, y + 3.25,
			x + 24.5, y + 1.25,
			x + 21.5, y + 2.25
		);
		curve_to(
			x + 18.5, y + 3.25,
			x + 15.5, y + 9.5,
			x + 15.5, y + 9.5
		);
		curve_to(
			x + 13, y + 14.5,
			x + 9, y + 15,
			x + 6.5, y + 15
		);
		curve_to(
			x + 4, y + 15,
			x, y + 13.25,
			x, y + 9
		);
		curve_to(
			x, y + 6,
			x + 1.5, y + 4,
			x + 4.25, y + 2.5
		);
		line_to(x + 4.25, y + 2);
		line_to(x, y + 1);
		close_path();
		fill();

	}
}

function c74(x, y, scale) {
	with (mgraphics) {
		move_to(x, y);
		curve_to(
			x + 3, y,
			x + 5, y + 2,
			x + 5, y + 5
		);
		line_to(x + 5, y + 9);
		curve_to(
			x + 2, y + 9,
			x, y + 7,
			x, y + 4
		);
		close_path();
		fill();

		move_to(x + 5, y);
		line_to(x + 11, y);
		curve_to(
			x + 14, y,
			x + 16, y + 2,
			x + 16, y + 5
		);
		line_to(x + 10, y + 5);
		curve_to(
			x + 7, y + 5,
			x + 5, y + 3,
			x + 5, y
		);
		fill();

		move_to(x + 11, y + 6);
		line_to(x + 11, y + 15);
		curve_to(
			x + 14, y + 15,
			x + 16, y + 13,
			x + 16, y + 10
		);
		line_to(x + 16, y + 6);
		close_path();
		fill();

		move_to(x + 17, y);
		line_to(x + 17, y + 9);
		line_to(x + 22, y + 9);
		line_to(x + 22, y + 5);
		curve_to(
			x + 22, y + 2,
			x + 20, y,
			x + 17, y
		);
		fill();

		move_to(x + 28, y);
		curve_to(
			x + 25, y,
			x + 23, y + 2,
			x + 23, y + 5
		);
		line_to(x + 23, y + 15);
		curve_to(
			x + 26, y + 15,
			x + 28, y + 13,
			x + 28, y + 10
		);
		close_path();
		fill();
	}
}

function colorMix(colorA, colorB, mix) {
	mgraphics.set_source_rgba(
		lerp(colorA[0], colorB[0], mix),
		lerp(colorA[1], colorB[1], mix),
		lerp(colorA[2], colorB[2], mix),
		lerp(colorA[3], colorB[3], mix)
	);
}

function draw_text(x, y, text) {
	with (mgraphics) {
		select_font_face("Ableton Sans Medium");
		set_font_size(12, 0);

		var descent = font_extents()[1];
		var height = font_extents()[2];
		var metric = text_measure(text);

		move_to(x - metric[0] / 2, y + height - descent);
		show_text(text);
	}
}

function clamp(x, low, high) {
	return Math.min(Math.max(x, low), high);
}

function lerp(x, y, a) {
	return x + a * (y - x);
}

// from max-animation.js
function ease_in_out_cubic(t) {
	return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}