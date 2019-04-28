
var lifeMonitor = new LifeMonitor(ENERGY_BAR_MIN, ENERGY_BAR_MAX, ENERGY_BAR_START);
var loadingIdIterator = new ConsecutiveIdIterator("loading", 2);
var gamepad = new Gamepad();
var avatarNav = new ArrayNavigator(["fitness","payasa","maga","vikinga","empresaria","hiphop"], 0);
var actionsNavigator;

var tiempo, tiempoAccion, tiempoCambioAccion;
var timer, timerAccion, timerCambioAccion;

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

var startButtonClicked = function() {
  $("#startscreen").hide();
  $("#avatarsmenu").show();
  $(this).disabled;
  gamepadSelectAvatar();
};

function gamepadShowMainScreen() {
  gamepad.clearEventHandlers();
  gamepad.start = startButtonClicked;
}

function avatarLeft() {  
  changeAvatarSelected(avatarNav.current(), avatarNav.previous());
}

function avatarRight() {
  changeAvatarSelected(avatarNav.current(), avatarNav.next());
}

function changeAvatarSelected(oldAvatar, newAvatar) {
  $("#" + oldAvatar).removeClass(oldAvatar + "-selected");
  $("#" + newAvatar).addClass(newAvatar + "-selected");
}

function avatarClicked(avatar) {
  var avatar = avatar || avatarNav.current();
  showLoading(avatar + "_audio");
}

var gamepadSelectAvatar = function() {
  gamepad.clearEventHandlers();
  gamepad.red = gamepad.blue = gamepad.yellow = gamepad.green = avatarClicked;
  gamepad.left = avatarLeft;
  gamepad.right = avatarRight;
}

$(document).ready(function() {
  lifeMonitor.resetFactors();
  showMainScreen();
});

$("#start_button").click(startButtonClicked);

$("#fitness").click(function() {avatarClicked("fitness")});
$("#payasa").click(function() {avatarClicked("payasa")});
$("#maga").click(function() {avatarClicked("maga")});
$("#vikinga").click(function() {avatarClicked("vikinga")});
$("#empresaria").click(function() {avatarClicked("empresaria")});
$("#hiphop").click(function() {avatarClicked("hiphop")});

$(".comer").click(function(){ actionSelected("comer");});
$(".dormir").click(function(){ actionSelected("dormir");});
$(".trabajar").click(function(){ actionSelected("trabajar");});
$(".ocio").click(function(){ actionSelected("ocio");});
$(".entrenar").click(function(){ actionSelected("entrenar");});
$(".sexo").click(function(){ actionSelected("sexo");});
$(".votar").click(function(){ actionSelected("votar");});
$(".belleza").click(function(){ actionSelected("belleza");});

var showMainScreen = function() {
  gamepadShowMainScreen();
  hideMenu();
  $("#avatarsmenu").hide();
  $("#userdata_container").hide();
  $("#youWin").hide();
  $("#gameover").hide();
  hideLoading();
  $("#sky").hide();
  $("#video").hide();
  
  var startText = gamepad.isConnected() ? "Jugador 1 Iniciar" : "Esperando control";
  $("#start_button").text(startText);
  $("#startscreen").show();
};

function actionSelected(action) {
  var action = action || actionsNavigator.current();
  if (typeof action === 'undefined') {
    return;
  }
  var eff = effects[action];
  var i = 0;

  $(".contenedor." + action).addClass(action + '-selected');
  triggerAction(eff[i++],eff[i++],eff[i++],eff[i++],eff[i++],eff[i++], action + "_audio");
}

function actionRight() {
  changeActionSelected(actionsNavigator.current(), actionsNavigator.next());
}

function actionLeft() {
  changeActionSelected(actionsNavigator.current(), actionsNavigator.previous());
}

function changeActionSelected(oldAction, newAction) {
  $(".contenedor." + oldAction).removeClass(oldAction + "-selected");
  $(".contenedor." + newAction).addClass(newAction + "-selected");
}

