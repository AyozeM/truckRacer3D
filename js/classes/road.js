/**
 * Crea la pista
 * @class
 */
class road{
  /**
   * Constructor
   */
  constructor(){
    this.mesh = new THREE.Object3D();
    this.create();
    this.lateral1();
    this.lateral2();
    this.mesh.receiveShadow = true;
  }
  /**
   * Crea el cuerpo
   */
  create(){
    let geom = new THREE.CylinderGeometry(375,375,50,150,10);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    let texturaloader = new THREE.TextureLoader();
    let createTexture = new texturaloader.load('../img/cesped.jpg');
    let mat = new THREE.MeshPhongMaterial({
      color:'green',
      map:createTexture,
      opacity:.6,
      shading:THREE.FlatShading,
    });
    let x = new THREE.Mesh(geom, mat);
    this.mesh.add(x);
  }
  lateral1(){
    let geom = new THREE.CylinderGeometry(400,400,50,150,10);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    let texturaloader = new THREE.TextureLoader();
    let createTexture = new texturaloader.load('../img/cesped.jpg');
    let mat = new THREE.MeshPhongMaterial({
      color:'green',
      map:createTexture,
      opacity:.6,
      shading:THREE.FlatShading,
    });
    let x = new THREE.Mesh(geom, mat);
    x.position.z = 50
    this.mesh.add(x);
  }
  lateral2(){
    let geom = new THREE.CylinderGeometry(400,400,50,150,10);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    let texturaloader = new THREE.TextureLoader();
    let createTexture = new texturaloader.load('../img/cesped.jpg');
    let mat = new THREE.MeshPhongMaterial({
      color:'green',
      map:createTexture,
      opacity:.6,
      shading:THREE.FlatShading,
    });
    let x = new THREE.Mesh(geom, mat);
    x.position.z = -50
    this.mesh.add(x);
  }
}   