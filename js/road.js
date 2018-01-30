
class road{
  constructor(){
    this.mesh = new THREE.Object3D();
    this.create();
    this.mesh.receiveShadow = true;
  }
  
  create(){
    let geom = new THREE.CylinderGeometry(375,375,50,150,10);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    let texturaloader = new THREE.TextureLoader();
    let createTexture = new texturaloader.load('../img/cesped.jpg');
    let mat = new THREE.MeshPhongMaterial({
      color:'green',
      map:createTexture,
      transparent:false,
      opacity:.6,
      shading:THREE.FlatShading,
    });
    let x = new THREE.Mesh(geom, mat);
    this.mesh.add(x);
  }
}   