var resetGame = function() {
  $("#avatarsmenu").hide();
  hideMenu();
  clearInterval(timer);
  clearInterval(timerAccion);
  clearInterval(timerCambioAccion);

  $("#ansiedad p").removeClass();
  $("#felicidad p").removeClass();
  $("#miedo p").removeClass();
  $("#energia p").removeClass();
  $("#hambre p").removeClass();
  $("#dinero p").removeClass();

  lifeMonitor.resetFactors();
  updateBars();
  clearInterval(timer);
  deselectActions();
  showMainScreen();
};

var gamepadActionsMenu = function() {
  gamepad.clearEventHandlers();
  gamepad.red = gamepad.blue = gamepad.yellow = gamepad.green = actionSelected;
  gamepad.left = actionLeft;
  gamepad.right = actionRight;
  gamepad.leftShoulderRed = resetGame;
};

var showMenu = function() {
  gamepadActionsMenu();
  if (nivel == 1) {
    actionsNavigator = new ArrayNavigator(["dormir", "trabajar"]);
    $("#actionsmenu1").show();
  } else if (nivel == 2) {
    actionsNavigator = new ArrayNavigator(["dormir", "trabajar", "votar"]);
    $("#actionsmenu2").show();
  } else if (nivel == 3) {
    actionsNavigator = new ArrayNavigator(["comer", "dormir", "trabajar", "votar", "belleza"]);
    $("#actionsmenu3").show();
  } else if (nivel == 4) {
    actionsNavigator = new ArrayNavigator(["comer", "dormir", "trabajar", "entrenar", "sexo", "votar", "belleza"]);
    $("#actionsmenu4").show();
  } else {
    switch (nivel) {
      case 5:
        $("#actionsmenu5 #titulo_action p").html("Seleccion&aacute; tres acciones");
        break;
      case 6:
        $("#actionsmenu5 #titulo_action p").html("Seleccion&aacute; dos acciones");
        break;
      case 7:
        $("#actionsmenu5 #titulo_action p").html("Seleccion&aacute; tres acciones");
        break;
      case 8:
        $("#actionsmenu5 #titulo_action p").html("Seleccion&aacute; cuatro acciones");
        break;
      default:
    }
    actionsNavigator = new ArrayNavigator(["comer", "dormir", "trabajar", "ocio", "entrenar", "sexo", "votar", "belleza"]);
    $("#actionsmenu5").show();
  }
};

var hideMenu = function() {
  $(".actionsmenu-screen").hide();
};

var hideLoading = function() {
  $(".loading-screen").hide();
  stopSound("loading_audio");
}

var startGame = function() {
  hideLoading();
  nivel = 1;
  accionesElegidas = [];
  
  $("#video").show();
  startGameTimer();
  startChangeActionTimer();
};

var showLoading = function(avatarAudio) {
  playSound(avatarAudio);
  playSound("loading_audio");
  $("#avatarsmenu").hide();
  $(loadingIdIterator.next()).show();

  var t = setInterval(function() {
    startGame();
    clearInterval(t);
  }, TIEMPO_LOADING);

  gamepad.clearEventHandlers();
  gamepad.leftShoulderRed = function(){ clearInterval(t); resetGame()};
  gamepad.bothShouldersYellow = function(){ clearInterval(t); startGame()};
};

var startGameTimer = function() {
  tiempo = TIEMPO_TOTAL_JUEGO;
  timer = setInterval(function() {
    if (tiempo >= 0) {
      var minutes = Math.floor((tiempo % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((tiempo % (1000 * 60)) / 1000);
      if (seconds < 10) {seconds = "0"+seconds}

      $("#tiempo p.reloj").text(minutes+':'+seconds);

      if (minutes == 0 && seconds == 0) {
        gameOver();
      }

    }
    tiempo-=1000;
  }, 1000);
};

var startChangeActionTimer = function() {
  changeAction();
  tiempoCambioAccion = TIEMPO_CAMBIO_ACCION
  setChangeActionWarningText(formatSeconds(tiempoCambioAccion));

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

    setChangeActionWarningText(seconds);
    tiempoCambioAccion-=1000;
  }, 1000);
};

