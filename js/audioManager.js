function AudioManager() {

	this.currentTheme = "";
	this.currentVoice = false;
	this.playActionSoungInterval = false;
	this.themesNav = new ConsecutiveIdIterator("theme", 4);
	this.audiosAccionesElegidas = [];
	this.audiosFrases = {};
	this.audiosFrases["comer"] = new ConsecutiveIdIterator("comer_audio_frase", 3);
	this.audiosFrases["dormir"] = new ConsecutiveIdIterator("dormir_audio_frase", 1);
	this.audiosFrases["trabajar"] = new ConsecutiveIdIterator("trabajar_audio_frase", 2);
	this.audiosFrases["ocio"] = new ConsecutiveIdIterator("ocio_audio_frase", 1);
	this.audiosFrases["entrenar"] = new ConsecutiveIdIterator("entrenar_audio_frase", 4);
	this.audiosFrases["sexo"] = new ConsecutiveIdIterator("sexo_audio_frase", 4);
	this.audiosFrases["votar"] = new ConsecutiveIdIterator("votar_audio_frase", 4);
	this.audiosFrases["belleza"] = new ConsecutiveIdIterator("belleza_audio_frase", 4);

	var self = this;

	this.silence = function() {
		self.stopTheme();
		if (self.currentVoice) {
			self.stopSound(self.currentVoice);
		}
		clearInterval(self.playActionSoungInterval);
	};

	this.playWaitPlayer = function() {
//		self.playSound("wait_player");
//		$("#wait_player").on("ended", function() {
//			self.playSound
//		});
	};

	this.avatarSelected = function(avatar) {
		self.playSound(avatar + "_audio");
  		self.playSound("loading_audio");
	};

	this.stopLoading = function() {
		self.stopSound("loading_audio");
	};

	this.lowThemeVolume = function() {
	  	$("#" + self.currentTheme).prop("volume", 0.1);
	};

	this.resetThemeVolume = function() {
	  	$("#" + self.currentTheme).prop("volume", 0.4);
	};

	this.playTheme = function() {
		self.currentTheme = self.themesNav.next();
		self.playSound(self.currentTheme);
		self.resetThemeVolume();
	};

	this.stopTheme = function() {
		self.stopSound(self.currentTheme);
	};

	this.warnCountdown = function() {
		self.playSound("countdown_audio");
	};

	this.playGameover = function() {
		self.playSound("gameover_audio");
	};

	this.playYouWin = function() {
		self.playSound("youwin_audio");
	};

	this.actionSelected = function(action) {
		var voice = action + "_audio";
		self.playVoice(voice);
		self.addSelectedAction(action);
	};	

	this.playVoice = function(voice) {
		self.lowThemeVolume();
		self.playSound(voice);
		self.currentVoice = voice;
		$("#" + voice).on("ended", function() {
			self.resetThemeVolume();
			self.currentVoice = false;
		});
	};

	this.addSelectedAction = function(action) {
		self.audiosAccionesElegidas.push(self.audiosFrases[action].next());
	};

	this.playActionSound = function() {
		self.playActionSoungInterval = setInterval(function() {
			var audio = self.audiosAccionesElegidas.shift();
	  		if (audio) {
			    self.playVoice(audio);
	    		$("#" + audio).on("ended", self.playActionSound);
	  		}
			clearInterval(t);
		}, 2000);
	};

	this.playSound = function(audio) {
	  var sound = document.getElementById(audio);
	  if (sound) {
	    sound.play();
	  } else {
	    console.log("Audio no encontrado %s", audio);
	  }
	};

	this.stopSound = function(audio) {
	  var sound = document.getElementById(audio);
	  if (sound) {
	    sound.pause();
	  } else {
	    console.log("Audio no encontrado %s", audio);
	  }
	};
}