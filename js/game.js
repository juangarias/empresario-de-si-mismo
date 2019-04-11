const TIEMPO_TOTAL_JUEGO = 300000; /* 5 minutos */
const TIEMPO_ACCION = 15000; /* 15 segundos */
const TIEMPO_MULTI_ACCION = 25000; /* 25 segundos */
const TIEMPO_CAMBIO_ACCION = 15000; /* 15 segundos */
const TIEMPO_LOADING = 30000; /* 30 segundos */


// Tiempos para DEBUG / DEVELOPMENT
//const TIEMPO_TOTAL_JUEGO = 60000;
//const TIEMPO_ACCION = 2000;
//const TIEMPO_MULTI_ACCION = 4000;
//const TIEMPO_CAMBIO_ACCION = 5000;
//const TIEMPO_LOADING = 5000;

var ansiedad, felicidad, miedo, energia, hambre, dinero, energia, vidas;
var tiempo, tiempoAccion, tiempoCambioAccion, energyFlag;
var timer, timerAccion, timerCambioAccion;

var nivel;
var accionesElegidas;


$(document).ready(function() {
   energiaInit     = 35;
   ansiedad   = energiaInit;
   felicidad  = energiaInit;
   miedo      = energiaInit;
   energia    = energiaInit;
   hambre     = energiaInit;
   dinero     = energiaInit;
   energyFlag = false;

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

$(".comer").click(function(){ $(this).addClass('comer-selected'); triggerAction(-2,3,-1,4,4,2, "comer_audio");});
$(".dormir").click(function(){ $(this).addClass('dormir-selected'); triggerAction(-3,2,-1,3,3,-1, "dormir_audio");});
$(".trabajar").click(function(){ $(this).addClass('trabajar-selected'); triggerAction(2,-2,1,-3,3,4, "trabajar_audio");});
$(".ocio").click(function(){ $(this).addClass('ocio-selected'); triggerAction(-1,3,-1,1,2,-2, "ocio_audio");});
$(".entrenar").click(function(){ $(this).addClass('entrenar-selected'); triggerAction(-2,1,-1,-3,3,-2, "entrenar_audio");});
$(".sexo").click(function(){ $(this).addClass('sexo-selected'); triggerAction(-2,3,-1,-2,3,-1, "sexo_audio");});
$(".votar").click(function(){ $(this).addClass('votar-selected'); triggerAction(3,1,2,-1,1,0, "votar_audio");});
$(".belleza").click(function(){ $(this).addClass('belleza-selected'); triggerAction(-1,2,1,0,1,-4, "belleza_audio");});

$("#cambiar_escena_button").click(function() {changeAction();});

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
  $("#actionsmenu1").hide();
  $("#actionsmenu2").hide();
  $("#actionsmenu3").hide();
  $("#actionsmenu4").hide();
  $("#actionsmenu5").hide();
};

var showLoading = function(avatarAudio) {
  playSound(avatarAudio);
  $("#avatarsmenu").hide();
  $("#loading").show();

  var t = setInterval(function() {
    $("#loading").hide();
    startGame();
    clearInterval(t);
  }, TIEMPO_LOADING);
};

var startGame = function() {
  nivel = 1;
  accionesElegidas = [];
  
  showMenu();

  $("#video").show();
  $("#userdata_container").show();

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

var triggerAction = function(ansiedadNew, felicidadNew, miedoNew, energiaNew, hambreNew, dineroNew, audio) {
  playSound(audio);
  accionesElegidas.push(audio);
  if (nivelCompleto()) {
    clearInterval(timerAccion);
    clearInterval(timerCambioAccion);
    deselectActions();
    $("#cambiar_escena_button").hide();
    hideMenu();
    setActionTimer();
    updateInfo(ansiedadNew, felicidadNew, miedoNew, energiaNew, hambreNew, dineroNew);
    nivel++;
    accionesElegidas = [];
  }
};

var nivelCompleto = function() {
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


var changeAction = function() {
  showMenu();
  $("#userdata_container").show();
  $("#gameover").hide();
  $("#startscreen").hide();
};


var gameOver = function() {

  if (energyFlag) {
    playSound("gameover_audio");
    $("#gameover").show();
  } else {
    showWinnerMessage();
  }

  $("#avatarsmenu").hide();
  hideMenu();
  $("#cambiar_escena_button").hide();
  clearInterval(timer);
  clearInterval(timerAccion);
  clearInterval(timerCambioAccion)

  setTimeout(resetGame, 5000);
};

var setActionTimer = function() {
  tiempoAccion = calcularTiempoAccion();

  timerAccion = setInterval(function() {
    if (tiempoAccion <= 0) {
        clearInterval(timerAccion);
        if(energyFlag) {
          gameOver();
        } else {
          setChangeActionTimer();
        }
    }
    tiempoAccion-=1000;
  }, 1000);
};

var setChangeActionTimer = function() {
  tiempoCambioAccion = TIEMPO_CAMBIO_ACCION
  $("#cambiar_escena_button p.texto_cambiar_escena").text('CAMBIAR ACCION: ' + formatSeconds(tiempoCambioAccion));
  $("#cambiar_escena_button").show();

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
      energyFlag = true;
      gameOver();
    }

    $("#cambiar_escena_button p.texto_cambiar_escena").text('CAMBIAR ACCION:'+' '+seconds);
    tiempoCambioAccion-=1000;
  }, 1000);
};

