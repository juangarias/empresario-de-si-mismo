//const TIEMPO_TOTAL_JUEGO = 300000; /* 5 minutos */
//const TIEMPO_ACCION = 15000; /* 15 segundos */
//const TIEMPO_CAMBIO_ACCION = 15000; /* 15 segundos */


// Tiempos para DEBUG / DEVELOPMENT
const TIEMPO_TOTAL_JUEGO = 20000; 
const TIEMPO_ACCION = 3000; 
const TIEMPO_CAMBIO_ACCION = 1500;


var ansiedad, felicidad, miedo, energia, hambre, dinero, energia, vidas, tiempo, timer, tiempoAccion, tiempoCambioAccion, energyFlag;

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
  tiempo = TIEMPO_TOTAL_JUEGO; 
  $("#startscreen").hide();
  $("#avatarsmenu").show();
  $("#userdata_container").show();
  timer = setInterval(function() {
    if (tiempo >= 0) {
      var minutes = Math.floor((tiempo % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((tiempo % (1000 * 60)) / 1000);
      if (seconds < 10) {seconds = "0"+seconds}

      $("#tiempo p.reloj").text(minutes+':'+seconds);
      if (minutes == 0 && seconds < 5 && seconds >0) {
        playSound("countdown_audio");
      }
      if (minutes == 0 && seconds == 0) {
        gameOver();
      }

    }
    tiempo-=1000;
  }, 1000);

  $(this).disabled;
});

$("#fitness").click(function() {
  playSound("fitness_audio");
  $("#avatarsmenu").hide();
  $("#actionsmenu").show();
});

$("#payasa").click(function() {
  playSound("payasa_audio");
  $("#avatarsmenu").hide();
  $("#actionsmenu").show();
});

$("#maga").click(function() {
  playSound("maga_audio");
  $("#avatarsmenu").hide();
  $("#actionsmenu").show();
});

$("#vikinga").click(function() {
  playSound("vikinga_audio");
  $("#avatarsmenu").hide();
  $("#actionsmenu").show();
});

$("#empresaria").click(function() {
  playSound("empresaria_audio");
  $("#avatarsmenu").hide();
  $("#actionsmenu").show();
});

$("#hiphop").click(function() {
  playSound("hiphop_audio");
  $("#avatarsmenu").hide();
  $("#actionsmenu").show();
});

$("#comer").click(function(){ triggerAction(-2,3,-1,4,4,2, "comer_audio");});
$("#dormir").click(function(){ triggerAction(-3,2,-1,3,3,-1, "dormir_audio");});
$("#trabajar").click(function(){ triggerAction(2,-2,1,-3,3,4, "trabajar_audio");});
$("#ocio").click(function(){ triggerAction(-1,3,-1,1,2,-2, "ocio_audio");});
$("#entrenar").click(function(){ triggerAction(-2,1,-1,-3,3,-2, "entrenar_audio");});
$("#sexo").click(function(){ triggerAction(-2,3,-1,-2,3,-1, "sexo_audio");});
$("#votar").click(function(){ triggerAction(3,1,2,-1,1,0, "votar_audio");});
$("#belleza").click(function(){ triggerAction(-1,2,1,0,1,-4, "belleza_audio");});


$("#cambiar_escena_button").click(function() {changeAction();});

var triggerAction = function(ansiedadNew, felicidadNew, miedoNew, energiaNew, hambreNew, dineroNew, audio) {
  $("#actionsmenu").hide();
  playSound(audio);
  setActionTimer();
  updateInfo(ansiedadNew, felicidadNew, miedoNew, energiaNew, hambreNew, dineroNew);
};

var gameOver = function() {

  if (energyFlag) {
    playSound("gameover_audio");
    $("#gameover").show();
  } else {
    $("#youWin").show();
  }
  $("#avatarsmenu").hide();
  $("#actionsmenu").hide();
  $("#cambiar_escena_button").hide();
  clearInterval(timer);
  clearInterval(timerAccion);
  clearInterval(timerCambioAccion)

  setTimeout(function() {
    resetGame();
  }, 5000);
};

var setActionTimer = function() {
  tiempoAccion = TIEMPO_ACCION;
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
  $("#cambiar_escena_button p.texto_cambiar_escena").text('CAMBIAR ACCION: 0'+Math.floor((tiempoCambioAccion % (1000 * 60)) / 1000));
  $("#cambiar_escena_button").show();

  timerCambioAccion = setInterval(function() {
    if (tiempoCambioAccion > 0) {
      var minutes = Math.floor((tiempoCambioAccion % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((tiempoCambioAccion % (1000 * 60)) / 1000);
      if (seconds < 10) {
        seconds = "0"+seconds;
      }

    } else {
      clearInterval(timerCambioAccion);
      gameOver();
    }
    $("#cambiar_escena_button p.texto_cambiar_escena").text('CAMBIAR ACCION:'+' '+seconds);
    tiempoCambioAccion-=1000;
  }, 1000);

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
  showMainScreen();
};

var showMainScreen = function() {
  $("#actionsmenu").hide();
  $("#avatarsmenu").hide();
  $("#userdata_container").hide();
  $("#youWin").hide();
  $("#gameover").hide();
  $("#cambiar_escena_button").hide();
  $("#startscreen").show();
};

var changeAction = function() {
  $("#actionsmenu").show();
  $("#userdata_container").show();
  $("#gameover").hide();
  $("#cambiar_escena_button").hide();
  $("#startscreen").hide();
  clearInterval(timerCambioAccion);
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

var updateInfo = function (ansiedadNew, felicidadNew, miedoNew, energiaNew, hambreNew, dineroNew) {

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