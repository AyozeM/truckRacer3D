
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
const createCan = () =>{
  let can = new fuelCan(10,10,5,'red',10);
  can.mesh.scale.set(.5,.5,.5);
  can.mesh.position.y = 114;
  can.mesh.position.z = 100;
  can.mesh.rotation.x = .1 * Math.PI;
  can.mesh.name = `oil-${++autoincremtal}`;
  scene.add(can.mesh);
  roadInpediments.push(can);
}
const createInpediment = () =>{
  let inpedimento = new inpediment(20,15,5,'gray');
  inpedimento.mesh.scale.set(.5,.5,.5);
  inpedimento.mesh.position.y = 114;
  inpedimento.mesh.position.z = 100;
  inpedimento.mesh.position.x = 20;
  inpedimento.mesh.rotation.x = .1 * Math.PI;
  inpedimento.mesh.name = `impedimento-${++autoincremtal}`;
  scene.add(inpedimento.mesh);
  roadInpediments.push(inpedimento);
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
const updateCan = () => {
  can.move();
}
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
let unlessElements = [];
const loop = () =>{
  distancia+= 0.05;
  updateCar();
  updateRoad();
  roadInpediments.map(e=>{
    if(compruebaColision(e)){
      switch(e.type){
        case 'petrol':
          raceCar.setFuel(e.litres);
          break;
        case 'inpediment':
          alert("chocaste pendejo");
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
const compruebaColision = element =>{
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
  createScene();
  createLights();
  createCar();
  createRoad();
  createCan();
  createInpediment();
  loop();
}

// HANDLE EVENTS
let direccion;
window.addEventListener('keydown',(e)=>{
    direccion = e.code;
    raceCar.move(e.code);
},false);
window.addEventListener('load', init, false);
