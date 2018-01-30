/**
 * Crea obstaculos
 * @class
 */
class inpediment{
    /**
     * Constructor
     * @param {ancho del obstaculo} w 
     * @param {alto del obstaculo} h 
     * @param {profundidad del obstaculo} d 
     */
    constructor(w,h, d){
        this.mesh = new THREE.Object3D();
        this.speed = 0.3;
        this.bajada = 0.035*this.speed/0.1;
        this.x = w;
        this.y = h;
        this.z = d;
        this.create();
    }
    /**
     * Compone el obstaculo
     */
    create(){
        let geom = new THREE.BoxGeometry(this.x,this.y,this.z,1,1,1);
        let mat = new THREE.MeshPhongMaterial({
            color:'red',
            shading:THREE.FlatShading
        });
        let can = new THREE.Mesh(geom,mat);
        can.castShadow = true;
        can.reciveShadow = true;
        this.mesh.add(can);
    }
    /**
     * Mueve el obstaculo, para dar sensacion de que el camion avanza
     */
    move(){
        this.mesh.position.z += this.speed; 
        this.mesh.position.y -= this.bajada;       
    }
}