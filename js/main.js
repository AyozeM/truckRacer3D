
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

let HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };

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
  /* camera.position.x = 200; */
  camera.position.z = 200;
  /* camera.position.z = 1000; */
  /* camera.position.y = 100; */
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
let can;
const createCar = () =>{
  raceCar = new car();
  raceCar.mesh.scale.set(.10,.10,.10);
  //raceCar.mesh.position.z = 150;
  raceCar.mesh.position.z = 170;
  raceCar.mesh.rotation.x = .12 * Math.PI;
  scene.add(raceCar.mesh);
}

const createRoad = () =>{
  actualRoad = new road();
  actualRoad.mesh.position.y = -250;
  actualRoad.mesh.rotation.y = .5 * Math.PI;
  scene.add(actualRoad.mesh);
}
const createCan = () =>{
  can = new fuelCan(10);
  can.mesh.scale.set(.5,.5,.5);
  can.mesh.position.y = 114;
  can.mesh.position.z = 100;
  can.mesh.rotation.x = .1 * Math.PI;
  scene.add(can.mesh);
}
let barraVida = 100;
let barraFuel = 100;
const loop = () =>{
  updateCar();
  updateRoad();
  if(can != null){
    updateCan();
    if(raceCar.mesh.position.z-7 <= can.mesh.position.z && raceCar.mesh.position.x == can.mesh.position.x){
      raceCar.setFuel(can.litres);
      scene.remove(scene.getObjectByName(can.mesh.name));
      can = null;
    }   
  }
  updateScore();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
const updateCan = () => {
  can.move();
}
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
const updateCar = () =>{
  raceCar.move(direccion);
  raceCar.mesh.position.y = 88.5;  
  //raceCar.mesh.rotation.y = 1 * Math.PI;
}
const updateRoad = () =>{
  //actualRoad.mesh.rotation.z += .005;
}
const init = event =>{
  createScene();
  createLights();
  createCar();
  createRoad();
  createCan();
  loop();
}

// HANDLE MOUSE EVENTS
let direccion;
window.addEventListener('keydown',(e)=>{
    direccion = e.code;
    raceCar.move(e.code);
},false);
window.addEventListener('load', init, false);
