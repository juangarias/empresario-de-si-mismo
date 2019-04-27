const AXES_HORIZONTAL = 0;
const AXES_VERTICAL = 1;

const BUTTON_BLUE = 0;
const BUTTON_RED = 1;
const BUTTON_YELLOW = 2;
const BUTTON_GREEN = 3;

function Gamepad() {

	this.hackCounter = 0;
	this.hackLast = "";
	var self = this;

	this.rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  		window.webkitRequestAnimationFrame;

	this.rAFStop = window.cancelRequestAnimationFrame ||  window.mozCancelRequestAnimationFrame || 
		window.webkitCancelRequestAnimationFrame;

	this.connect = function(e) {
		console.log(e.gamepad);
		self.waitButtons();
	};

	this.buttonPressed = function(button) {
		return button && button.pressed && button.value == 1.0;
	};

	this.hack = function(action) {
		if (action != self.hackLast || self.hackCounter == 5) {
			self.hackLast = action;
			self.hackCounter = 0;
			return true;
		}

		self.hackCounter++;
		return false;
	};

	this.waitButtons = function() {
		var gamepad = self.getGamepad();

		if (gamepad.axes[AXES_HORIZONTAL] == 1) {
			if (self.hack("right")) {
				self.right();
			}
		} else if (gamepad.axes[AXES_HORIZONTAL] == -1) {
			if (self.hack("left")) {
				self.left();
			}
		} else if (gamepad.axes[AXES_VERTICAL] == -1) {
			if (self.hack("up")) {
				self.up();
			}
		} else if (gamepad.axes[AXES_VERTICAL] == 1) {
			if (self.hack("down")) {
				self.down();
			}
		} else if (self.buttonPressed(gamepad.buttons[BUTTON_RED])) {
			if (self.hack("red")) {
				self.red();
			}
		} else if (self.buttonPressed(gamepad.buttons[BUTTON_YELLOW])) {
			if (self.hack("yellow")) {
				self.yellow();
			}
		} else if (self.buttonPressed(gamepad.buttons[BUTTON_GREEN])) {
			if (self.hack("green")) {
				self.green();
			}
		} else if (self.buttonPressed(gamepad.buttons[BUTTON_BLUE])) {
			if (self.hack("blue")) {
				self.blue();
			}
		}

		var start = self.rAF.call(window, self.waitButtons);
	};

	this.disconnect = function() {
  		//Do nothing for now
	};

	this.isConnected = function() {
		return self.getGamepad() != undefined;
	};

	this.getGamepad = function() {
		var gamepads = navigator.getGamepads ? navigator.getGamepads() : 
			(navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
		if (!gamepads) {
    		return undefined;
		}
  		return gamepads[0];
	};

	this.clearEventHandlers = function() {
		self.up = function() {console.log("Dummy up")};
		self.down = function() {console.log("Dummy down")};
		self.left = function() {console.log("Dummy left")};
		self.right = function() {console.log("Dummy right")};

		self.red = function() {console.log("Dummy red")};
		self.green = function() {console.log("Dummy green")};
		self.yellow = function() {console.log("Dummy yellow")};
		self.blue = function() {console.log("Dummy blue")};
	};

	window.addEventListener("gamepadconnected", this.connect);
	window.addEventListener("gamepaddisconnected", this.disconnect);
	self.clearEventHandlers();
}