var formatSeconds = function(seconds) {
  return Math.floor(seconds  / 1000);
  //return Math.floor((seconds % (1000 * 60)) / 1000);
};


var playSound = function(audio) {
  var sound = document.getElementById(audio);
  sound.play();
};

var resetGame = function() {
  //$("#vidas").width("78px");

  $("#ansiedad").width( energiaInit + "px");
  $("#felicidad").width(energiaInit + "px");
  $("#miedo").width(energiaInit + "px");
  $("#energia").width(energiaInit + "px");
  $("#hambre").width(energiaInit + "px");
  $("#dinero").width(energiaInit + "px");

  $("#ansiedad p").removeClass("text_danger_style");
  $("#felicidad p").removeClass("text_danger_style");
  $("#miedo p").removeClass("text_danger_style");
  $("#energia p").removeClass("text_danger_style");
  $("#hambre p").removeClass("text_danger_style");
  $("#dinero p").removeClass("text_danger_style");

  ansiedad   = energiaInit;
  felicidad  = energiaInit;
  miedo      = energiaInit;
  energia    = energiaInit;
  hambre     = energiaInit;
  dinero     = energiaInit;
  energyFlag = false;

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
  $("#loading").hide();
  $("#cambiar_escena_button").hide();
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

/*
 * FUNCION PARA ACTUALIZAR VIDAS EN CASO DE CAMBIO DE PARECER.
 * SE DEBE LLAMAR EN EL CLICK DE LAS ACCIONES(COMER; DORMIR; ETC)
 */

var updateLives = function() {
  vidas -=1;
  $("#vidas").width(vidas*27 +"px");
  if (vidas >0) {
    $("#cambiar_escena_button").show();
  }
  //console.log(vidas*27);
};

var updateInfo = function(ansiedadNew, felicidadNew, miedoNew, energiaNew, hambreNew, dineroNew) {

  // Primero actualizamos el valor de cada item.
  ansiedad += ansiedadNew * 7;
  ansiedad = Math.min(Math.max(ansiedad,0),67);

  if (ansiedad>=67) {
    $("#ansiedad p").toggleClass("text_danger_style");
  }

  felicidad += felicidadNew * 7;
  felicidad = Math.min(Math.max(felicidad,0),67);

  if (felicidad<=0) {
    $("#felicidad p").toggleClass("text_danger_style");
  }

  miedo += miedoNew * 7;
  miedo = Math.min(Math.max(miedo,0),67);

  if (miedo>=67) {
    $("#miedo p").toggleClass("text_danger_style");
  }

  energia += energiaNew * 7;
  energia = Math.min(Math.max(energia,0),67);

  if (energia<=0) {
    $("#energia p").toggleClass("text_danger_style");
  }

  hambre += hambreNew * 7;
  hambre = Math.min(Math.max(hambre,0),67);

  if (hambre<=0) {
    $("#hambre p").toggleClass("text_danger_style");
  }

  dinero += dineroNew * 7;
  dinero = Math.min(Math.max(dinero,0),67);

  if (dinero<=0) {
    $("#dinero p").toggleClass("text_danger_style");
  }

  if (ansiedad >= 67 || miedo >= 67 || felicidad <= 0 || energia <= 0 || hambre <= 0 || dinero <= 0) {
    energyFlag = true;
    console.log("ËNERGY FLAG :" + energyFlag);
  }

  console.log(ansiedad+", "+felicidad+", "+miedo+", "+energia+", "+hambre+", "+dinero);

  //Ahora lo actualizamos en los estilos
  $("#ansiedad").width(ansiedad + "px");
  $("#felicidad").width(felicidad + "px");
  $("#miedo").width(miedo + "px");
  $("#energia").width(energia + "px");
  $("#hambre").width(hambre + "px");
  $("#dinero").width(dinero + "px");
};
