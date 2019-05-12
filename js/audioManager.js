function AudioManager() {

	this.playingWaitPlayer = false;
	this.currentTheme = "";
	this.currentVoice = false;
	this.currentGameoverSound = false;
	this.playActionSoundInterval = false;
	this.themesNav = new ConsecutiveIdIterator("theme", 4);
	this.audiosAccionesElegidas = [];
	this.audiosFrases = {};
	this.audiosFrases["comer"] = new ConsecutiveIdIterator("comer_audio_frase", 3);
	this.audiosFrases["dormir"] = new ConsecutiveIdIterator("dormir_audio_frase", 3);
	this.audiosFrases["trabajar"] = new ConsecutiveIdIterator("trabajar_audio_frase", 2);
	this.audiosFrases["ocio"] = new ConsecutiveIdIterator("ocio_audio_frase", 1);
	this.audiosFrases["entrenar"] = new ConsecutiveIdIterator("entrenar_audio_frase", 4);
	this.audiosFrases["sexo"] = new ConsecutiveIdIterator("sexo_audio_frase", 4);
	this.audiosFrases["votar"] = new ConsecutiveIdIterator("votar_audio_frase", 4);
	this.audiosFrases["belleza"] = new ConsecutiveIdIterator("belleza_audio_frase", 4);
	this.audiosGameover = new ConsecutiveIdIterator("gameover_audio", 4);
	var self = this;

	this.silence = function() {
		self.stopTheme();
		if (self.currentVoice) {
			self.stopSound(self.currentVoice);
		}
		self.stopGameover();
		clearInterval(self.playActionSoundInterval);
	};

	this.playWaitPlayer = function() {
		self.playSound("wait_player");
		document.getElementById("wait_player").loop = true;
	};

	this.stopWaitPlayer = function() {
		self.playingWaitPlayer = false;
		self.stopSound("wait_player");
	};

	this.avatarSelected = function(avatar) {
		var audioAvatar = avatar + "_audio";
		self.playSound(audioAvatar);
		$("#" + audioAvatar).on("ended", function() {self.playSound("loading_audio")});
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
		self.currentGameoverSound = self.audiosGameover.next();
		self.playSound(self.currentGameoverSound);
	};

	this.stopGameover = function() {
		if (self.currentGameoverSound) {
			self.stopSound(self.currentGameoverSound);
		}
		self.currentGameoverSound = false;
	};

	this.playYouWin = function() {
		self.playSound("youwin_audio");
	};

	this.actionSelected = function(action) {
		//console.log("actionSelected [%s]", action);
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
		console.log("playActionSound");
		self.playActionSoundInterval = setInterval(self.playNextActionPhrase, 2000);
	};

	this.playNextActionPhrase = function() {
		var audio = self.audiosAccionesElegidas.shift();
		//console.log("playNextActionPhrase [%s] on interval [%s]", audio, self.playActionSoundInterval);
  		if (audio) {
    		$("#" + audio).bind("ended", self.playNextActionPhrase);
		    self.playVoice(audio);
  		}
		clearInterval(self.playActionSoundInterval);
	};

	this.playSound = function(audio) {
	  var sound = document.getElementById(audio);
	  if (sound) {
	    try {
	    	sound.play();
	    } catch(e) {
	    	console.log(e);
	    }
	  } else {
	    console.log("Audio no encontrado %s", audio);
	  }
	};

	this.stopSound = function(audio) {
	  var sound = document.getElementById(audio);
	  if (sound) {
	    sound.pause();
	    sound.currentTime = 0;
	  } else {
	    console.log("Audio no encontrado %s", audio);
	  }
	};
}