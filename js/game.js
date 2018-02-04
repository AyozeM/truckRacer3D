
//COLORS
let Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0
};

// THREEJS RELATED VARIABLES

let scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container;

//SCREEN & MOUSE VARIABLES

let HEIGHT, WIDTH;

//INIT THREE JS, SCREEN AND MOUSE EVENTS

const createScene = () =>{

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
  scene.fog = new THREE.Fog(0xf7d9aa, 100,950);
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS

const handleWindowResize = () =>{
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}


// LIGHTS

let ambientLight, hemisphereLight, shadowLight;

const createLights = () =>{

  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

// 3D Models
let actualRoad;
let raceCar;
let barraVida;
let barraFuel;
let distancia;
let roadInpediments;
let autoincremtal;
let playerLose;

let unlessElements;

let dificultIncrementLevel;
let inpedimentSpeed;
let dificultPetrol;
let dificultWalls;
let actualLevel;
/**
 * CREATE OBJECTS
 */
/**
 * Se encarga de crear el camion
 */
const createCar = () =>{
  raceCar = new car();
  raceCar.mesh.scale.set(.10,.10,.10);
  raceCar.mesh.position.z = 170;
  raceCar.mesh.rotation.x = .12 * Math.PI;
  scene.add(raceCar.mesh);
}
/**
 * Se encarga de crear la carretera
 */
const createRoad = () =>{
  actualRoad = new road();
  actualRoad.mesh.position.y = -250;
  actualRoad.mesh.rotation.y = .5 * Math.PI;
  scene.add(actualRoad.mesh);
}
/**
 * Se encarga de crear latas de gasolina
 */
const createPetrol = (w,h,p,s) =>{
  let can = new fuelCan(10,10,5,'red',s,10);
  can.mesh.scale.set(.5,.5,.5);
  can.mesh.position.y = 114;
  can.mesh.position.z = 100;
  can.mesh.position.x = p;
  can.mesh.rotation.x = .1 * Math.PI;
  can.mesh.name = `oil-${++autoincremtal}`;
  scene.add(can.mesh);
  roadInpediments.push(can);
}
/**
 * Se encarga de crear un muro y añadirlo a la escena
 * @param {anchura del muro} w 
 * @param {altura del muro} h 
 * @param {posicion del muro} p 
 */
const createWall = (w,h,p,s) =>{
  let Wall = new wall(w,h,5,'gray',s,25);
  Wall.mesh.scale.set(.5,.5,.5);
  Wall.mesh.position.y = 114;
  Wall.mesh.position.z = 100;
  Wall.mesh.position.x = p;
  Wall.mesh.rotation.x = .1 * Math.PI;
  Wall.mesh.name = `impedimento-${++autoincremtal}`;
  scene.add(Wall.mesh);
  roadInpediments.push(Wall);
};
/**
 * UPDATE OBJECTS
 */

 /**
  * Actualiza los kms recorridos
  */
let kms = setInterval(() =>{
  $("distancia").text(`${Math.round(distancia*100)/100} km`);
},100)
/**
 * Se ocupa de mover la lata de gasolina
 */
/**
 * Se encarga de mantener la puntuacion actualizada
 */
const updateScore = () =>{
  if(barraVida != raceCar.life){
    barraVida = raceCar.life;
    $("#life").find('.barra').css('width',`${barraVida}%`);
  }
  if(barraFuel != raceCar.fuel){
    barraFuel = raceCar.fuel;
    $("#fuel").find('.barra').css('width',`${barraFuel}%`);
  }

  if(barraFuel <= 0 || barraVida <= 0){
    playerLose = true;
  }
}
/**
 * Se encarga de actualizar la posicion del camion
 */
const updateCar = () =>{
  raceCar.move(direccion);
  raceCar.mesh.position.y = 88.5;  
}
/**
 * Se encarga de hacer rodar la pista
 */
const updateRoad = () =>{
  actualRoad.mesh.rotation.z += .005;
}
/**
 * Bucle principal del juego
 */
const loop = () =>{
  if(!playerLose){
    distancia+= 0.05;
    changeLevel();
    putWall();
    putPetrol();
    updateCar();
    updateRoad();
    roadInpediments.map(e=>{
      if(checkCollision(e)){
        switch(e.type){
          case 'petrol':
            raceCar.setFuel(e.litres);
            break;
          case 'inpediment':
            raceCar.life -= e.damage;
            break;
        }
        unlessElements.push(roadInpediments.indexOf(e));
        scene.remove(scene.getObjectByName(e.mesh.name));
      }else if(e.mesh.position.z > 180){
        unlessElements.push(roadInpediments.indexOf(e));
        scene.remove(scene.getObjectByName(e.mesh.name));
      }else{
        e.move();
      }
    });
    removeUnlessElements();
    updateScore();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }else{
    roadInpediments.map(e=>{
      scene.remove(scene.getObjectByName(e.mesh.name));
    });
    hideGame();
    $("#name").text(actualPlayer);
    $("#score").text(Math.round(distancia*100)/100)
    $("#reload").fadeIn();
    $("body").addClass("endGame");
    storeScore();
  }
}
/**
 * vuelve a mostar el juego
 */
const showGame = ()=>{
  $("#world").fadeIn();
  $("div").fadeIn();
  $("distancia").fadeIn();
}
/**
 * oculta el juego
 */
const hideGame = () =>{
  $("#world").fadeOut();
  $("div").fadeOut();
  $("distancia").fadeOut();
}
/**
 * Se encarga de almacenar la puntuacion del usuario
 */
const storeScore = () =>{
  userScores.push({
    date:new Date().toUTCString(),
    score:distancia
  });
  dbScore[actualPlayer] = userScores;
  localStorage.setItem("scores",JSON.stringify(dbScore));
}
/**
 * Calcula el nivel en el que se esta jugado
 * @param {disancia recorrida} distance 
 */
const getLevel = distance => Math.trunc(distance / dificultIncrementLevel)+1;
/**
 * Se encarga de poner los miro
 */
const putWall = () =>{
  if((Math.round(distancia*100)/100)%dificultWalls == 0){
    let w = Math.floor(Math.random() * (30 - (5))) + (5);
    let p =  Math.floor(Math.random() * (20 - (-20))) + (-20);
    createWall(w,10,p,inpedimentSpeed);
  }
}
/**
 * Se encarga de poner las latas de gasolina
 */
const putPetrol = () =>{
  if((Math.round(distancia*100)/100)%dificultPetrol == 0){
    let x =  Math.floor(Math.random() * (20 - (-20))) + (-20);
    createPetrol(10,10,x,inpedimentSpeed);
  }
}
/**
 * Se encarga de incrementar la dificultad en base al nivel por el cual valla el jugador
 */
const changeLevel = ()=>{
  if(actualLevel != getLevel(distancia)){
    actualLevel++;
    if(dificultWalls > 5){
      dificultWalls-=5;
    }
    if(dificultPetrol < 50){
      dificultPetrol+=5;
    }
    if(inpedimentSpeed < 2.4){
      inpedimentSpeed+=.3;
    }
  }
}

/**
 * Elimina los elementos inutiles de la escena
 */         
const removeUnlessElements = () =>{
  if(unlessElements.length > 0){
    roadInpediments.splice(unlessElements[0],1);
    unlessElements.splice(0,1);
  
    unlessElements.map(e=>{
      roadInpediments.splice(e-1,1);
    });
    unlessElements = [];
  }
}
/**
 * Comprueba si hubo colision con una lata de gasolina
 */
const checkCollision = element =>{
  let crash = false;
  if(raceCar.mesh.position.z-7 <= element.mesh.position.z && (element.mesh.position.x >= raceCar.mesh.position.x -(element.x/2) &&element.mesh.position.x <= raceCar.mesh.position.x + (element.x/2))){
    crash = true;
  }
  return crash;
}
/**
 * Inicializa todos los elementos del juego
 */
const init = () =>{
   if($.browser.mobile){
    $(".controlsContainer").append(
      $("<span>",{id:"top","class":"controls",'data-direction':"top"}).click(manualDirection)
    ).append(
      $("<span>",{id:"left",class:"controls",'data-direction':"ArrowLeft"}).click(manualDirection)
    ).append(
      $("<span>",{id:"right",class:"controls",'data-direction':"ArrowRight"}).click(manualDirection)
    );
  }
  varInit();
  createScene();
  createLights();
  createCar();
  createRoad();
  createPetrol();
  createWall();
  getUserScore();
  loop();
}
const varInit = () =>{
  actualRoad;
  raceCar;
  barraVida = 100;
  barraFuel = 100;
  distancia = 0;
  roadInpediments = [];
  autoincremtal = 0;
  playerLose = false;

  unlessElements = [];

  dificultIncrementLevel = 100;
  inpedimentSpeed = .3;
  dificultPetrol =25;
  dificultWalls = 15;
  actualLevel = 1;
}
let actualPlayer;
let dbScore;
let userScores = [];
/**
 * Extrae las puntuaciones que ya tenga el usuario registrado
 */
const getUserScore = () =>{
  dbScore = localStorage.getItem("scores");
  actualPlayer = localStorage.getItem("actualUser");
  if(dbScore != null){
    dbScore = JSON.parse(dbScore);
    if(Object.keys(dbScore).includes(actualPlayer)){
      userScores = dbScore[actualPlayer];
    }
  }else{
    dbScore = {};
  }
}
// HANDLE EVENTS
let direccion;
$(document).ready(function(){
  window.addEventListener('keydown',e=>{
      direccion = e.code;
      raceCar.move(e.code);
  },false);

  function manualDirection(){
    direccion = $(this).data("direction");
    raceCar.move(direccion);
  
  }
  $("#restart").click(function(e){
    e.preventDefault();  
    varInit();
    raceCar.fuel = 100;
    raceCar.life = 100;
    raceCar.actuallyPosition = 0;
    direccion = '';
    $("#life").find("nav").css("width","100%");
    loop();
    $("#reload").fadeOut();
    showGame();
    $("body").removeClass();
  });
  $("#reload").hide();
  init();
});