/**
 * Clase coche
 * @class
 */
class car {
    constructor(){
        this.mesh = new THREE.Object3D();
        this.mesh.name = "car";
        /**
         * Posicion actual del camion en la pista
         */
        this.actuallyPosition = 0;
        /**
         * Velocidad de giro del camion
         */
        this.velocidad = .5;
        /**
         * Valor absoluto  
         */
        this.tope = 21;
        /**
         * Cantidad de vida con la que cuenta el usuario
         */
        this.life = 100;
        /**
         * Cantidad de gasolina con la que cuenta el usuario
         */
        this.fuel = 100;
        
        this.gandola();
        this.cabina();
        this.wheels();
        this.glasses();
        /**
         * Hace que disminuya la gasolina
         */
        setInterval(()=>{
            this.fuel -= 1;
        },1000);
    }
    /**
     * Crea la gandola
     */
    gandola(){
        let geomCockpit = new THREE.BoxGeometry(60,50,60,1,1,1);
        let matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
        let cockpit = new THREE.Mesh(geomCockpit, matCockpit);
        cockpit.castShadow = true;
        cockpit.receiveShadow = true;
        this.mesh.add(cockpit);
    }
    /**
     * Crea los cristales
     */
    glasses(){
        let glasses = [];
        for (let i = 0; i < 2; i++) {
            let geomGlass = new THREE.BoxGeometry(1,15,25,1,1,1);
            let matGlass = new THREE.MeshPhongMaterial({color:0x68c3c0, shading:THREE.FlatShading});
            let glass = new THREE.Mesh(geomGlass, matGlass);
              glass.castShadow = true;
            glass.receiveShadow = true;
            glass.position.z = -50;
            glass.position.y = 10;
            glasses.push(glass);
            this.mesh.add(glass);        
        }
        glasses[0].position.x = 28.75;
        glasses[1].position.x = -28.75;
    }
    /**
     * Crea la cabina
     */
    cabina(){
        let geomEngine = new THREE.BoxGeometry(58,40,60,1,1,1);
        let matEngine = new THREE.MeshPhongMaterial({color:0x59332e, shading:THREE.FlatShading});
        let engine = new THREE.Mesh(geomEngine, matEngine);
          engine.castShadow = true;
        engine.receiveShadow = true;
        engine.position.z = -40;
        this.mesh.add(engine);
    }
    /**
     * Crea las ruedas
     */
    wheels(){
        let wheels = [];
        for (let i = 0; i < 4; i++) {
            let geomWheel = new THREE.TorusGeometry(8.5,6,16,100);
            let matWhell = new THREE.MeshPhongMaterial({
                color:'black',
                shading:THREE.FlatShading
            });
            let wheel = new THREE.Mesh(geomWheel,matWhell);
            wheel.castShadow = true;
            wheel.receiveShadow = true;
            wheel.rotation.y = .5 * Math.PI;
            wheels.push(wheel);                        
            this.mesh.add(wheel);
        }
        wheels[0].position.x = -25.5;
        wheels[0].position.y = -25;
        wheels[0].position.z = -52;
        
        wheels[1].position.x = 25.5;
        wheels[1].position.y = -25;
        wheels[1].position.z = -52;
        
        wheels[2].position.x = 25.5;
        wheels[2].position.y = -30;
        wheels[2].position.z = 10;

        wheels[3].position.x = -25.5;
        wheels[3].position.y = -30;
        wheels[3].position.z = 10;
    }
    /**
     * Permite que el camion se mueva de derecha a izquierda
     * @param {direccion a la que se quiere mover} direction 
     */
    move(direction){
        switch(direction){
            case 'ArrowLeft':
                if(this.actuallyPosition >= this.tope*-1){
                    this.actuallyPosition-= this.velocidad;
                }else{
                    this.actuallyPosition = (this.tope -5)*-1;
                    this.life -= 5;
                }                     
                this.mesh.rotation.y = .05 * Math.PI;
                break;
            case 'ArrowRight':
                if(this.actuallyPosition <= this.tope){
                    this.actuallyPosition += this.velocidad;

                }else{
                    this.actuallyPosition = this.tope -5;
                    this.life -= 5;
                }
                this.mesh.rotation.y = -.05 * Math.PI;
                break;
            default:
                this.mesh.rotation.y = 0;
                break;
        }
        this.mesh.position.x = this.actuallyPosition;
    }
    /**
     * Inserta gasolina al camion, comprobando que no se rebose el tanque
     * @param {cantidad de gasolina} fuel 
     */
    setFuel(fuel){
        this.fuel += fuel;
        if(this.fuel > 100){
            this.fuel = 100;
        }
    }
}