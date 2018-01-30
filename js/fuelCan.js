class fuelCan{
    constructor(litres){
        this.mesh = new THREE.Object3D();
        this.mesh.name="lata";
        this.create();
        this.litres =  litres;
        this.speed = 0.3;
        this.bajada = 0.035*this.speed/0.1;
    }

    create(){
        let geom = new THREE.BoxGeometry(10,10,5,1,1,1);
        let mat = new THREE.MeshPhongMaterial({
            color:'red',
            shading:THREE.FlatShading
        });
        let can = new THREE.Mesh(geom,mat);
        can.castShadow = true;
        can.reciveShadow = true;
        this.mesh.add(can);
    }
    move(){
        this.mesh.position.z += this.speed; 
        this.mesh.position.y -= this.bajada;       
    }
}