const TIEMPO_TOTAL_JUEGO = 300000; /* 5 minutos */
//const TIEMPO_ACCION = 15000; /* 15 segundos */
//const TIEMPO_MULTI_ACCION = 25000; /* 25 segundos */
const TIEMPO_CAMBIO_ACCION = 15000; /* 15 segundos */
//const TIEMPO_LOADING = 37600; /* 30 segundos */

const ENERGY_BAR_START = 35;
const ENERGY_BAR_MIN = 0;
const ENERGY_BAR_WARN_LOW_CRITICAL = 11;
const ENERGY_BAR_WARN_LOW = 22;
const ENERGY_BAR_WARN_HIGH = 44;
const ENERGY_BAR_WARN_HIGH_CRITICAL = 55;
const ENERGY_BAR_MAX = 67;

// Tiempos para DEBUG / DEVELOPMENT
//const TIEMPO_TOTAL_JUEGO = 60000;
const TIEMPO_ACCION = 2000;
const TIEMPO_MULTI_ACCION = 4000;
//const TIEMPO_CAMBIO_ACCION = 5000;
const TIEMPO_LOADING = 2000;


var lifeMonitor = new LifeMonitor(ENERGY_BAR_MIN, ENERGY_BAR_MAX, ENERGY_BAR_START);
var loadingIdIterator = new ConsecutiveIdIterator("loading", 2);

var tiempo, tiempoAccion, tiempoCambioAccion;
var timer, timerAccion, timerCambioAccion;

var nivel;
var accionesElegidas;

$(document).ready(function() {
  lifeMonitor.resetFactors();
  showMainScreen();
});

$("#start_button").click(function() {
  $("#startscreen").hide();
  $("#avatarsmenu").show();
  $(this).disabled;
});

$("#fitness").click(function() {showLoading("fitness_audio")});
$("#payasa").click(function() {showLoading("payasa_audio")});
$("#maga").click(function() {showLoading("maga_audio")});
$("#vikinga").click(function() {showLoading("vikinga_audio")});
$("#empresaria").click(function() {showLoading("empresaria_audio")});
$("#hiphop").click(function() {showLoading("hiphop_audio")});

$(".comer").click(function(){ $(this).addClass('comer-selected'); triggerAction(-2,3,-1,4,-4,-2, "comer_audio");});
$(".dormir").click(function(){ $(this).addClass('dormir-selected'); triggerAction(-3,2,-1,3,3,-1, "dormir_audio");});
$(".trabajar").click(function(){ $(this).addClass('trabajar-selected'); triggerAction(2,-2,1,-3,3,4, "trabajar_audio");});
$(".ocio").click(function(){ $(this).addClass('ocio-selected'); triggerAction(-1,3,-1,1,2,-2, "ocio_audio");});
$(".entrenar").click(function(){ $(this).addClass('entrenar-selected'); triggerAction(-2,1,-1,-3,3,-2, "entrenar_audio");});
$(".sexo").click(function(){ $(this).addClass('sexo-selected'); triggerAction(-2,3,-1,-2,3,-1, "sexo_audio");});
$(".votar").click(function(){ $(this).addClass('votar-selected'); triggerAction(3,1,2,-1,1,0, "votar_audio");});
$(".belleza").click(function(){ $(this).addClass('belleza-selected'); triggerAction(-1,2,1,0,1,-4, "belleza_audio");});

var showMenu = function() {
  if (nivel == 1) {
    $("#actionsmenu1").show();
  } else if (nivel == 2) {
      $("#actionsmenu2").show();
  } else if (nivel == 3) {
      $("#actionsmenu3").show();
  } else if (nivel == 4) {
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
      $("#actionsmenu5").show();
  }
};

var hideMenu = function() {
  $(".actionsmenu-screen").hide();
};

var hideLoading = function() {
  $(".loading-screen").hide();
}

var showLoading = function(avatarAudio) {
  playSound(avatarAudio);
  playSound("loading_audio");
  $("#avatarsmenu").hide();
  $(loadingIdIterator.next()).show();

  var t = setInterval(function() {
    hideLoading();
    startGame();
    clearInterval(t);
  }, TIEMPO_LOADING);
};

var startGame = function() {
  nivel = 1;
  accionesElegidas = [];
  
  $("#video").show();
  setGameTimer();
  setChangeActionTimer();
};

var setGameTimer = function() {
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
}

var triggerAction = function(ansiedadNew, felicidadNew, miedoNew, energiaNew, hambreNew, dineroNew, audio) {
  playSound(audio);
  accionesElegidas.push(audio);
  if (levelComplete()) {
    clearInterval(timerAccion);
    clearInterval(timerCambioAccion);
    deselectActions();
    hideMenu();
    setActionTimer();
    
    lifeMonitor.cicle(ansiedadNew, felicidadNew, miedoNew, energiaNew, hambreNew, dineroNew);
    updateBars();
    
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
          setChangeActionTimer();
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


var setChangeActionTimer = function() {
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
}

var formatSeconds = function(seconds) {
  return Math.floor(seconds  / 1000);
  //return Math.floor((seconds % (1000 * 60)) / 1000);
};


var playSound = function(audio) {
  var sound = document.getElementById(audio);
  sound.play();
};

var gameOver = function() {
  if (lifeMonitor.isDead()) {
    playSound("gameover_audio");
    $("#gameover").show();
  } else {
    showWinnerMessage();
  }

  $("#avatarsmenu").hide();
  hideMenu();
  clearInterval(timer);
  clearInterval(timerAccion);
  clearInterval(timerCambioAccion)

  setTimeout(resetGame, 5000);
};

var resetGame = function() {
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

var showMainScreen = function() {
  hideMenu();
  $("#avatarsmenu").hide();
  $("#userdata_container").hide();
  $("#youWin").hide();
  $("#gameover").hide();
  hideLoading();
  $("#sky").hide();
  $("#video").hide();
  $("#startscreen").show();
};

var showWinnerMessage = function() {
  $("#video").hide();
  $("#youWin").show();
  $("#sky").show();
  playSound("youwin_audio");
  animate("#sky");
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
