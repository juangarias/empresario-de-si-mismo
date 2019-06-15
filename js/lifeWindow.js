const ENERGY_BAR_START = 35;
const ENERGY_BAR_MIN = 0;
const ENERGY_BAR_WARN_LOW_CRITICAL = 11;
const ENERGY_BAR_WARN_LOW = 22;
const ENERGY_BAR_WARN_HIGH = 44;
const ENERGY_BAR_WARN_HIGH_CRITICAL = 55;
const ENERGY_BAR_MAX = 67;

function LifeWindow(audioManager) {

	this.monitorWindow = new DummyMonitor();
	this.audioManager = audioManager;
	this.gamepad = new Gamepad();
	this.avatarNav = new ArrayNavigator(["fitness","payasa","maga","vikinga","empresaria","hiphop"], 0);
	this.loadingIdIterator = new ConsecutiveIdIterator("#loading", 1);
	this.loadingTimer = false;
	this.energyHighWarningCount = 0;
	this.energyLowWarningCount = 0;
	var self = this;

	this.showMainScreen = function() {
		if (SHOW_MONITOR) {
			self.monitorWindow = window.open("monitor.html", "monitorWindow", "");
			var mt = setTimeout(function() {self.monitorWindow.wait(); clearInterval(mt)}, 3000);
		}

		self.prepareSettings();

		self.audioManager.playWaitPlayer();
		self.gamepadShowMainScreen();
		self.hideMenu();
		$("#avatarsmenu").hide();
		$("#userdata_container").hide();
		$("#youWin").hide();
		$("#gameover").hide();
		self.hideLoading();
		$("#sky").hide();
		$("#video").show();
		$("#video").css({"top": "48px"});

		var startText = self.gamepad.isConnected() ? "Presione cualquier botón" : "Esperando control";
		$("#start_button").text(startText);
		$("#startscreen").show();
	};

	this.prepareSettings = function() {
		$("#mute").attr('checked', MUTE);
		$("#mute").change(function() { 
			MUTE = $(this).is(':checked');
			if (MUTE) {
				self.audioManager.silence();
			}
		});

		if (DEBUG) {
			$("#settings").show();
			$("body").css("cursor", "normal");
		} else {
			$("#settings").hide();
			$("body").css("cursor", "none");
		}
	};

	this.gamepadShowMainScreen = function () {
		self.gamepad.clearEventHandlers();
		self.gamepad.start = self.startButtonClicked;
		self.gamepad.red = self.gamepad.blue = self.gamepad.yellow = self.gamepad.green = self.startButtonClicked;
	}

	this.startButtonClicked = function() {
		audioManager.stopWaitPlayer();
		$("#startscreen").hide();
		$("#avatarsmenu").show();
		self.gamepadSelectAvatar();
	};

	this.gamepadSelectAvatar = function() {
		self.gamepad.clearEventHandlers();
		self.gamepad.red = self.gamepad.blue = self.gamepad.yellow = self.gamepad.green = self.avatarClicked;
		self.gamepad.left = self.avatarLeft;
		self.gamepad.right = self.avatarRight;
	}

	this.avatarLeft = function () {  
		self.changeAvatarSelected(self.avatarNav.current(), self.avatarNav.previous());
	}

	this.avatarRight = function () {
		self.changeAvatarSelected(self.avatarNav.current(), self.avatarNav.next());
	}

	this.changeAvatarSelected = function (oldAvatar, newAvatar) {
		$("#" + oldAvatar).removeClass(oldAvatar + "-selected");
		$("#" + newAvatar).addClass(newAvatar + "-selected");
	}

	this.avatarClicked = function (avatar) {
		var avatar = avatar || self.avatarNav.current();
		self.showLoading(avatar);
	}

	this.showLoading = function(avatar) {
		self.monitorWindow.play(avatar);
		self.audioManager.avatarSelected(avatar);
		$("#video").hide();	
		$("#avatarsmenu").hide();
		$(self.loadingIdIterator.next()).show();

		self.gamepad.clearEventHandlers();
		self.gamepad.leftShoulderRed = self.resetGame;
		self.gamepad.bothShouldersYellow = self.startGame;

		self.resetLoadingTimer();
		self.updateLoadingCounter();
	};

	this.countDown;
	this.helpIdx;

	this.resetLoadingTimer = function() {
		if (self.loadingTimer) {
			clearTimeout(self.loadingTimer);
		}
		self.loadingTimer = false;
		self.countDown = 31;
		self.helpIdx = 0;
	};

	this.hideLoading = function() {
		audioManager.stopLoading();
		$(".loading-screen").hide();
	};

	this.updateLoadingCounter = function() {
		//console.log('updateLoadingCounter');
		if (self.countDown % 10 == 0) {
			$(".texto_vintage_loading_help").hide();
			$("#help" + self.helpIdx).show();
			self.helpIdx++;
		}

		self.countDown--;
		$("#loadingCountdown").text(self.countDown);
		if (self.countDown == 0) {
			self.startGame();
		} else {
			self.loadingTimer = setTimeout(self.updateLoadingCounter, 1166);
		}
	};

	this.startGame = function() {
		self.onGameStarted();
		self.resetLoadingTimer();
		self.audioManager.playTheme();
		self.hideLoading();
		$("#video").show();
		$("#video").css({"top": "0px"});
	};

	this.changeAction = function(nivel) {
		self.showMenu(nivel);
		self.monitorWindow.clearActions();
		$("#userdata_container").show();
		$("#gameover").hide();
		$("#startscreen").hide();
	};

	this.gamepadActionsMenu = function() {
		self.gamepad.clearEventHandlers();
		self.gamepad.red = self.gamepad.blue = self.gamepad.yellow = self.gamepad.green = self.actionSelected;
		self.gamepad.left = self.actionLeft;
		self.gamepad.right = self.actionRight;
		self.gamepad.leftShoulderRed = self.resetGame;
	};

	this.showMenu = function(nivel) {
		self.gamepadActionsMenu();
		if (nivel == 1) {
			self.actionsNavigator = new ArrayNavigator(["dormir", "trabajar"]);
			$("#actionsmenu1").show();
		} else if (nivel == 2) {
			self.actionsNavigator = new ArrayNavigator(["dormir", "trabajar", "votar"]);
			$("#actionsmenu2").show();
		} else if (nivel == 3) {
			self.actionsNavigator = new ArrayNavigator(["comer", "dormir", "trabajar", "votar", "belleza"]);
			$("#actionsmenu3").show();
		} else if (nivel == 4) {
			self.actionsNavigator = new ArrayNavigator(["comer", "dormir", "trabajar", "entrenar", "sexo", "votar", "belleza"]);
			$("#actionsmenu4").show();
		} else {
			switch (nivel) {
				case 5:
				$("#actionsmenu5 #titulo_action p").html("Seleccion&aacute; <span class=\"cantidad_acciones\">TRES</span> acciones");
				break;
				case 6:
				$("#actionsmenu5 #titulo_action p").html("Seleccion&aacute; <span class=\"cantidad_acciones\">DOS</span> acciones");
				break;
				case 7:
				$("#actionsmenu5 #titulo_action p").html("Seleccion&aacute; <span class=\"cantidad_acciones\">TRES</span> acciones");
				break;
				case 8:
				$("#actionsmenu5 #titulo_action p").html("Seleccion&aacute; <span class=\"cantidad_acciones\">CUATRO</span> acciones");
				break;
				default:
			}
			self.actionsNavigator = new ArrayNavigator(["comer", "dormir", "trabajar", "ocio", "entrenar", "sexo", "votar", "belleza"]);
			$("#actionsmenu5").show();
		}
	};

	this.actionSelected = function (action) {
		var action = action || self.actionsNavigator.current();
		if (typeof action === 'undefined') {
			return;
		}

		$(".contenedor." + action).addClass(action + '-selected');
		self.monitorWindow.action(action);
		self.onActionTriggered(action);
	}

	this.setChangeActionWarningText = function(seconds) {
		$("#cambiar_escena_button p.texto_cambiar_escena").text(seconds);
	};

	this.actionRight = function () {
		self.changeActionSelected(self.actionsNavigator.current(), self.actionsNavigator.next());
	}

	this.actionLeft = function () {
		self.changeActionSelected(self.actionsNavigator.current(), self.actionsNavigator.previous());
	}

	this.changeActionSelected = function (oldAction, newAction) {
		$(".contenedor." + oldAction).removeClass(oldAction + "-selected");
		$(".contenedor." + newAction).addClass(newAction + "-selected");
	}

	this.hideMenu = function() {
		self.gamepad.clearEventHandlers();
		$(".actionsmenu-screen").hide();
	    self.deselectActions();
	};

	this.deselectActions = function() {
		$(".comer").removeClass('comer-selected');
		$(".dormir").removeClass('dormir-selected');
		$(".trabajar").removeClass('trabajar-selected');
		$(".ocio").removeClass('ocio-selected');
		$(".entrenar").removeClass('entrenar-selected');
		$(".sexo").removeClass('sexo-selected');
		$(".votar").removeClass('votar-selected');
		$(".belleza").removeClass('belleza-selected');
	};

	this.updateBars = function(ansiedad,felicidad,miedo,energia,hambre,dinero) {
		self.energyHighWarningCount = self.energyLowWarningCount = 0;
		self.updateStyleLessBetter(ansiedad, "#ansiedad p");
		self.updateStyleMoreBetter(felicidad, "#felicidad p");
		self.updateStyleLessBetter(miedo, "#value p");
		self.updateStyleMoreBetter(energia, "#energia p");
		self.updateStyleMoreBetter(hambre, "#hambre p");
		self.updateStyleMoreBetter(dinero, "#dinero p");

		$("#ansiedad").width(ansiedad + "px");
		$("#felicidad").width(felicidad + "px");
		$("#miedo").width(miedo + "px");
		$("#energia").width(energia + "px");
		$("#hambre").width(hambre + "px");
		$("#dinero").width(dinero + "px");
	};

	this.updateStyleMoreBetter = function(value, idBar) {
		$(idBar).removeClass();
		if (value <= ENERGY_BAR_MIN) {
			$(idBar).addClass("text_danger_style");
		} else if (value < ENERGY_BAR_WARN_LOW_CRITICAL) {
			$(idBar).addClass("text_critical_style");
			self.energyLowWarningCount++;
		} else if (value < ENERGY_BAR_WARN_LOW) {
			$(idBar).addClass("text_warning_style");
			self.energyLowWarningCount++;
		}
	};

	this.updateStyleLessBetter = function(value, idBar) {
		$(idBar).removeClass();
		if (value >= ENERGY_BAR_MAX) {
			$(idBar).addClass("text_danger_style");
		} else if (value > ENERGY_BAR_WARN_HIGH_CRITICAL) {
			$(idBar).addClass("text_critical_style");
			self.energyHighWarningCount++;
		} else if (value > ENERGY_BAR_WARN_HIGH) {
			$(idBar).addClass("text_warning_style");
			self.energyHighWarningCount++;
		}
	};

	this.updateTimerSeconds = function(minutes, seconds) {
		var seconds = seconds < 10 ? "0" + seconds : seconds;
		$("#tiempo p.reloj").text(minutes+':'+seconds);
	};

	this.hasEnergyLowWarning = function() {
		return self.energyLowWarningCount > 0;
	};

	this.hasEnergyHighWarning = function() {
		return self.energyHighWarningCount > 0;
	};

	this.totalEnergyWarning = function() {
		return self.energyLowWarningCount + self.energyHighWarningCount;
	};

	this.showWarnings = function() {
		if (self.hasEnergyLowWarning() || self.hasEnergyHighWarning()) {
			var html = "";
			if (self.totalEnergyWarning() > 1) {
				html = "<div>&iexcl;Cuidado! Algunos valores est&aacute;n en peligro</div>";
			} else {
				html = "<div>&iexcl;Cuidado! Un valor est&aacute; en peligro</div>";
			}
			$("#warningMessages").html(html);
			$("#warningMessages").show();
			setTimeout(self.hideWarnings, 7000);
		}
	};

	this.hideWarnings = function() {
		$("#warningMessages").hide();
	};

	this.showWinnerMessage = function() {
		self.monitorWindow.youWin();
		audioManager.playYouWin();
		$("#youWin").show();
		setTimeout(self.showAnimatedSky, TIEMPO_GAME_OVER / 2);
		setTimeout(self.resetGame, TIEMPO_GAME_OVER);
	};

	this.showAnimatedSky = function() {
		$("#video").hide();
		$("#sky").show();
		animate("#sky");
	};

	this.gameOver = function() {
		self.monitorWindow.gameOver();
		audioManager.playGameover();
		$("#gameover").show();
		self.gamepad.clearEventHandlers();
		setTimeout(self.resetGame, TIEMPO_GAME_OVER);
	};

	this.resetGame = function() {
		//console.log("resetGame");
		self.resetLoadingTimer();
		self.onResetGame();
		self.audioManager.silence();
		$("#avatarsmenu").hide();
		self.hideMenu();

		$("#ansiedad p").removeClass();
		$("#felicidad p").removeClass();
		$("#miedo p").removeClass();
		$("#energia p").removeClass();
		$("#hambre p").removeClass();
		$("#dinero p").removeClass();

		self.deselectActions();
		self.showMainScreen();
	};

	this.onGameStarted = function() {console.log("Dummy onGameStarted")};
	this.onActionTriggered = function() {console.log("Dummy onActionTriggered")};
	this.onResetGame = function() {console.log("Dummy onResetGame")};

	$("#start_button").click(self.startButtonClicked);
	
	$("#fitness").click(function() {self.avatarClicked("fitness")});
	$("#payasa").click(function() {self.avatarClicked("payasa")});
	$("#maga").click(function() {self.avatarClicked("maga")});
	$("#vikinga").click(function() {self.avatarClicked("vikinga")});
	$("#empresaria").click(function() {self.avatarClicked("empresaria")});
	$("#hiphop").click(function() {self.avatarClicked("hiphop")});

	$(".comer").click(function(){ self.actionSelected("comer");});
	$(".dormir").click(function(){ self.actionSelected("dormir");});
	$(".trabajar").click(function(){ self.actionSelected("trabajar");});
	$(".ocio").click(function(){ self.actionSelected("ocio");});
	$(".entrenar").click(function(){ self.actionSelected("entrenar");});
	$(".sexo").click(function(){ self.actionSelected("sexo");});
	$(".votar").click(function(){ self.actionSelected("votar");});
	$(".belleza").click(function(){ self.actionSelected("belleza");});

	$("#skipLoading").click(self.startGame);
	$("#resetGame").click(self.resetGame);
}