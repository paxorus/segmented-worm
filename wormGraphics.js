/**
 * Prakhar Sahay 12/09/2016
 * 
 */


WormGraphics.prototype.SPEED = 10;
WormGraphics.prototype.SIZE = 20;
Joint.prototype.RADIUS = 10;
Joint.prototype.JOINT = $("<div>", {class: "blue-joint"});
Segment.prototype.WIDTH = 25;
Segment.prototype.SEGMENT = $("<div>", {class: "blue-segment"});

/**
 * WormGraphics class
 * Creates a div-based segmented worm. Using an integer SPEED and requestAnimationFrame,
 * it can move toward a point.
 */
function WormGraphics() {
	var node = $("<div>", {class: "worm"});
	node.css('left', window.innerWidth / 2);
	node.css('top', window.innerHeight / 2);

	var head = new Joint(node);
	this.joints = [head];
	this.segments = [];

	for (var i = 0; i < this.SIZE; i ++) {
		var previousJoint = this.joints[i];
		var joint = previousJoint.extend();
		this.joints.push(joint);
		var segment = previousJoint.link(joint);
		this.segments.push(segment);
	}
	$("body").append(node);

	this.moveTo = function(x, y) {
		head.moveTo(x, - y);
	}
	/**
	 * Position of head relative to worm node.
	 */
	this.headPosition = function () {
		return [head.x, - head.y];
	}
	/**
	 * Position of head relative to page.
	 */
	this.position = function () {
		return [int(node.css('left')) + head.x, int(node.css('top')) - head.y]
	}

	var target = [];
	var keepGoing = true;

	this.seek = function (x, y) {
		target = [x, y];
		keepGoing = true;
		this.accelerate();
	}
	this.retarget = function (x, y) {
		target = [x, y];
	}
	this.stop = function () {
		keepGoing = false;
	}

	this.accelerate = function () {
		var head = this.headPosition();
		var position = this.position();

		var distance = linearDistance(position, target);
		if (distance < this.SPEED) {
			// instead of vibrating over the target, stop when target reached
			return;
		}
		var theta = Math.atan2(position[1] - target[1], target[0] - position[0]);
		var newX = Math.cos(theta) * this.SPEED + head[0];
		var newY = - Math.sin(theta) * this.SPEED + head[1];
		this.moveTo(newX, newY);


		if (keepGoing) {
			var worm = this;
			requestAnimationFrame(function () {
				worm.accelerate();
			});
		}
	}
}

/**
 * Joint class
 * x: pixels left relative to worm (left)
 * y: pixels up relative to worm (-top)
 */
function Joint(node, leader) {
	var view;

	this.construct = function () {
		this.leader = leader || null;

		view = this.JOINT.clone();
		view.appendTo(node);

		if (leader) {
			// has a joint in front of it, randomly position WIDTH away
			var theta = Math.random() * 2 * Math.PI;
			var randomX = leader.x + Segment.prototype.WIDTH * Math.cos(theta);
			var randomY = leader.y - Segment.prototype.WIDTH * Math.sin(theta);
			this.update(randomX, randomY);
		} else {
			// is head
			var position = node.position();
			this.update(position.top, - position.left);
		}
	}

	this.extend = function () {
		return new Joint(node, this);
	}
	this.link = function (j) {
		return new Segment(node, this, j);
	}
	this.update = function (x, y) {
		this.x = x;
		this.y = y;
		view.css('left', x - this.RADIUS);
		view.css('top', - y - this.RADIUS);
	}
	this.setBackSegment = function (segment) {
		this.backSegment = segment;
	}
	this.moveTo = function (x, y) {
		this.update(x, y);
		if (this.backSegment) {
			this.backSegment.moveTo(x, y);
		}
	}

	this.construct();
}

/**
 * Segment class
 */
function Segment(node, joint1, joint2) {

	var view = this.SEGMENT.clone();
	view.appendTo(node);

	joint1.setBackSegment(this);

	this.update = function () {
		this.x = (joint1.x + joint2.x) / 2;
		this.y = (joint1.y + joint2.y) / 2;
		this.theta = Math.atan2((joint1.y - joint2.y), (joint2.x - joint1.x));

		view.css('left', this.x - this.WIDTH / 2);
		view.css('top', - this.y - Joint.prototype.RADIUS);
		view.css('transform', 'rotate(' + this.theta * 180 / Math.PI + 'deg)');
	}
	this.moveTo = function (x, y) {
		// compute new angle (the direction of the pull)
		var theta = Math.atan2((joint1.y - joint2.y), (joint2.x - joint1.x));

		// reset distance to WIDTH
		var newX = this.WIDTH * Math.cos(theta) + joint1.x;
		var newY = - this.WIDTH * Math.sin(theta) + joint1.y;
		joint2.moveTo(newX, newY);
		this.update();
	}
	this.update();
}


function int(s) {
	return parseInt(s, 10);
}

function linearDistance(A, B) {
	return Math.sqrt(Math.pow(A[0] - B[0], 2) + Math.pow(A[1] - B[1], 2));
}