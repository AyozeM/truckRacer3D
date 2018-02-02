/**
 * Crea el modelo para obstaculos
 * @class
 */
class inpedimentModel{
    /**
     * Constructor
     * @param {ancho del obstaculo} w 
     * @param {alto del obstaculo} h 
     * @param {profundidad del obstaculo} d 
     * @param {color del obstaculo} c
     * @param {Velocidad de movimiento del obstaculo} s
     */
    constructor(w,h,d,c,s = 0.3){
        this.mesh = new THREE.Object3D();
        this.type = "inpediment";
        this.speed = s;
        this.bajada = 0.035*this.speed/0.1;
        this.x = w;
        this.y = h;
        this.z = d;
        this.colour = c;
        this.create();
    }
    /**
     * Compone el obstaculo
     */
    create(){
        let geom = new THREE.BoxGeometry(this.x,this.y,this.z,1,1,1);
        let mat = new THREE.MeshPhongMaterial({
            color:this.colour,
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