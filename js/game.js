var tiempo, tiempoAccion, tiempoCambioAccion;
var timer, timerAccion, timerCambioAccion;

var lifeMonitor;
var lifeWindow;

var nivel;
var accionesElegidas;

var effects = {};
effects["comer"] = [-2,3,-1,4,-4,-2];
effects["dormir"] = [-3,2,-1,3,3,-1];
effects["trabajar"] = [2,-2,1,-3,3,4];
effects["ocio"] = [-1,3,-1,1,2,-2];
effects["entrenar"] = [-2,1,-1,-3,3,-2];
effects["sexo"] = [-2,3,-1,-2,3,-1];
effects["votar"] = [3,1,2,-1,1,0];
effects["belleza"] = [-1,2,1,0,1,-4];

$(document).ready(function() {
  lifeMonitor = new LifeMonitor(ENERGY_BAR_MIN, ENERGY_BAR_MAX, ENERGY_BAR_START);
  lifeMonitor.resetFactors();
  
  lifeWindow = new LifeWindow();
  lifeWindow.onGameLoading  = onGameLoading;
  lifeWindow.onHideLoading = onHideLoading;
  lifeWindow.onGameStarted = onGameStarted;
  lifeWindow.onActionTriggered = onActionTriggered;
  lifeWindow.onResetGame = onResetGame;
  lifeWindow.showMainScreen();
});

var onHideLoading = function() {
  stopSound("loading_audio");
};

var onGameLoading = function(avatar) {
  avatarAudio = avatar  + "_audio";
  playSound(avatarAudio);
  playSound("loading_audio");
}

var onGameStarted = function() {
  nivel = 1;
  accionesElegidas = [];

  startGameTimer();
  startChangeActionTimer();
};

var startGameTimer = function() {
  tiempo = TIEMPO_TOTAL_JUEGO;
  timer = setInterval(function() {
    if (tiempo >= 0) {
      
      var minutes = Math.floor((tiempo % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((tiempo % (1000 * 60)) / 1000);

      lifeWindow.updateTimerSeconds(minutes, seconds);
      
      if (minutes == 0 && seconds == 0) {
        gameOver();
      }
    }
    tiempo-=1000;
  }, 1000);
};

var startChangeActionTimer = function() {
  lifeWindow.changeAction(nivel);
  tiempoCambioAccion = TIEMPO_CAMBIO_ACCION
  lifeWindow.setChangeActionWarningText(formatSeconds(tiempoCambioAccion));

  timerCambioAccion = setInterval(function() {
    if (tiempoCambioAccion > 0) {
      var seconds = formatSeconds(tiempoCambioAccion);
      if (seconds <= 5 && seconds > 0) {
        playSound("countdown_audio");
      }
      if (seconds < 10) {
        seconds = "0"+seconds;
      }
    } else {
      lifeMonitor.forceDie();
      gameOver();
    }

    lifeWindow.setChangeActionWarningText(seconds);
    tiempoCambioAccion-=1000;
  }, 1000);
};

var setActionTimer = function() {
  tiempoAccion = calcularTiempoAccion();

  timerAccion = setInterval(function() {
    if (tiempoAccion <= 0) {
      clearInterval(timerAccion);
      if(lifeMonitor.isDead()) {
        gameOver();
      } else {
        startChangeActionTimer();
      }
    }
    tiempoAccion-=1000;
  }, 1000);
};


var calcularTiempoAccion = function() {
  return (nivel == 1 || nivel == 2 || nivel == 4) ? TIEMPO_ACCION : TIEMPO_MULTI_ACCION;
}

var onActionTriggered = function(action) {
  var eff = effects[action];
  var i = 0;
  triggerAction(eff[i++],eff[i++],eff[i++],eff[i++],eff[i++],eff[i++], action + "_audio");
}

var triggerAction = function(ansiedadNew, felicidadNew, miedoNew, energiaNew, hambreNew, dineroNew, audio) {
  if (actionAlreadyAdded(audio)) {
    return;
  }

  accionesElegidas.push(audio);
  playSound(audio);
  lifeMonitor.cicle(ansiedadNew, felicidadNew, miedoNew, energiaNew, hambreNew, dineroNew);
  updateBars();

  if (levelComplete()) {
    clearInterval(timerAccion);
    clearInterval(timerCambioAccion);
    lifeWindow.deselectActions();
    lifeWindow.hideMenu();
    setActionTimer();

    nivel++;
    accionesElegidas = [];
  }
};

var actionAlreadyAdded = function(audio) {
  return accionesElegidas.includes(audio);
};

var levelComplete = function() {
  return nivel == 1 || nivel == 2 || nivel == 4 ||
    ([3, 6].includes(nivel) && accionesElegidas.length == 2) ||
    ([5, 7].includes(nivel) && accionesElegidas.length == 3) ||
    ([8, 9 , 10].includes(nivel) && accionesElegidas.length == 4);
};

var onResetGame = function() {
  lifeMonitor.resetGame();
  
  clearInterval(timer);
  clearInterval(timerAccion);
  clearInterval(timerCambioAccion);

  lifeMonitor.resetFactors();
  updateBars();
  clearInterval(timer);
};

var updateBars = function() {
  lifeWindow.updateBars(lifeMonitor.getAnsiedad(), lifeMonitor.getFelicidad(), lifeMonitor.getMiedo(), 
    lifeMonitor.getEnergia(), lifeMonitor.getHambre(), lifeMonitor.getDinero());
};


var gameOver = function() {
  lifeWindow.gameOver();
  if (lifeMonitor.isDead()) {
    playSound("gameover_audio");
    $("#gameover").show();
  } else {
    playSound("youwin_audio");
    lifeWindow.showWinnerMessage();
  }
};

var formatSeconds = function(seconds) {
  return Math.floor(seconds  / 1000);
  //return Math.floor((seconds % (1000 * 60)) / 1000);
};

var playSound = function(audio) {
  var sound = document.getElementById(audio);
  sound.play();
};

var stopSound = function(audio) {
  var sound = document.getElementById(audio);
  sound.pause();
};
