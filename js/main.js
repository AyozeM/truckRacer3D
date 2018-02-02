
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
let barraVida = 100;
let barraFuel = 100;
let distancia = 0;
let roadInpediments = [];
let autoincremtal = 0;
let playerLose = false;

let unlessElements = [];

const dificultIncrementLevel = 100;
let inpedimentSpeed = .3;
let dificultPetrol =25;
let dificultWalls = 15;
let actualLevel = 1;
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
    alert("Has perdido");
  }
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
  if(raceCar.mesh.position.z-7 <= element.mesh.position.z && (element.mesh.position.x >= raceCar.mesh.position.x -5 &&element.mesh.position.x <= raceCar.mesh.position.x + 5)){
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
  createScene();
  createLights();
  createCar();
  createRoad();
  createPetrol();
  createWall();
  loop();
}

// HANDLE EVENTS
let direccion;
window.addEventListener('keydown',e=>{
    direccion = e.code;
    raceCar.move(e.code);
},false);
function manualDirection(){
  direccion = $(this).data("direction");
  raceCar.move(direccion);
  setTimeout(()=>direccion = "",500)

}
window.addEventListener('load', init, false);