var setChangeActionWarningText = function(seconds) {
  $("#cambiar_escena_button p.texto_cambiar_escena").text(seconds);
};

var actionAlreadyAdded = function(audio) {
  return accionesElegidas.includes(audio);
};

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
    deselectActions();
    hideMenu();
    setActionTimer();
    
    nivel++;
    accionesElegidas = [];
  }
};

var levelComplete = function() {
  return nivel == 1 || nivel == 2 || nivel == 4 ||
          ([3, 6].includes(nivel) && accionesElegidas.length == 2) ||
          ([5, 7].includes(nivel) && accionesElegidas.length == 3) ||
          ([8, 9 , 10].includes(nivel) && accionesElegidas.length == 4);
};

var calcularTiempoAccion = function() {
  return (nivel == 1 || nivel == 2 || nivel == 4) ? TIEMPO_ACCION : TIEMPO_MULTI_ACCION;
}

var deselectActions = function() {
  $(".comer").removeClass('comer-selected');
  $(".dormir").removeClass('dormir-selected');
  $(".trabajar").removeClass('trabajar-selected');
  $(".ocio").removeClass('ocio-selected');
  $(".entrenar").removeClass('entrenar-selected');
  $(".sexo").removeClass('sexo-selected');
  $(".votar").removeClass('votar-selected');
  $(".belleza").removeClass('belleza-selected');
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


var changeAction = function() {
  showMenu();
  $("#userdata_container").show();
  $("#gameover").hide();
  $("#startscreen").hide();
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

var showWinnerMessage = function() {
  $("#video").hide();
  $("#youWin").show();
  $("#sky").show();
  playSound("youwin_audio");
  animate("#sky");
};

var gameOver = function() {
  gamepad.clearEventHandlers();
  
  if (lifeMonitor.isDead()) {
    playSound("gameover_audio");
    $("#gameover").show();
  } else {
    showWinnerMessage();
  }
  setTimeout(resetGame, 5000);
};

var updateBars = function() {
  var ansiedad = lifeMonitor.getAnsiedad();
  var felicidad = lifeMonitor.getFelicidad();
  var miedo = lifeMonitor.getMiedo();
  var energia = lifeMonitor.getEnergia();
  var hambre = lifeMonitor.getHambre();
  var dinero = lifeMonitor.getDinero();

  updateStyleLessBetter(ansiedad, "#ansiedad p");
  updateStyleMoreBetter(felicidad, "#felicidad p");
  updateStyleLessBetter(miedo, "#value p");
  updateStyleMoreBetter(energia, "#energia p");
  updateStyleMoreBetter(hambre, "#hambre p");
  updateStyleMoreBetter(dinero, "#dinero p");
  
  $("#ansiedad").width(ansiedad + "px");
  $("#felicidad").width(felicidad + "px");
  $("#miedo").width(miedo + "px");
  $("#energia").width(energia + "px");
  $("#hambre").width(hambre + "px");
  $("#dinero").width(dinero + "px");
};

var updateStyleMoreBetter = function(value, idBar) {
  $(idBar).removeClass();
  if (value <= ENERGY_BAR_MIN) {
    $(idBar).addClass("text_danger_style");
  } else if (value < ENERGY_BAR_WARN_LOW_CRITICAL) {
    $(idBar).addClass("text_critical_style");
  } else if (value < ENERGY_BAR_WARN_LOW) {
    $(idBar).addClass("text_warning_style");
  }
};

var updateStyleLessBetter = function(value, idBar) {
  $(idBar).removeClass();
  if (value >= ENERGY_BAR_MAX) {
    $(idBar).addClass("text_danger_style");
  } else if (value > ENERGY_BAR_WARN_HIGH_CRITICAL) {
    $(idBar).addClass("text_critical_style");
  } else if (value > ENERGY_BAR_WARN_HIGH) {
    $(idBar).addClass("text_warning_style");
  }
};
