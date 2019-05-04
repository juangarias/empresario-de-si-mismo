const DIRECTION_PUSH_THRESHOLD = 4;
const BUTTON_PUSH_THRESHOLD = 40;

const AXES_HORIZONTAL = 0;
const AXES_VERTICAL = 1;

const BUTTON_BLUE = 0;
const BUTTON_RED = 1;
const BUTTON_YELLOW = 2;
const BUTTON_GREEN = 3;
const BUTTON_LEFT_SHOULDER = 4;
const BUTTON_RIGHT_SHOULDER = 5;
const BUTTON_SELECT = 8;
const BUTTON_START = 9;

function Gamepad() {

	this.hackCounter = 0;
	this.hackLast = "";
	var self = this;

	this.rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  		window.webkitRequestAnimationFrame;

	this.rAFStop = window.cancelRequestAnimationFrame ||  window.mozCancelRequestAnimationFrame || 
		window.webkitCancelRequestAnimationFrame;

	this.connect = function(e) {
		self.waitButtons();
	};

	this.buttonPressed = function(buttonIndex) {
		var gamepad = self.getGamepad();
		return gamepad && gamepad.buttons 
			&& gamepad.buttons[buttonIndex] 
			&& gamepad.buttons[buttonIndex].pressed 
			&& gamepad.buttons[buttonIndex].value == 1.0;
	};

	this.hackDirection = function(action) {return self.hack(action, DIRECTION_PUSH_THRESHOLD)};
	this.hackButton = function(action) {return self.hack(action, BUTTON_PUSH_THRESHOLD)};

	this.hack = function(action, maxVaule) {
		if (action != self.hackLast || self.hackCounter == maxVaule) {
			self.hackLast = action;
			self.hackCounter = 0;
			return true;
		}

		self.hackCounter++;
		return false;
	};

	this.waitButtons = function() {
		var gamepad = self.getGamepad();

		if (self.buttonPressed(BUTTON_START)) {
			if (self.hackButton("start")) {
				self.start();
			}
		} else if (self.buttonPressed(BUTTON_LEFT_SHOULDER) && 
			self.buttonPressed(BUTTON_RED)) {
			if (self.hackButton("leftShoulderRed")) {
				self.leftShoulderRed();
			}
		} else if (self.buttonPressed(BUTTON_LEFT_SHOULDER) && 
			self.buttonPressed(BUTTON_RIGHT_SHOULDER) && 
			self.buttonPressed(BUTTON_YELLOW)) {
			if (self.hackButton("bothShouldersYellow")) {
				self.bothShouldersYellow();
			}
		} else if (gamepad.axes[AXES_HORIZONTAL] == 1) {
			if (self.hackDirection("right")) {
				self.right();
			}
		} else if (gamepad.axes[AXES_HORIZONTAL] == -1) {
			if (self.hackDirection("left")) {
				self.left();
			}
		} else if (gamepad.axes[AXES_VERTICAL] == -1) {
			if (self.hackDirection("up")) {
				self.up();
			}
		} else if (gamepad.axes[AXES_VERTICAL] == 1) {
			if (self.hackDirection("down")) {
				self.down();
			}
		} else if (self.buttonPressed(BUTTON_RED)) {
			if (self.hackButton("red")) {
				self.red();
			}
		} else if (self.buttonPressed(BUTTON_YELLOW)) {
			if (self.hackButton("yellow")) {
				self.yellow();
			}
		} else if (self.buttonPressed(BUTTON_GREEN)) {
			if (self.hackButton("green")) {
				self.green();
			}
		} else if (self.buttonPressed(BUTTON_BLUE)) {
			if (self.hackButton("blue")) {
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
		self.up = function() {};//console.log("Dummy up")};
		self.down = function() {};//console.log("Dummy down")};
		self.left = function() {};//console.log("Dummy left")};
		self.right = function() {};//console.log("Dummy right")};

		self.red = function() {};//console.log("Dummy red")};
		self.green = function() {};//console.log("Dummy green")};
		self.yellow = function() {};//console.log("Dummy yellow")};
		self.blue = function() {};//console.log("Dummy blue")};
		self.start = function() {};//console.log("Dummy start")};
		self.leftShoulderRed = function() {};//console.log("Dummy leftShoulderRed")};
		self.bothShouldersYellow = function() {};//console.log("Dummy bothShouldersYellow")};
	};

	window.addEventListener("gamepadconnected", this.connect);
	window.addEventListener("gamepaddisconnected", this.disconnect);
	self.clearEventHandlers();
}